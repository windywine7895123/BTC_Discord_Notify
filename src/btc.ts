import axios from "axios";
import { db } from "./firebase.ts";
import { BTCPrice, CoinGeckoResponse } from "./types.ts";

export async function fetchAndSaveBTC(): Promise<{
  price: number;
  timestamp: string;
}> {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
  const { data } = await axios.get<CoinGeckoResponse>(url);
  const price = data.bitcoin.usd;
  const now = new Date().toISOString();

  // Delete data older than 5 days
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const fiveDaysAgoISO = fiveDaysAgo.toISOString();

  const querySnapshot = await db
    .collection("btc_prices")
    .where("timestamp", "<", fiveDaysAgoISO)
    .get();

  const batch = db.batch();
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  await db.collection("btc_prices").add({ price, timestamp: now } as BTCPrice);
  console.log("💾 Saved BTC price:", price);

  return { price, timestamp: now };
}
