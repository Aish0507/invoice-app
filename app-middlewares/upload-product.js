const express = require('express');
const connection = require('../helpers/connection');
const router = express.Router();
const dbConfig = require('../dbConfig');
const bulkInsert = require('../crud/bulk-insert');
const performRequest = require("../helpers/perform-internal-request");
const { error, success } = require('../helpers/responseapi');

router.post('/upload', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => { });
    const result = await bulkInsert(conn, 'product', req.body.data, (err, response) => {
        if (err) {
            res.status(500).json(error("Something went wrong", res.statusCode));
        } else {
            res
                .status(201)
                .json(success("OK", {
                    data: [...response]
                }, res.statusCode));
        }
    })
});
router.post('/upload-bulk', async (req, res) => {
    let keys = Object.keys(req.body.data[0]);
    let values = req.body.data.map(obj => keys.map(key => JSON.stringify(obj[key])));
    var statement = 'INSERT INTO ?? (' + keys.join() + ') VALUES ?';
    const tableName = 'product';
    const conn = await connection(dbConfig).catch(e => { });
    var insertStatement = [tableName, values];
    var sql = conn.format(statement, insertStatement);
    conn.query(sql, function (err, result) {
        if (err) {
            return (err);
        }
        var rowIds = [];
        for (var i = result.insertId; i < result.insertId + result.affectedRows; i++) {
            rowIds.push(i);
        }
        // console.log(values);
        for (let index = 0; index < values.length; index++) {
            const element = values[index];
            element[element.length - 1] = JSON.stringify(rowIds[index]);
        }
        keys[keys.length - 1] = 'p_id';
        productHistoryInBulk(conn, 'product_history', values, keys, res)
        // console.log(values, keys);
    });
});

function productHistoryInBulk(conn, tableName, values, keys, res) {
    var insertStatement = [tableName, values];
    var statement = 'INSERT INTO ?? (' + keys.join() + ') VALUES ?';
    var sql = conn.format(statement, insertStatement);
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json(error("Something went wrong", res.statusCode));
            // return (err);
        }
        performRequest('/product/list', 'GET', null, (data) => {
            console.log('XXXX', JSON.parse(data).results.data)
            res
                .status(201)
                .json(success("OK", {
                    data: [...JSON.parse(data).results.data],
                    'page_count': JSON.parse(data).results.data.length,
                    'page_number': 1,
                    'total_count': values.length
                }, res.statusCode));
        });
    });
}
module.exports = router;
