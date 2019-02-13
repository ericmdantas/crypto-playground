const jsonStream = require('duplex-json-stream')
const net = require('net')
const {logERR, PORT, saveLogsToFile, retrieveLogsFromFile, hashToHex} = require('./utils')

const logs = retrieveLogsFromFile()
const genesisHash = Buffer.alloc(32).toString('hex')

verifyIntegrity(logs)

const server = net.createServer(function (socket) {
  socket = jsonStream(socket)

  socket.on('data', function (entry) {
    console.log('Bank received:', entry)

    switch (entry.cmd) {
        case "balance":
            socket.write({
                cmd: 'balance', 
                balance: rrr(retrieveLogsFromFile()),
            })            
            break
        case "deposit":
            appendToLog(entry)
            socket.write({
                cmd: 'deposit', 
                balance: rrr(retrieveLogsFromFile()),
            })
            break
        case "withdraw":
            appendToLog(entry)
            socket.write({
                cmd: 'withdraw', 
                balance: rrr(retrieveLogsFromFile()),
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
        if (!currentValue || !currentValue.value) {
            return 0
        }

        switch (currentValue.value.cmd) {
            case "deposit":
                return accumulator + currentValue.value.amount
            case "withdraw":
                return accumulator - currentValue.value.amount
        }
    }, 0)
}

function verifyIntegrity(logs) {
    if (!logs.length) {
        return
    }

    for (let i in logs) { 
        let prevHash = logs[i].hash
        let calcNextHash = hashToHex(prevHash + logs[i+1] ? logs[i+1].value : logs[i].value)

        if (prevHash !== calcNextHash) {
            console.error(`Hashes are different: \n${prevHash}\n${nextHash}`)
            throw new Error('Corrupted bank_logs.json')
        }
    }
}

function appendToLog(entry) {
    let prevHash = logs.length ? logs[logs.length - 1].hash : genesisHash

    logs.push({
        value: entry,
        hash: hashToHex(prevHash + JSON.stringify(entry))
    })
    saveLogsToFile(logs)
}