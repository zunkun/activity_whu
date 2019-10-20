const config = require(`./${process.env.NODE_ENV || 'development'}`);

module.exports = config;
