const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

const router = express.Router();
const dbConfig = require('../dbConfig');

const create = require('../crud/create');
const { error, success } = require('../helpers/responseapi');

router.post('/create', async (req, res) => {
    const { name, price_per_unit, gst_percentage,
        basic_unit, limited, in_stock, active_for_sale, p_id } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const result = await create(
        conn,
        'product_history',
        ['name', 'price_per_unit', 'gst_percentage',
            'basic_unit', 'limited', 'in_stock', 'active_for_sale', 'p_id'],
        [name, price_per_unit, gst_percentage,
            basic_unit, limited, in_stock, active_for_sale, p_id]
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
