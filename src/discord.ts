import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { DiscordMessage, NotificationType } from "./types.ts";
import { env } from "./env.ts";

export async function sendToDiscord(
  price: number,
  chartBuffer: Buffer,
  type: NotificationType = "update",
): Promise<void> {
  const filePath = "./btc_chart.png";
  fs.writeFileSync(filePath, chartBuffer);

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const statusEmoji =
    type === "startup" ? "🚀" : type === "update" ? "💰" : "ℹ️";
  const message: DiscordMessage = {
    content: `${statusEmoji} BTC: **$${price.toLocaleString()}**\n🕒 ${new Date().toLocaleString()}${
      type === "startup"
        ? "\n✨ Bot has started and is now monitoring BTC prices!"
        : ""
    }`,
  };

  form.append("payload_json", JSON.stringify(message));

  try {
    await axios.post(env.DISCORD_WEBHOOK_URL, form, {
      headers: form.getHeaders(),
    });
    console.log("📤 Sent message to Discord!");
  } catch (error) {
    console.error("Failed to send message to Discord:", error);
    throw error;
  } finally {
    // Clean up the temporary file
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.warn("Failed to clean up temporary chart file:", error);
    }
  }
}
