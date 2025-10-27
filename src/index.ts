import { Elysia } from "elysia";
import { cron } from "@elysiajs/cron";
import { cors } from "@elysiajs/cors";
import { fetchAndSaveBTC } from "./btc.ts";
import { generateBTCChart } from "./chart.ts";
import { sendToDiscord } from "./discord.ts";

const app = new Elysia()
  .use(
    cors({
      origin: true, // Allow all origins
      methods: ["GET"], // Only allow GET requests
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(
    cron({
      name: "btc-update",
      pattern: "0 * * * *", // Every hour
      async run() {
        console.log("⏰ Running hourly BTC notifier...");
        try {
          const { price } = await fetchAndSaveBTC();
          const chart = await generateBTCChart();
          await sendToDiscord(price, chart, "update");
        } catch (error) {
          console.error("Error in cron job:", error);
        }
      },
    }),
  )
  .get("/notify", async () => {
    try {
      const { price } = await fetchAndSaveBTC();
      const chart = await generateBTCChart();
      await sendToDiscord(price, chart, "manual");
      return { status: "sent", price };
    } catch (error) {
      console.error("Error in /notify endpoint:", error);
      throw error;
    }
  });

app.listen(3000);
