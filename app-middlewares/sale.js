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
router.post('/create', async (req, res) => {
    const { sale_info, with_gst, user_id } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const result = await create(
        conn,
        'sale',
        ['sale_info', 'with_gst', 'user_id'],
        [sale_info, with_gst, user_id]
    ).catch(e => {
        res.status(500).json(error("Something went wrong", res.statusCode));
    })
    if (result) {
        const [sale = {}] = result;
        res
            .status(201)
            .json(success("OK", {
                data: { ...sale }
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
    const list = await query(conn, listQuery({ limit, offset }, 'categorie', 'is_active', is_active))
    const totalCount = await query(conn, totalCountQuery('categorie'))
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
