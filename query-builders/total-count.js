module.exports = (table) => `
Select count(*) as TotalCount from ${table} `;
