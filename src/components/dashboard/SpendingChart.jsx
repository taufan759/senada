import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrasi komponen Chart.js yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpendingChart = () => {
  // Data dummy untuk chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        label: 'Pengeluaran',
        data: [1200000, 1900000, 1500000, 1700000, 1400000, 1800000],
        backgroundColor: '#F9A826',
      },
      {
        label: 'Pemasukan',
        data: [2500000, 2300000, 2400000, 2600000, 2700000, 2900000],
        backgroundColor: '#2E5EAA',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
          }
        }
      }
    }
  };

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
};

export default SpendingChart;