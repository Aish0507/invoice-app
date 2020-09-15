const express = require('express');
const connection = require('../helpers/connection');
const router = express.Router();
const dbConfig = require('../dbConfig');
const create = require('../crud/create');
const { error, success } = require('../helpers/responseapi');
const query = require('../helpers/query');
const performRequest = require("../helpers/perform-internal-request");
const listQuery = require('../query-builders/table-query');
const totalCountQuery = require('../query-builders/total-count');
const constants = require("../helpers/constants");
const update = require('../crud/update');
router.post('/create', async (req, res) => {
    const { name, cat_id, p_model_no,
        p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
        gst_percentage, in_stock } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const result = await create(
        conn,
        'product',
        ['name', 'cat_id', 'p_model_no',
            'p_hsn_code', 'p_color', 'vendor_id', 'p_warranty', 'p_mrp_price', 'p_sale_price',
            'gst_percentage', 'in_stock'],
        [name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, in_stock]
    ).catch(e => {
        res.status(500).json(error("Something went wrong [catch]", res.statusCode));
    })
    if (result) {
        const [product = {}] = result;
        const { name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, in_stock, id } = product;
        const p_id = id;
        performRequest('/product-history/create', 'POST', {
            name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, in_stock,
            p_id
        }, (data) => {
            console.log('History data:', data);
        });
        res
            .status(201)
            .json(success("OK", {
                data: { ...product }
            }, res.statusCode));

    } else {
        res.status(500).json(error("Something went wrong", res.statusCode));
    }
});

router.post('/update', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => { });
    const result = await update(
        conn,
        'product',
        req.body,
        req.body.id
    ).catch(e => {
        res.status(500).json(error("Something went wrong", res.statusCode));
    })
    if (result) {
        console.log(result);
        const { name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, in_stock, id } = req.body;
        const p_id = id;
        performRequest('/product-history/create', 'POST', {
            name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, in_stock,
            p_id
        }, (data) => {
            console.log('History data:', data);
        });
        const [categorie = {}] = result;
        res
            .status(201)
            .json(success("OK", {
                data: { ...categorie }
            }, res.statusCode));
    } else {
        res.status(500).json(error("Something went wrong", res.statusCode));
    }
});
router.get('/list', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => { });
    const limit = req.query.limit || constants.PAGE_LIMIT;
    const page = req.query.page || constants.PAGE_NO
    const offset = (page - 1) * limit
    const is_active = req.query.active || constants.ACTIVE
    const list = await query(conn, listQuery({ limit, offset }, 'product', 'active_for_sale', is_active))
    const totalCount = await query(conn, totalCountQuery('product'))
    let newProductObj = [];
    for (const pList of list) {
        const data = await query(conn, `select p.*, p.name as pName, p.id as pID, v.id as vID,c.id as cID,v.name as vName,c.name as cName, v.*, c.* from product p JOIN vendor v on p.vendor_id= v.id
JOIN categorie c on p.cat_id = c.id where p.id = ${pList.id} ORDER BY p.id DESC limit ${limit} OFFSET ${offset}`)
        newProductObj.push(...data);
        // console.log(`Product Loop: ${JSON.stringify(newProductObj)}`)
    }
    res
        .status(201)
        .json(success("OK", {
            data: newProductObj,
            'page_count': list.length,
            'page_number': page,
            'total_count': totalCount[0].TotalCount
        }, res.statusCode));
});

router.get('/warranty', async (req, res) => {
    res
        .status(201)
        .json(success("OK", {
            data: [...constants.WARRANTY]
        }, res.statusCode));
});
router.post('/soft-delete', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => { });
    const result = await update(
        conn,
        'product',
        req.body,
        req.body.id
    ).catch(e => {
        res.status(500).json(error("Something went wrong", res.statusCode));
    })
    if (result) {
        const [data = {}] = result;
        const { name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, in_stock, id } = req.body;
        const p_id = id;
        performRequest('/product-history/create', 'POST', {
            name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, in_stock,
            p_id
        }, (data) => {
            // console.log('History data:', data);
        });
        res
            .status(201)
            .json(success("OK", {
                data: { ...data }
            }, res.statusCode));
    } else {
        res.status(500).json(error("Something went wrong", res.statusCode));
    }
});
router.post('/update-prd-cnt', async (req, res) => {
    // const { sale_info, with_gst, user_id } = req.body;
    // const conn = await connection(dbConfig).catch(e => { });
    req.body.forEach(element => {
        const { p_model_no,
            p_hsn_code, p_color, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage } = element.product;
        const in_stock = element.product.in_stock - element.quantity;
        const id = element.product.pID;
        const p_id = id;
        const cat_id = element.product.cID;
        const vendor_id = element.product.vID;
        const name = element.product.pName;
        performRequest('/product/update', 'POST', {
            in_stock, id
        }, (data) => {
            console.log('Updated product cnt', data);
            performRequest('/product-history/create', 'POST', {
                name, cat_id, p_model_no,
                p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
                gst_percentage, in_stock,
                p_id
            }, (dataHist) => {
                console.log('Updated product cnt hist', dataHist);
            });
        });
        res
            .status(201)
            .json(success("OK", {
                data: { ...element }
            }, res.statusCode));
        // console.log(element.product.pID, element.quantity, element.product.in_stock, element.product.in_stock - element.quantity);
    });
    // const result = await create(
    //     conn,
    //     'sale',
    //     ['sale_info', 'with_gst', 'user_id'],
    //     [sale_info, with_gst, user_id]
    // ).catch(e => {
    //     res.status(500).json(error("Something went wrong", res.statusCode));
    // })
    // if (result) {
    //     const [sale = {}] = result;
    //     res
    //         .status(201)
    //         .json(success("OK", {
    //             data: { ...sale }
    //         }, res.statusCode));
    // } else {
    //     res.status(500).json(error("Something went wrong", res.statusCode));
    // }
});
module.exports = router;
