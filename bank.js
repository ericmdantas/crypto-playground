const jsonStream = require('duplex-json-stream')
const net = require('net')
const {logERR, PORT, saveLogsToJSON, retrieveLogsToJSON, hashToHex} = require('./utils')

const logs = []
const genesisHash = Buffer.alloc(32).toString('hex')

const server = net.createServer(function (socket) {
  socket = jsonStream(socket)

  socket.on('data', function (entry) {
    console.log('Bank received:', entry)

    switch (entry.cmd) {
        case "balance":
            socket.write({
                cmd: 'balance', 
                balance: rrr(retrieveLogsToJSON()),
            })            
            break
        case "deposit":
            appendLog(entry)
            socket.write({
                cmd: 'deposit', 
                balance: rrr(retrieveLogsToJSON()),
            })
            break
        case "withdraw":
            appendLog(entry)
            socket.write({
                cmd: 'withdraw', 
                balance: rrr(retrieveLogsToJSON()),
            })
            break
        case "default": 
            logERR("unknown cmd")
    }
  })
})

server.listen(PORT)

function rrr(array) {
    return array.reduce((accumulator, currentValue) => {
        switch (currentValue.value.cmd) {
            case "deposit":
                return accumulator + currentValue.value.amount
            case "withdraw":
                return accumulator - currentValue.value.amount
        }
    }, 0)
}

function appendLog(entry) {
    let prevHash = logs.length ? logs[logs.length - 1].hash : genesisHash

    logs.push({
        value: entry,
        hash: hashToHex(prevHash + JSON.stringify(entry))
    })
    saveLogsToJSON(logs)
}