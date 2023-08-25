import { createClient } from "redis";
import logger from "./logger.js";
const client = createClient();

const cacheService = {
  set: async (req, data) => {
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
  },

  get: async (key) => {  
    try {
      client.on('error', err => console.log('Redis Client Error', err));
      await client.connect();

      const value = await client.get(key);
      await client.disconnect();

      if(value) {
        const data = JSON.parse(value)
        return data
      }

      return null
    } catch (err) {
      await client.disconnect();
      throw err
    }
  }

}

export default cacheService