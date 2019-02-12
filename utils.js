const fs = require('fs')
const sodium = require('sodium-native')

exports.PORT = 3876

exports.logERR = function(msg) {
    console.error(`ERR -> ${msg}`)
}

exports.saveLogsToJSON = function(info) {
    fs.writeFileSync('bank_logs.json', JSON.stringify(info))
}

exports.retrieveLogsToJSON = function() {
    if (!fs.existsSync('bank_logs.json')) {
        return []
    }

    return JSON.parse(fs.readFileSync('bank_logs.json'))
}

exports.hashToHex = function(info) {
    const bo = Buffer.alloc(sodium.crypto_generichash_BYTES)    
    const bi= Buffer.from(info)

    sodium.crypto_generichash(bo, bi)

    return bo.toString('hex')
}