module.exports = (pagination) => `
SELECT *
FROM product
ORDER BY id ASC limit ${pagination.limit} OFFSET ${pagination.offset} `;
