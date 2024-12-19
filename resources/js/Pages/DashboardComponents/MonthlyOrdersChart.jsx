import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MonthlyIncomeChart = ({ data }) => {
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
        title: 'Daily Orders (This Month)',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Total Amount' },
        curveType: 'none',
        legend: { position: 'bottom' },
        colors: ['#5b9f68', '#1f77b4', '#ff7f0e', '#d62728'], // Color for each line
      };

      const chart = new window.google.visualization.LineChart(
        document.getElementById('monthly-orders-chart')
      );
      chart.draw(window.google.visualization.arrayToDataTable(chartData), options);
    }
  }, [data]);

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible); // Toggle table visibility
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = data.map(item => [
      item.date,
      item.eBalance.toFixed(2),
      item.Paymongo.toFixed(2),
      item.PhysicalCash.toFixed(2),
      item.total_amount.toFixed(2),
    ]);

    doc.text('Monthly Orders Data Interpretation', 14, 10);
    doc.autoTable({
      head: [['Date', 'eBalance', 'Paymongo', 'Physical Cash', 'Total Amount']],
      body: tableData,
    });

    doc.save('Monthly_Orders_Data.pdf');
  };

  return (
    <div style={{ width: '100%', margin: 'auto' }}>
      <div id="monthly-orders-chart" style={{ width: '100%', height: '400px', margin: 'auto' }} />

      {/* Toggle and Export Buttons */}
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
            marginRight: '8px'
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
            borderRadius: '4px'
          }}
        >
          Export to PDF
        </button>
      </div>

      {/* Table Section */}
      {isTableVisible && (
        <div style={{ marginTop: '16px', width: '100%', overflow: 'auto' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Monthly Orders Data Interpretation</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: 'auto', textAlign: 'left', marginBottom: '2rem', }}>
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

export default MonthlyIncomeChart;
