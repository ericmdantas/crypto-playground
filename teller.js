var jsonStream = require('duplex-json-stream')
var net = require('net')
var {PORT} = require('./utils')

var client = jsonStream(net.connect(PORT))

client.on('data', function (msg) {
  console.log('Teller received:', msg)
})

const cmd = process.argv[2]
const amount = process.argv[3]

switch (cmd) {
    case "balance":
    case "--balance":
    case "-b":
        client.end({
            cmd: 'balance'
        })
        break;
    
    case "deposit":
    case "--deposit":
    case "-d":
        if (!amount) {
            logERR('Deposit needs an amount')
            return
        }

        if (~~amount <= 0) {
            logERR('Amount needs to be > 0')
            return
        }

        client.end({
            cmd: 'deposit', 
            amount: ~~amount
        })
        break;

    case "withdraw":
    case "--withdraw":
    case "-w":
        if (!amount) {
            logERR('Withdraw needs an amount')
            return
        }

        if (~~amount <= 0) {
            logERR('Amount needs to be > 0')
            return
        }

        client.end({
            cmd: 'withdraw', 
            amount: ~~amount
        })
        break;

    default: 
        logERR('Unknown cmd')
        client.end()
}
