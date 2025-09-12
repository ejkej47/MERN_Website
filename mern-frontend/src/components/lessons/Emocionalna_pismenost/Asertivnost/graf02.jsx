import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AssertivenessGraph({ scores }) {
  const data = {
    labels: ["Flight", "Attack", "Manipulation", "Harmonious"],
    datasets: [
      {
        label: "Your score",
        data: [
          scores.flight,
          scores.attack,
          scores.manipulation,
          scores.harmonious,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",   // Flight
          "rgba(255, 159, 64, 0.6)",   // Attack
          "rgba(255, 205, 86, 0.6)",   // Manipulation
          "rgba(75, 192, 192, 0.6)",   // Harmonious
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🚀 omogućava full širinu
    indexAxis: "x",
    scales: {
      y: {
        beginAtZero: true,
        max: 15,
        title: {
          display: true,
          text: "Score (out of 15)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Assertiveness Styles",
        },
      },
    },
  };

  return (
    <div className="w-[90%] h-[400px] mt-8 mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
}

export default AssertivenessGraph;
