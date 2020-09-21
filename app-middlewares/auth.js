const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

const router = express.Router();
const dbConfig = require('../dbConfig');

const create = require('../crud/create');
const { error, success } = require('../helpers/responseapi');

router.post('/register', async (req, res) => {
  // console.log(req.body);
  const { username, password, email, name, company_name, address, gstin, account_no, ifsc_code } = req.body;
  const conn = await connection(dbConfig).catch(e => { });
  const result = await create(
    conn,
    'user_account',
    ['username', 'password', 'email', 'name', 'company_name', 'address', 'gstin', 'account_no', 'ifsc_code'],
    [username, { toString: () => `MD5('${password}')` }, email, name,
      company_name, address, gstin, account_no, ifsc_code]
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
          name: user.name || null,
          company_name: user.company_name || null,
          address: user.address || null,
          gstin: user.gstin || null,
          account_no: user.account_no || null,
          ifsc_code: user.ifsc_code || null,
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
    `SELECT * FROM user_account WHERE username=? AND password=MD5(?)`,
    [username, password]
  );
  if (user[0]) {
    res
      .status(201)
      .json(success("OK", {
        data: { ...user[0] }
      }, res.statusCode));
  } else {
    res.status(200).json(error("User not found", res.statusCode));
  }
});

module.exports = router;
