import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController, // Added missing controller
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register all required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController, // Registered here
  Title,
  Tooltip,
  Legend
);

interface SpendingChartProps {
  type: "weekly" | "monthly";
}

const SpendingChart: React.FC<SpendingChartProps> = ({ type }) => {
  // Mock data for spending trends
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Spending (KES)",
        data: [1200, 800, 1500, 2200, 1800, 3200, 2800],
        borderColor: "rgb(42, 59, 143)",
        backgroundColor: "rgba(42, 59, 143, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Income (KES)",
        data: [0, 0, 0, 0, 15000, 0, 0],
        borderColor: "rgb(0, 201, 177)",
        backgroundColor: "rgba(0, 201, 177, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const monthlyData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Spending (KES)",
        data: [
          25000, 22000, 28000, 24000, 30000, 26000, 32000, 29000, 27000, 31000,
          28500, 33000,
        ],
        backgroundColor: "rgba(255, 107, 107, 0.8)",
        borderColor: "rgb(255, 107, 107)",
        borderWidth: 2,
      },
      {
        label: "Income (KES)",
        data: [
          45000, 45000, 45000, 45000, 45000, 45000, 45000, 45000, 45000, 45000,
          45000, 45000,
        ],
        backgroundColor: "rgba(0, 201, 177, 0.8)",
        borderColor: "rgb(0, 201, 177)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      title: {
        display: true,
        text: `${type === "weekly" ? "Weekly" : "Monthly"} Spending Trends`,
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${
              context.dataset.label
            }: KES ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          precision: 0, // Ensure whole numbers
          callback: function (value: any) {
            return "KES " + value.toLocaleString();
          },
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const data = type === "weekly" ? weeklyData : monthlyData;
  const ChartComponent = type === "weekly" ? Line : Bar;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="h-80">
        <ChartComponent data={data} options={options} />
      </div>
    </div>
  );
};

export default SpendingChart;
