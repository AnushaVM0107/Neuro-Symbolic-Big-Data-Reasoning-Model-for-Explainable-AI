
import React from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import type { ChartInfo } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Configure ChartJS Defaults
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.scale.grid.color = 'rgba(226, 232, 240, 0.5)';
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
ChartJS.defaults.plugins.tooltip.padding = 12;
ChartJS.defaults.plugins.tooltip.cornerRadius = 12;
ChartJS.defaults.plugins.tooltip.titleFont = { family: "'Outfit', sans-serif", size: 14, weight: 'bold' };
ChartJS.defaults.plugins.tooltip.bodyFont = { family: "'Inter', sans-serif", size: 13 };

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12, weight: 'bold' as const }
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  animation: {
    duration: 2000,
    easing: 'easeOutQuart' as const
  }
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12, weight: 'bold' as const }
      }
    },
  },
  animation: {
    duration: 2000,
    easing: 'easeOutQuart' as const
  }
}

export const ChartComponent: React.FC<ChartInfo> = ({ title, type, data }) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar options={chartOptions as any} data={data} />;
      case 'pie':
        return <Pie options={pieChartOptions as any} data={data} />;
      case 'doughnut':
        return <Doughnut options={pieChartOptions as any} data={data} />;
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full h-[350px] md:h-[400px]">
        {renderChart()}
      </div>
    </div>
  );
};
