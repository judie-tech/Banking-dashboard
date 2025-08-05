import React, { useEffect, useState } from "react";
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
  BarController,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useAuth } from "../../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface SpendingChartProps {
  type: "weekly" | "monthly";
}

const SpendingChart: React.FC<SpendingChartProps> = ({ type }) => {
  const { user } = useAuth();
  const [spending, setSpending] = useState<number[]>([]);
  const [income, setIncome] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/transactions/analytics/${user.id}`
        );

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const data = await res.json();
        const dataset = type === "weekly" ? data.weekly : data.monthly;

        setSpending(dataset.spending);
        setIncome(dataset.income);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [type, user?.id]);

  const chartData = {
    labels:
      type === "weekly"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : [
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
        data: spending,
        backgroundColor: "rgba(255, 107, 107, 0.8)",
        borderColor: "rgb(255, 107, 107)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Income (KES)",
        data: income,
        backgroundColor: "rgba(0, 201, 177, 0.8)",
        borderColor: "rgb(0, 201, 177)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
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
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: `${type === "weekly" ? "Weekly" : "Monthly"} Spending Trends`,
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${
              context.dataset.label
            }: KES ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => "KES " + value.toLocaleString(),
        },
      },
    },
  };

  const ChartComponent = type === "weekly" ? Line : Bar;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="h-80">
        {loading ? (
          <p className="text-center text-gray-500">Loading chart...</p>
        ) : (
          <ChartComponent data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default SpendingChart;
