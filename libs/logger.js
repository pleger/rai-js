const log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = 'debug';

log4js.configure({
    appenders: { FILE_ERROR: { type: 'file', filename: 'error.log' },
                 LOG: {type: 'console'}},
    categories: { default: { appenders: ['LOG'], level: 'trace' } }
});

module.exports = logger;