const query = require('../helpers/query');
const valuesForQuery = require('../helpers/values-for-insert');

/**
 * @param  {} conn MySQL Connection reference
 * @param  {String} table Table to insert the values
 * @param  {[String]} objectArray Array of column names
 * @param  {[String]} callBack Array of callBack for those column names, can be multidientional
 */
module.exports = async (conn, table, objectArray, callBack) => {
    let keys = Object.keys(objectArray[0]);
    let values = objectArray.map(obj => keys.map(key => JSON.stringify(obj[key])));
    try {
        // const dataSet = await query(conn, `INSERT INTO ${table}(${keys.join(', ')}) VALUES (${values})`).catch(e => { });
        const dataSet = conn.query(`INSERT INTO ${table}(${keys.join(', ')}) VALUES ?`, [values], (err, res) => {
            if (err) {
                callBack(err)
            } else {
                callBack(null, values)
            }
        })
        return dataSet;
    } catch (e) { throw (e) }
}
