const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

const router = express.Router();
const dbConfig = require('../dbConfig');
const { success, error } = require('../helpers/responseapi');

// GET
// /user
router.get('/', async (req, res) => {
  const user = 1;
  const conn = await connection(dbConfig).catch(e => { });
  const currentUser = await query(conn, `SELECT * FROM user_account
    WHERE id = ?`, [user])
  if (currentUser[0]) {
    res
      .status(201)
      .json(success("OK", {
        data: { ...currentUser[0] }
      }, res.statusCode));
  } else {
    res.status(404).json(error("User not found", res.statusCode));
  }
});
module.exports = router;
