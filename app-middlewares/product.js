const express = require('express');
const connection = require('../helpers/connection');
const router = express.Router();
const dbConfig = require('../dbConfig');
const create = require('../crud/create');
const { error, success } = require('../helpers/responseapi');
const query = require('../helpers/query');
const performRequest = require("../helpers/perform-internal-request");
router.post('/create', async (req, res) => {
    const { name, price_per_unit, gst_percentage,
        basic_unit, limited, in_stock, active_for_sale, vendor_id } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const result = await create(
        conn,
        'product',
        ['name', 'price_per_unit', 'gst_percentage',
            'basic_unit', 'limited', 'in_stock', 'active_for_sale', 'vendor_id'],
        [name, price_per_unit, gst_percentage,
            basic_unit, limited, in_stock, active_for_sale, vendor_id]
    ).catch(e => {
        res.status(500).json(error("Something went wrong [catch]", res.statusCode));
    })
    if (result) {
        const [product = {}] = result;
        const { name, price_per_unit, gst_percentage,
            basic_unit, limited, in_stock, active_for_sale, id } = product;
        const p_id = id;
        performRequest('/product-history/create', 'POST', {
            name, price_per_unit, gst_percentage,
            basic_unit, limited, in_stock, active_for_sale,
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

module.exports = router;