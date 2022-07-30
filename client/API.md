# Documentation for API

- POST request and sending transaction objects: 

1. Minting: `/api/api/transaction-object?operation=mint`

Expected Input: 
```
{
    "publicKey": "[YOUR_PUBLIC_KEY]",
    "data" : [
        {
            "itemSerialNumber": "[ITEM_SERIAL_NUMBER]",
            "uri": "[A_DOWNLOADABLE_URI]",
            "unlimitedTransfers": [true/false],
            "numOfTransfers": [NUMBER>=0],
            "period": [DAYS>=0]
        },
        .
        .
        .
    ]
}
```

The data is an array, you can pass in details of multiple objects to mint them
at the same time.

2. Transfer: `/api/api/transaction-object?operation=transfer`

Expected Input: 
```
{
    "publicKey": "[YOUR_PUBLIC_KEY]",
    "data" : {
        "address":"[RECEIVER_ADDRESS]",
        "id": [TOKEN_ID]
    }
}
```

3. Approve: `/api/api/transaction-object?operation=approve`

Expected Input: 
```
{
    "publicKey": "[YOUR_PUBLIC_KEY]",
    "data" : {
        "address":"[ADDRESS_TO_APPROVE]",
        "id": [TOKEN_ID]
    }
}
```

4. Decay: `/api/api/transaction-object?operation=decay`

Expected Input: 
```
{
    "publicKey": "[YOUR_PUBLIC_KEY]",
    "data" : {
        "id": [TOKEN_ID_TO_DECAY]
    }
}
```

5. Replace-Items: `/api/api/transaction-object?operation=replace`

Expected Input: 
```
{
    "publicKey": "[YOUR_PUBLIC_KEY]",
    "data" : {
        "prevId": [TOKEN_ID_TO_REPLACE],
        "newId": [NEW_TOKEN_ID_THAT_REPLACES]
    }
}
```

6. Repair-Items: `/api/api/transaction-object?operation=repair`

Expected Input: 
```
{
    "publicKey": "[YOUR_PUBLIC_KEY]",
    "data" : {
        "id": ,
        "title": "[ITEM_REPAIR_DETAILS]",
        "content": "[ITEM_REPAIR_DETAILS]"
    }
}
```

After any of the above operations the user get back a transaction object, that he would need to sign
on his end, then send it back to the API to conduct a transaction.

A sample transaction object is as follows:
```
"txParams": {
        "gasPrice": "0xba43b7400",
        "gasLimit": "0xf4240",
        "to": "0x3461b50cC500BD72f8F3192741D44958821FeBa0",
        "data": "0x4e462ae2000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000",
        "nonce": "0x2b",
        "maxPriorityFeePerGas": "0x6fc23ac00",
        "maxFeePerGas": "0x12a05f2000"
    }
```

7. Sending a transaction: `/api/transaction`

Expected Input:
```
[
    {
        "signature": "[THE_TRANSACTION_SIGNATURE]"
    }
]
```

After a successful transaction, the user gets back a receipt including return values of emitted functions.

For generating a signature, the user may use the follow code:
```
import {default as _common, Chain, Hardfork, CustomChain} from '@ethereumjs/common';
const Common = _common.default
import pkg from '@ethereumjs/tx'
const { FeeMarketEIP1559Transaction } = pkg;

const priv = "[YOUR_PRIVATE_KEY]"

async function main() {
 
    const txOb = [THE_TRANSACTION_OBJECT_GOES_HERE]

    const txParams = JSON.parse(JSON.stringify(txOb));

    const common = Common.custom({ chainId: 80001 }, { hardfork: Hardfork.London }) 
    // Custom chain configuration for Polygon Mumbai

    const tx = FeeMarketEIP1559Transaction.fromTxData(txParams, { common })
 
    const privateKey = Buffer.from(priv, 'hex')
    const signedTx = tx.sign(privateKey)
    const serializedTx = signedTx.serialize()

    const serializedTxHex = "0x" + serializedTx.toString('hex')
    return serializedTxHex
}

const signature = await main()
console.log(signature)
// This is your signature 
```

- GET requests

1. For getting token id information: `/api/id?id=TOKEN_ID_GOES_HERE`

2. For getting token holdings of an address: `/api/address?address=A_PUBLIC_KEY_GOES_HERE`

The response would be a JSON object containing the required information.