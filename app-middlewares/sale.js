const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

const router = express.Router();
const dbConfig = require('../dbConfig');

const create = require('../crud/create');
const update = require('../crud/update');
const { error, success } = require('../helpers/responseapi');
const listQuery = require('../query-builders/table-query');
const totalCountQuery = require('../query-builders/total-count');
const constants = require("../helpers/constants");
const alphaNumericIncrementer = require("../helpers/number-generator");
router.post('/create', async (req, res) => {
    const { sale_info, with_gst, user_id } = req.body;
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var newID = '';
    const conn = await connection(dbConfig).catch(e => { });
    const lastinsertedID = async () => {
        const result = await query(conn, `select id, invoice_id from sale order by id desc limit 1;`)
        return result
    }
    lastinsertedID().then(data => {
        const [lastID = {}] = data;
        if (lastID.invoice_id) {
            newID = alphaNumericIncrementer.next(`${lastID.invoice_id}`);
        } else {
            newID = alphaNumericIncrementer.next(`${year}/${month}/${date}/00000`);
        }
        createData(newID, sale_info, with_gst, user_id, conn, res)
    })
});
async function createData(...args) {
    const result = await create(
        args[4],
        'sale',
        ['invoice_id', 'sale_info', 'with_gst', 'user_id'],
        [args[0], args[1], args[2], args[3]]
    ).catch(e => {
        args[5].status(500).json(error("Something went wrong", args[5].statusCode));
    })
    if (result) {
        // console.log(result);
        const [sale = {}] = result;
        args[5]
            .status(201)
            .json(success("OK", {
                data: { ...sale }
            }, args[5].statusCode));
    } else {
        args[5].status(500).json(error("Something went wrong", args[5].statusCode));
    }
}
router.get('/list', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => { });
    const limit = req.query.limit || constants.PAGE_LIMIT;
    const page = req.query.page || constants.PAGE_NO
    const offset = (page - 1) * limit
    const is_active = req.query.status || constants.ACTIVE
    const list = await query(conn, `SELECT * FROM sale where with_gst = ${is_active} ORDER BY id DESC limit ${limit} OFFSET ${offset}`)
    const totalCount = await query(conn, totalCountQuery('sale'))
    res
        .status(201)
        .json(success("OK", {
            data: [...list],
            'page_count': list.length,
            'page_number': page,
            'total_count': totalCount[0].TotalCount
        }, res.statusCode));
});
module.exports = router;
