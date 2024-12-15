import React, { useState, useEffect } from 'react';

const DailyOrdersChartOverallYear = ({ data }) => {
  const [showTable, setShowTable] = useState(false); // State to control table visibility

  useEffect(() => {
    // Load the Google Charts library
    window.google.charts.load('current', { packages: ['corechart'] });
    window.google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const chartData = [
        ['Date', 'Total Amount', 'Physical Cash', 'eBalance', 'Paymongo'], // Chart headings
        ...data.map(item => [
          item.date,
          item.total_amount, // Total amount line
          item.PhysicalCash, // Physical Cash line
          item.eBalance, // eBalance line
          item.Paymongo, // Paymongo line
        ]), // Data points
      ];

      const options = {
        title: 'Overall Sales (This Month)',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Total Amount' },
        curveType: 'none',
        legend: { position: 'bottom' },
        colors: ['#5b9f68', '#1f77b4', '#ff7f0e', '#d62728'], // Colors for each line
      };

      const chart = new window.google.visualization.LineChart(
        document.getElementById('daily-orders-chart-overall-year')
      );
      chart.draw(window.google.visualization.arrayToDataTable(chartData), options);
    }
  }, [data]);

  return (
    <div style={{ width: '100%', margin: 'auto' }}>
      {/* Chart Section */}
      <div
        id="daily-orders-chart-overall-year"
        style={{ width: '100%', height: '400px', margin: 'auto', marginBottom: '16px' }}
      />

      {/* Toggle Button */}
      <div style={{ textAlign: 'right', marginBottom: '16px' }}>
        <button
          onClick={() => setShowTable(!showTable)} // Toggle table visibility
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: showTable ? '#d9534f' : '#5cb85c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showTable ? 'Hide Table' : 'Show Table'}
        </button>
      </div>

      {/* Table Section with Animation */}
      <div className={`table-container ${showTable ? 'show' : 'hide'}`}>
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Overall Sales Data Interpretation</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            margin: 'auto',
            textAlign: 'left',
            marginBottom: '2rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>eBalance</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Paymongo</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Physical Cash</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f9f9f9' } : {}}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.date}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.eBalance.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Paymongo.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.PhysicalCash.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.total_amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyOrdersChartOverallYear;
