import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DailyOrdersChartIndividual = ({ data }) => {
  const [isTableVisible, setIsTableVisible] = useState(false);

  useEffect(() => {
    if (window.google) {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(drawChart);
    }

    function drawChart() {
      const chartData = [
        ['Date', 'Total Amount', 'Physical Cash', 'eBalance', 'Paymongo'],
        ...data.map(item => [
          item.date,
          item.total_amount,
          item.PhysicalCash,
          item.eBalance,
          item.Paymongo,
        ]),
      ];

      const options = {
        title: 'Daily Orders (Last 7 Days)',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Total Amount' },
        curveType: 'none',
        legend: { position: 'bottom' },
        colors: ['#5b9f68', '#1f77b4', '#ff7f0e', '#d62728'],
      };

      const chart = new window.google.visualization.LineChart(
        document.getElementById('daily-orders-individual-chart')
      );
      chart.draw(window.google.visualization.arrayToDataTable(chartData), options);
    }
  }, [data]);

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Daily Orders Data Interpretation for ${data[0].store}`, 14, 10);

    const tableColumns = ['Date', 'Total Amount', 'Physical Cash', 'eBalance', 'Paymongo'];
    const tableRows = data.map(item => [
      item.date,
      item.total_amount.toFixed(2),
      item.PhysicalCash.toFixed(2),
      item.eBalance.toFixed(2),
      item.Paymongo.toFixed(2),
    ]);

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
    });

    doc.save('DailyOrders.pdf');
  };

  return (
    <div style={{ width: '100%', margin: 'auto' }}>
      {/* Chart Section */}
      <div
        id="daily-orders-individual-chart"
        style={{ width: '100%', height: '400px', marginBottom: '16px' }}
      />

      {/* Buttons */}
      <div style={{ textAlign: 'right', marginBottom: '16px' }}>
        <button
          onClick={toggleTableVisibility}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: isTableVisible ? '#d9534f' : '#5cb85c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          {isTableVisible ? 'Hide Table' : 'Show Table'}
        </button>
        <button
          onClick={exportToPDF}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#0275d8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Export to PDF
        </button>
      </div>

      {/* Table Section */}
      {isTableVisible && (
        <div style={{ marginTop: '16px', overflow: 'auto' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
            Daily Orders Data Interpretation
          </h3>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              marginBottom: '2rem',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Amount</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>eBalance</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Paymongo</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Physical Cash</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f9f9f9' } : {}}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.date}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {item.total_amount.toFixed(2)}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {item.PhysicalCash.toFixed(2)}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {item.eBalance.toFixed(2)}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {item.Paymongo.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DailyOrdersChartIndividual;
