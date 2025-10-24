// Firebase types
export interface BTCPrice {
  price: number;
  timestamp: string;
}

// API Response types
export interface CoinGeckoResponse {
  bitcoin: {
    usd: number;
  };
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
    fill: boolean;
    backgroundColor: string;
    borderWidth: number;
  }[];
}

export interface ChartOptions {
  scales: {
    x: {
      ticks: { maxTicksLimit: number };
      grid: {
        color: string;
      };
    };
    y: {
      beginAtZero: boolean;
      grid: {
        color: string;
      };
    };
  };
  plugins: {
    legend: {
      labels: {
        boxWidth: number;
      };
    };
  };
  layout: {
    padding: number;
  };
}

// Notification types
export type NotificationType = "startup" | "update" | "manual";

// Discord types
export interface DiscordMessage {
  content: string;
}
