const sodium = require('sodium-native')

const bout = Buffer.alloc(sodium.crypto_generichash_BYTES)
const bin = Buffer.from('Hello, World!')
sodium.crypto_generichash(bout, bin)

console.log(bout.toString('hex'))
console.log("511bc81dde11180838c562c82bb35f3223f46061ebde4a955c27b3f489cf1e03")