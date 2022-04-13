const Arweave = require('arweave')

const { readFileSync, writeFileSync } = require('fs')

const main = async () => {
  const keyString = process.env.PRIVATE_KEY
  if (keyString === "") throw new Error("no private key")
  const key = JSON.parse(keyString)

  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  })

  const wallet = await arweave.wallets.jwkToAddress(key)
  const winston = await arweave.wallets.getBalance(wallet)
  console.log(
    'Balance left:',
    arweave.ar.winstonToAr(winston)
  )

  const bundle = readFileSync('./dist/bundle.js', { encoding: 'utf-8' })

  let tx = await arweave.createTransaction({
    data: bundle
  }, key)

  await arweave.transactions.sign(tx, key)

  let uploader = await arweave.transactions.getUploader(tx)
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    )
  }

  const status = await arweave.transactions.getStatus(tx.id)
  console.log("Transaction:", tx.id, "Status:", status)
  const record = {
    tx_id: tx.id,
    status,
    version: 'TODO'
  }
  writeFileSync(`${__dirname}/records/${Date.now()}.json`, JSON.stringify(record), { flag: 'w' })

  return status
}

main()
  .then((a) => {
    console.log('Succeeded:', a)
  })
  .catch(e => {
    console.log('Failed', e)
  })
