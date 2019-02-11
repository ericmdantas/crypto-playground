var jsonStream = require('duplex-json-stream')
var net = require('net')
var {logERR, PORT, saveLogsToJSON} = require('./utils')

var logs = []

var server = net.createServer(function (socket) {
  socket = jsonStream(socket)

  socket.on('data', function (msg) {
    console.log('Bank received:', msg)

    switch (msg.cmd) {
        case "balance":
            socket.write({
                cmd: 'balance', 
                balance: rrr(logs),
            })            
            break
        case "deposit":
            logs.push(msg)
            saveLogsToJSON(logs)
            socket.write({
                cmd: 'deposit', 
                balance: rrr(logs),
            })
            break
        case "withdraw":
            logs.push(msg)
            saveLogsToJSON(logs)
            socket.write({
                cmd: 'withdraw', 
                balance: rrr(logs),
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
        switch (currentValue.cmd) {
            case "deposit":
                return accumulator + currentValue.amount
            case "withdraw":
                return accumulator - currentValue.amount
        }
    }, 0)
}