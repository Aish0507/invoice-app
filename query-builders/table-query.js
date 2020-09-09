module.exports = (pagination, table, column, value) => `
SELECT *
FROM ${table}
WHERE ${column} = ${value}
ORDER BY id DESC limit ${pagination.limit} OFFSET ${pagination.offset} `;
