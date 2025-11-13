import * as QRCode from "qrcode";
import logger from "../config/logger";

export async function generateQR(url: string, filePath: string) {
  try {
    await QRCode.toFile(filePath, url, {
      color: { dark: "#3a40ffff", light: "#FFF" },
      width: 300,
    });
    logger.info(`✅ QR saved to: ${filePath} with url ${url}`);
  } catch (error: any) {
    logger.error(`QR Generation Error: ${error.message}`);
  }
}
