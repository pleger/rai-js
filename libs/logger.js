//todo: this should be eliminated!

const log4js = require('log4js');
let logger = log4js.getLogger();

log4js.configure({
    appenders: { FILE_ERROR: { type: 'file', filename: 'error.log' },
                 LOG: {type: 'console'}},
    categories: { default: { appenders: ['LOG'], level: 'error' } }
});

module.exports = logger;