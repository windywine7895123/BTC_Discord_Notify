import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { db } from "./firebase.ts";
import { ChartData, ChartOptions, BTCPrice } from "./types.ts";

const width = 800;
const height = 400;
const chart = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: "white",
});

export async function generateBTCChart(): Promise<Buffer> {
  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  const snapshot = await db
    .collection("btc_prices")
    .where("timestamp", ">", fiveDaysAgo.toISOString())
    .orderBy("timestamp")
    .get();

  const docs = snapshot.docs.map((doc) => doc.data() as BTCPrice);
  const labels = docs.map((d) => new Date(d.timestamp).toLocaleString());
  const prices = docs.map((d) => d.price);

  const chartData: ChartData = {
    labels,
    datasets: [
      {
        label: "BTC/USD (Last 5 Days)",
        data: prices,
        borderColor: "orange",
        tension: 0.3,
        fill: true,
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions = {
    scales: {
      x: {
        ticks: { maxTicksLimit: 10 },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 0,
        },
      },
    },
    layout: {
      padding: 20,
    },
  };

  const imageBuffer = await chart.renderToBuffer({
    type: "line",
    data: chartData,
    options: chartOptions,
  });

  return imageBuffer;
}
