const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./dbConfig');
const userRouter = require('./app-middlewares/user');
const authRouter = require('./app-middlewares/auth');
const productRouter = require('./app-middlewares/product');
const vendorRouter = require('./app-middlewares/vendor');
const categorieRouter = require('./app-middlewares/categorie');
const productHistoryRouter = require('./app-middlewares/product-history');
const productUploadRouter = require('./app-middlewares/upload-product');
const app = express();
const port = 3000;

app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse various different custom JSON types as JSON

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

const connection = require('./helpers/connection');
const query = require('./helpers/query');

app.get('/', (req, res) => res.send('Invoice APP!'));

app.get('/list', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { });
  const results = await query(conn, 'SELECT * FROM user_account').catch(console.log);
  res.json({ results });
})

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/vendor', vendorRouter);
app.use('/product-history', productHistoryRouter);
app.use('/upload-product', productUploadRouter);
app.use('/category', categorieRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
