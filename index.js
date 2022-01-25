if (process.env.WEB) {
    module.exports = require('./lib/web-start');
} else {
    module.exports = require('./src/node-start');
}