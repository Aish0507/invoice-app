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
    const { name, description } = req.body;
    const conn = await connection(dbConfig).catch(e => { });
    const result = await create(
        conn,
        'categorie',
        ['name', 'description'],
        [name, description]
    ).catch(e => {
        res.status(500).json(error("Something went wrong", res.statusCode));
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

router.post('/update', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => { });
    const result = await update(
        conn,
        'categorie',
        req.body,
        req.body.id
    ).catch(e => {
        res.status(500).json(error("Something went wrong", res.statusCode));
    })
    if (result) {
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
router.post('/soft-delete', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => { });
    const result = await update(
        conn,
        'categorie',
        req.body,
        req.body.id
    ).catch(e => {
        res.status(500).json(error("Something went wrong", res.statusCode));
    })
    if (result) {
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

module.exports = router;
