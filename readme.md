# Suzume TON Deployment Test
- This repo serves as a test of token deployment on TON, in preparation of launching the NFTs in the Suzume ecosystem
- Suzume only supports standard NFT for now, therefore we are leveraging the [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk) for the smart contracts.

## Mint NFT
- Install dependencies `yarn`
- Rename the `.env.template` as `.env`, and fill in the variables.
- Deploy the NFT collection contract:
```
ts-node mint-nft-collection.ts
```
- Mint NFT items
```
ts-node mint-nft-item.ts
```
- As long as the metadata follows [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes), the deployed NFT collection and items can be automatically indexed by NFT marketplace.
  - Example: https://testnet.getgems.io/collection/EQAuwZQwkCbP2NHpoyAUdD608oQ_N8OZiRCb9W6R80KT0wEZ


## Environment variables

| Name                                     | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| `PINATA_API_KEY`, `PINATA_SECRET`| API keys from [pinata.cloud](https://pinata.cloud)|
| `MNEMONICS`                               | 24 mnemonic words of owner wallet        |
| `TONCENTER_API_KEY`                      | API key from [@tonapibot](https://t.me/tonapibot) / [@tontestnetapibot](https:/t.me/tontestnetapibot)        

# Todo
- Test the indexing of NFT transactions
- Test uploading image and metadata to S3
