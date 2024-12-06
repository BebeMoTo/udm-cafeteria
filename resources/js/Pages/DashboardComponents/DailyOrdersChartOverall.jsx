import React, { useEffect } from 'react';

const DailyOrdersChartOverall = ({ data }) => {
  useEffect(() => {
    // Load the Google Charts library
    window.google.charts.load('current', { packages: ['corechart'] });
    window.google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const chartData = [
        ['Date', 'eBalance', 'Paymongo', 'Physical Cash', 'Total Amount'], // Chart headings
        ...data.map(item => [
          item.date,
          item.eBalance, // eBalance line
          item.Paymongo, // Paymongo line
          item.PhysicalCash, // Physical Cash line
          item.total_amount, // Total amount line
        ]), // Data points
      ];

      const options = {
        title: 'Overall Sales (Last 7 Days)',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Total Amount' },
        curveType: 'none',
        legend: { position: 'bottom' },
        colors: ['#5b9f68', '#1f77b4', '#ff7f0e', '#d62728'], // Colors for each line
      };

      const chart = new window.google.visualization.LineChart(
        document.getElementById('daily-orders-chart-overall')
      );
      chart.draw(window.google.visualization.arrayToDataTable(chartData), options);
    }
  }, [data]);

  return (
    <div style={{ width: '100%', margin: 'auto' }}>
      <div
        id="daily-orders-chart-overall"
        style={{ width: '100%', height: '400px', margin: 'auto', marginBottom: '16px' }}
      />

      {/* Table Section */}
      <div style={{ marginTop: '16px', width: '100%', overflow: 'auto' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Overall Sales Data Interpretation</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            margin: 'auto',
            textAlign: 'left',
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
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.eBalance}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Paymongo}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.PhysicalCash}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> <br /><br />
    </div>
  );
};

export default DailyOrdersChartOverall;
