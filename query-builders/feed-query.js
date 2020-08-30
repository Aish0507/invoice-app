module.exports = (user, pivot) => `
SELECT id, username, tweet, timestamp
FROM product
ORDER BY id DESC
LIMIT 0, 50`;
