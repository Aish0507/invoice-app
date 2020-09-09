const query = require('../helpers/query');

/**
 * @param  {} conn MySQL Connection reference
 * @param  {String} table Table to insert the values
 * @param  {[String]} columns Array of column names
 * @param  {[String]} values Array of values for those column names, can be multidientional
 */
module.exports = async (conn, table, columnsValues, id) => {
    try {
        const dataSet = await query(conn, `UPDATE ${table} SET ? WHERE ID = ?`, [columnsValues, id]).catch(e => { });
        if (dataSet.affectedRows) {
            return await query(conn, `SELECT * FROM ${table} WHERE ID=?`, [id]);
        }
        return dataSet;
    } catch (e) { throw (e) }
}
