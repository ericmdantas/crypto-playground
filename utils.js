const fs = require('fs')

exports.PORT = 3876

exports.logERR = function(msg) {
    console.error(`ERR -> ${msg}`)
}

exports.saveLogsToJSON = function(info) {
    fs.writeFileSync('bank_logs.json', JSON.stringify(info))
}

exports.retrieveLogsToJSON = function() {
    return fs.readFileSync('bank_logs.json').data
}