import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { db } from "./firebase.js";

const width = 800;
const height = 400;
const chart = new ChartJSNodeCanvas({ width, height });

export async function generateBTCChart() {
  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  const snapshot = await db
    .collection("btc_prices")
    .where("timestamp", ">", fiveDaysAgo.toISOString())
    .orderBy("timestamp")
    .get();

  const docs = snapshot.docs.map((doc) => doc.data());
  const labels = docs.map((d) => new Date(d.timestamp).toLocaleString());
  const prices = docs.map((d) => d.price);

  const imageBuffer = await chart.renderToBuffer({
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "BTC/USD (Last 5 Days)",
          data: prices,
          borderColor: "orange",
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: { ticks: { maxTicksLimit: 10 } },
        y: { beginAtZero: false },
      },
      plugins: {
        legend: {
          labels: {
            boxWidth: 0,
          },
        },
      },
      backgroundColor: "white",
    },
  });

  return imageBuffer;
}
