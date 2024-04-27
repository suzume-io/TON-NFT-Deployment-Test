import * as dotenv from "dotenv";
import {
  AssetsSDK,
  createApi,
  createSender,
  importKey,
} from "@ton-community/assets-sdk";
import { readFile } from "fs/promises";
import path from "path";
import { Address } from "@ton/core";

dotenv.config();
const NETWORK = "testnet";
// For now, the address needs to be manually found through transactions on tonscan, but it can be easily recorded as well
const COLLECTION = "EQAuwZQwkCbP2NHpoyAUdD608oQ_N8OZiRCb9W6R80KT0wEZ";
const IMAGE_FOLDER_PATH = "content-template";
const IMAGE_FILE_PATH = `image.png`;
// const IMAGE_FOLDER_PATH = "./data/images";
// const IMAGE_FILE_PATH = `${Math.round(Math.random() * 100) % 5}.jpg`;

async function init() {
  const api = await createApi(NETWORK);
  const keyPair = await importKey(process.env.MNEMONICS!);
  const sender = await createSender("highload-v2", keyPair, api);

  const storage = {
    pinataApiKey: process.env.PINATA_API_KEY!,
    pinataSecretKey: process.env.PINATA_SECRET!,
  };

  const sdk = AssetsSDK.create({
    api: api,
    sender: sender,
    storage: storage,
  });

  const collection = sdk.openNftCollection(Address.parse(COLLECTION));

  console.log("Reading Image file...");
  const filePath = path.join(
    IMAGE_FOLDER_PATH,
    IMAGE_FILE_PATH
  );
  console.log(filePath);
  const imageFile = await readFile(filePath);
  console.log("Uploading Image...");
  const uploadedImage = await sdk.storage.uploadFile(imageFile);

  console.log("Uploading Metadata...");
  const content = Buffer.from(
    JSON.stringify({
      name: "Test NFT",
      description: "This is a test NFT",
      image: uploadedImage,
      "attributes":[{"trait_type":"Awesomeness","value":"Super cool"}],
    }), "utf-8"
  );

  const metadata = await sdk.storage.uploadFile(content);

  console.log("Minting NFT...");
  const { nextItemIndex: index } = await collection.getData();
  await collection.sendMint(sender, {
    index: index,
    owner: sdk.sender?.address!,
    individualContent: metadata,
  });
  console.log("NFT minted");
  const nftItem = await collection.getItem(index);
  console.log("NFT Item address", nftItem.address);
}

void init();
