const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

const router = express.Router();
const dbConfig = require('../dbConfig');

const create = require('../crud/create');
const { error, success } = require('../helpers/responseapi');
const constants = require("../helpers/constants");
router.post('/create', async (req, res) => {
    const { name, cat_id, p_model_no,
        p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
        gst_percentage, in_stock,
        p_id, active_for_sale } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const result = await create(
        conn,
        'product_history',
        ['name', 'cat_id', 'p_model_no',
            'p_hsn_code', 'p_color', 'vendor_id', 'p_warranty', 'p_mrp_price', 'p_sale_price',
            'gst_percentage', 'in_stock',
            'p_id', 'active_for_sale'],
        [name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, in_stock,
            p_id, (active_for_sale === null || active_for_sale === undefined) ? 1 : active_for_sale ? 1 : 0]
    ).catch(e => {
        res.status(500).json(error("Something went wrong [catch]", res.statusCode));
    })
    if (result) {
        const [product = {}] = result;
        res
            .status(201)
            .json(success("OK", {
                data: { ...product }
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
    const list = await query(conn, `SELECT ph.*, ph.name as pName, ph.id as pID, v.id as vID,c.id as cID,v.name as vName,c.name as cName, v.*, c.*, p.time_created as pCreatedTime, ph.time_updated as phUpdatedTime FROM product_history ph JOIN vendor v on ph.vendor_id= v.id
JOIN categorie c on ph.cat_id = c.id JOIN product p on p.id 
= ph.p_id  where ph.p_id = ${req.query.id} ORDER BY ph.id DESC limit ${limit} OFFSET ${offset}`)
    console.log(list);
    res
        .status(201)
        .json(success("OK", {
            data: [...list],
            'page_count': list.length,
            'page_number': page
        }, res.statusCode));
});

module.exports = router;
