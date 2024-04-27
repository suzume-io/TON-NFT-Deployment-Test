import {readFileSync} from "fs";
import {resolve} from "path";

export const TEST_NFT_CONTENT_TEMPLATE = {
  uri: "https://suzume.io",
  name: "Test NFT Collection",
  description: "The early bird catches the worm",
} as const;

export const TEST_NFT_IMAGE = readFileSync(resolve(__dirname, './image.png'));

export const TEST_NFT_NAME = "Test NFT Collection";