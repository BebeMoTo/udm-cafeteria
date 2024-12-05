import React, { useEffect } from 'react';

const DailyOrdersChartIndividualMonth = ({ data }) => {
  useEffect(() => {
    if (window.google) {
      // Load the Google Charts library
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(drawChart);
    }

    function drawChart() {
      const chartData = [
        ['Date', 'Total Amount'], // Chart headings
        ...data.map(item => [item.date, item.total_amount]), // Data points
      ];

      const options = {
        title: 'Daily Orders (Last 30 Days)',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Total Amount' },
        curveType: 'none',
        legend: { position: 'bottom' },
        colors: ['#5b9f68'],
      };

      const chart = new window.google.visualization.LineChart(
        document.getElementById('daily-orders-individual-chart-month')
      );
      chart.draw(window.google.visualization.arrayToDataTable(chartData), options);
    }
  }, [data]); // Re-run useEffect when `data` changes

  return (
    <div id="daily-orders-individual-chart-month" style={{ width: '100%', height: '400px', margin: 'auto', marginBottom: "16px" }} />
  );
};

export default DailyOrdersChartIndividualMonth;
