module.exports = (pagination) => `
SELECT *
FROM product
ORDER BY id DESC limit ${pagination.limit} OFFSET ${pagination.offset} `;
