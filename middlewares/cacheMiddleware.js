import { createClient } from "redis";
const client = createClient();

export default async (req, res, next) => {
  const key = req.user.id + " " + req.method + " " + req.originalUrl;
  try {
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    const value = await client.get(key);
    if(value) {
      const data = JSON.parse(value)
      return res.status(200).send({ fromCache: true, message: "Cache retrieved", data })
    }
    next()
  } catch (err) {
    await client.disconnect();
    next(err)
  } finally {
    await client.disconnect();
  }
}
