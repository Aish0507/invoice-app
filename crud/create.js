const query = require('../helpers/query');
const valuesForQuery = require('../helpers/values-for-insert');

/**
 * @param  {} conn MySQL Connection reference
 * @param  {String} table Table to insert the values
 * @param  {[String]} columns Array of column names
 * @param  {[String]} values Array of values for those column names, can be multidientional
 */
module.exports = async (conn, table, columns, values) => {
  const VALUES = valuesForQuery(values)
  try {
    const dataSet = await query(conn, `INSERT INTO ${table}(${columns.join(', ')}) VALUES ${VALUES};`).catch(e => { });
    if (dataSet.insertId) {
      console.log('create CRUD', dataSet);
      return await query(conn, `SELECT * FROM ${table} WHERE ID=?`, [dataSet.insertId]);
    }
    return dataSet;
  } catch (e) { throw (e) }
}
