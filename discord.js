import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; // ← your webhook

export async function sendToDiscord(price, chartBuffer) {
  const filePath = "./btc_chart.png";
  fs.writeFileSync(filePath, chartBuffer);

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("payload_json", JSON.stringify({
    content: `💰 BTC: **$${price}**\n🕒 ${new Date().toLocaleString()}`
  }));

  await axios.post(DISCORD_WEBHOOK_URL, form, { headers: form.getHeaders() });
  console.log("📤 Sent message to Discord!");
}
