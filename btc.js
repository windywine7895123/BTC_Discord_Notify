import axios from "axios";
import { db } from "./firebase.js";

export async function fetchAndSaveBTC() {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
  const { data } = await axios.get(url);
  const price = data.bitcoin.usd;
  const now = new Date().toISOString();

  // Delete data older than 5 days
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const fiveDaysAgoISO = fiveDaysAgo.toISOString();

  await db
    .collection("btc_prices")
    .where("timestamp", "<", fiveDaysAgoISO)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });

  await db.collection("btc_prices").add({ price, timestamp: now });
  console.log("💾 Saved BTC price:", price);

  return { price, timestamp: now };
}
