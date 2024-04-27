import * as dotenv from "dotenv";

import {toNano} from "@ton/core";
import {AssetsSDK, createApi, createSender, importKey, PinataStorageParams} from "@ton-community/assets-sdk";

dotenv.config();

async function main() {
    const NETWORK = 'testnet';
    const api = await createApi(NETWORK);

    const keyPair = await importKey(process.env.MNEMONICS!);
    // There are multiple versions of wallet on TON.
    // The same MNEMONICS can generate different wallet addresses under different versions
    // Make sure your wallet is highload-v2 to use the SDK
    // Ref: https://docs.ton.org/participate/wallets/contracts
    const sender = await createSender('highload-v2', keyPair, api);

    const storage = {
        pinataApiKey: process.env.PINATA_API_KEY!,
        pinataSecretKey: process.env.PINATA_SECRET!,
    }

    const sdk = AssetsSDK.create({
        api: api,
        storage: storage,
        sender: sender,
    });

    console.log('Using wallet', sdk.sender?.address);

    const jetton = await sdk.deployJetton({
        name: 'Test jetton 4',
        decimals: 9,
        description: 'Test jetton',
        symbol: 'TEST',
    }, {
        adminAddress: sdk.sender?.address!,
        premintAmount: toNano('100'),
    });

    console.log('Created jetton with address', jetton.address);
}

main().catch(console.error);