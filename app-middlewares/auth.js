const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

const router = express.Router();
const dbConfig = require('../dbConfig');

const create = require('../crud/create');
const { error, success } = require('../helpers/responseapi');

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const conn = await connection(dbConfig).catch(e => { });
  const result = await create(
    conn,
    'user_account',
    ['username', 'password', 'email'],
    [username, { toString: () => `MD5('${password}')` }, email]
  ).catch(e => {
    res.status(500).json(error("Something went wrong", res.statusCode));
  })
  if (result) {
    const [user = {}] = result;
    res
      .status(201)
      .json(success("OK", {
        data: {
          id: user.id || null,
          username: user.username || null,
          email: user.email || null,
        }
      }, res.statusCode));
  } else {
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
});

router.post('/login', async (req, res) => {
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
