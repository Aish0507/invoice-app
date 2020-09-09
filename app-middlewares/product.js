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
router.post('/create', async (req, res) => {
    const { name, cat_id, p_model_no,
        p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
        gst_percentage, limited, in_stock } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const result = await create(
        conn,
        'product',
        ['name', 'cat_id', 'p_model_no',
            'p_hsn_code', 'p_color', 'vendor_id', 'p_warranty', 'p_mrp_price', 'p_sale_price',
            'gst_percentage', 'limited', 'in_stock'],
        [name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, limited, in_stock]
    ).catch(e => {
        res.status(500).json(error("Something went wrong [catch]", res.statusCode));
    })
    if (result) {
        const [product = {}] = result;
        const { name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, limited, in_stock } = product;
        const p_id = id;
        performRequest('/product-history/create', 'POST', {
            name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, limited, in_stock,
            p_id
        }, (data) => {
            // console.log('History data:', data);
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
    const { username, password } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const user = await query(
        conn,
        `SELECT id, username, email FROM user_account WHERE username=? AND password=MD5(?)`,
        [username, password]
    );
    if (user[0]) {
        res
            .status(201)
            .json(success("OK", {
                data: { ...user[0] }
            }, res.statusCode));
    } else {
        res.status(404).json(error("User not found", res.statusCode));
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
    res
        .status(201)
        .json(success("OK", {
            data: [...list],
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
module.exports = router;
