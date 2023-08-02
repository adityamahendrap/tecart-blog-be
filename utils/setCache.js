import { createClient } from "redis";
import logger from "./logger.js";
const client = createClient();

export default async (req, data) => {
  const key = req.user.id + " " + req.method + " " + req.originalUrl;

  try {
    const expirationTime = 10;
    const fdata = JSON.stringify(data)
    await client.connect();
    await client.set(key, fdata);
    await client.set(key, fdata, { EX: expirationTime });
    logger.info("Cache created");
  } catch (err) {
    throw err
  } finally {
    await client.disconnect();
  }
};
