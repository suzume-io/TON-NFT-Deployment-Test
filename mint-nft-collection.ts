import * as dotenv from "dotenv";
import {
  AssetsSDK,
  createApi,
  createSender,
  importKey,
  NftContent,
} from "@ton-community/assets-sdk";
import {TEST_NFT_CONTENT_TEMPLATE, TEST_NFT_IMAGE} from "./content-template/test-nft-collection";

dotenv.config();

const NFT_CONTENT_TEMPLATE: NftContent = TEST_NFT_CONTENT_TEMPLATE;
const NFT_IMAGE: Buffer = TEST_NFT_IMAGE;
const NETWORK = "testnet";

async function init() {
  const api = await createApi(NETWORK);
  const keyPair = await importKey(process.env.MNEMONICS!);
  // There are multiple versions of wallet on TON.
  // The same MNEMONICS can generate different wallet addresses under different versions
  // Make sure your wallet is highload-v2 to use the SDK
  // Ref: https://docs.ton.org/participate/wallets/contracts
  const sender = await createSender("highload-v2", keyPair, api);

  const storage = {
    pinataApiKey: process.env.PINATA_API_KEY!,
    pinataSecretKey: process.env.PINATA_SECRET!,
  };

  const sdk = AssetsSDK.create({
    api: api,
    storage: storage,
    sender: sender,
  });

  console.log("Using wallet", sdk.sender?.address);

  const adminAddress = sdk.sender?.address;
  const imageUrl = await sdk.storage.uploadFile(NFT_IMAGE);

  const content: NftContent = {
    ...NFT_CONTENT_TEMPLATE,
    image: imageUrl,
  };

  // upload nft content, same for all nfts in the collection
  const commonContent = await sdk.storage.uploadFile(
    Buffer.from(JSON.stringify(content), "utf-8")
  );

  // NFT metadata explanation:
  // https://docs.ton.org/develop/dapps/tutorials/collection-minting#references
  const collection = await sdk.deployNftCollection(
    {
      collectionContent: content,
      commonContent: commonContent,
    },
    {
      adminAddress: adminAddress,
    }
  );

  console.log("NFT contract deployed");
}

void init();
