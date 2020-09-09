const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

const router = express.Router();
const dbConfig = require('../dbConfig');

const create = require('../crud/create');
const { error, success } = require('../helpers/responseapi');

router.post('/create', async (req, res) => {
    const { name, cat_id, p_model_no,
        p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
        gst_percentage, limited, in_stock,
        p_id } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const result = await create(
        conn,
        'product_history',
        ['name', 'cat_id', 'p_model_no',
            'p_hsn_code', 'p_color', 'vendor_id', 'p_warranty', 'p_mrp_price', 'p_sale_price',
            'gst_percentage', 'limited', 'in_stock',
            'p_id'],
        [name, cat_id, p_model_no,
            p_hsn_code, p_color, vendor_id, p_warranty, p_mrp_price, p_sale_price,
            gst_percentage, limited, in_stock,
            p_id]
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

module.exports = router;
