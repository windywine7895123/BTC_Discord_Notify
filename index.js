import { Elysia } from "elysia";
import { fetchAndSaveBTC } from "./btc.js";
import { generateBTCChart } from "./chart.js";
import { sendToDiscord } from "./discord.js";
import cron from "node-cron";

const app = new Elysia();

// Route to manually trigger the notification
app.get("/notify", async () => {
  const { price } = await fetchAndSaveBTC();
  const chart = await generateBTCChart();
  await sendToDiscord(price, chart);
  return { status: "sent", price };
});

// Optional: run automatically every 1 hour
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Running hourly BTC notifier...");
  const { price } = await fetchAndSaveBTC();
  const chart = await generateBTCChart();
  await sendToDiscord(price, chart);
});

app.listen(3000);
console.log("🚀 Elysia server running at http://localhost:3000");
