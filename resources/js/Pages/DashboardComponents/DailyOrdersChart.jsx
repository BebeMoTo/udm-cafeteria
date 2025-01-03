import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DailyOrdersChart = ({ data }) => {
  const [isTableVisible, setIsTableVisible] = useState(true); // State to manage table visibility

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
        title: 'Daily Orders (Last 7 Days)',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Total Amount' },
        curveType: 'none',
        legend: { position: 'bottom' },
        colors: ['#5b9f68', '#1f77b4', '#ff7f0e', '#d62728'], // Color for each line
      };

      const chart = new window.google.visualization.LineChart(
        document.getElementById('daily-orders-chart')
      );
      chart.draw(window.google.visualization.arrayToDataTable(chartData), options);
    }
  }, [data]);

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible); // Toggle table visibility
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text('Daily Orders Data', 14, 20);

    // Generate the table using autoTable
    doc.autoTable({
      head: [['Date', 'eBalance', 'Paymongo', 'Physical Cash', 'Total Amount']], // Table headers
      body: data.map(item => [
        item.date,
        item.eBalance.toFixed(2),
        item.Paymongo.toFixed(2),
        item.PhysicalCash.toFixed(2),
        item.total_amount.toFixed(2),
      ]), // Table data
      startY: 30,
    });

    // Save the generated PDF
    doc.save('daily-orders.pdf');
  };

  return (
    <div style={{ width: '100%', margin: 'auto' }}>
      <div id="daily-orders-chart" style={{ width: '100%', height: '400px', margin: 'auto' }} />

      {/* Buttons Section */}
      <div style={{ textAlign: 'right', marginTop: '16px', marginBottom: '32px' }}>
        <button
          onClick={toggleTableVisibility}
          style={{
            padding: '8px 16px',
            backgroundColor: '#5b9f68',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
            marginRight: '8px',
          }}
        >
          {isTableVisible ? 'Hide Table' : 'Show Table'}
        </button>
        <button
          onClick={exportToPDF}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1f77b4',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Export to PDF
        </button>
      </div>

      {/* Table Section */}
      {isTableVisible && (
        <div style={{ marginTop: '16px', width: '100%', overflow: 'auto' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Daily Orders Data Interpretation</h3>
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
      )}
    </div>
  );
};

export default DailyOrdersChart;
