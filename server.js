// require('dotenv').config();
var path = require('path');
var fs = require('fs');
var Web3 = require('web3');
let toAddress = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'accounts.js'), 'utf-8'));
const Tx = require('ethereumjs-tx').Transaction
const web3 = new Web3(Web3.givenProvider || "https://rpc.apothem.network")
let amountToSend = 100
var myAddress = "0x91c855707e53eac1875b475f3e7fafc7dcfaeb2f";
let airDropXDC = amountToSend*1e18
    // Use Gwei for the unit of gas price
var gasPriceGwei = 3;
var gasLimit = 21000;
const main = async () => {
    var count = await web3.eth.getTransactionCount(myAddress);
    let signTxH = []
    for(i=0;i<toAddress.length;i++){
    // console.log(`Total Tx :- ${i+1}/${toAddress.length}`)
    // console.log(`num transactions so far: ${count} ${toAddress[i]}`);
    // var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
    // var contract = new web3.eth.Contract(abiArray, contractAddress, {
    //     from: myAddress
    // });
    // var balance = await contract.methods.balanceOf(myAddress).call();
    // console.log(`Balance before send: ${financialMfil(balance)} MFIL\n------------------------`);
    
    // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net
    var rawTransaction = {
        "from": myAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": toAddress[i],
        "value": airDropXDC
    };
    // console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`);
    // The private key for myAddnress in .env
    var privKey = new Buffer("", 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    signTxH.push('0x' + serializedTx.toString('hex'))
    // Comment out these four lines if you don't really want to send the TX right now
    // console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
    var receipt = await web3.eth.sendSignedTransaction(signTxH[i],(error, txHash)  =>{
        if (error) throw error;
        console.log(`Total Tx :- ${i+1}/${toAddress.length}     To :- ${toAddress[i]}    txHash :- ${txHash}    Value :- ${amountToSend} `)

    });
    
    // The receipt info of transaction, Uncomment for debug
    // console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
    // The balance may not be updated yet, but let's check
    // let balance = await web3.eth.getBalance(myAddress)
    // console.log(`Balance after send: ${balance} XDC`);
    count = count + 1
    console.log(signTxH.length)
    }
}
main();