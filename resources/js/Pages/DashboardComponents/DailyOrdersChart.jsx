import React, { useEffect } from 'react';

const DailyOrdersChart = ({ data }) => {
  useEffect(() => {
    // Load the Google Charts library
    window.google.charts.load('current', { packages: ['corechart'] });
    window.google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const chartData = [
        ['Date', 'Total Amount'], // Chart headings
        ...data.map(item => [item.date, item.total_amount]), // Data points
      ];

      const options = {
        title: 'Daily Orders (Last 7 Days)',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Total Amount' },
        curveType: 'function',
        legend: { position: 'bottom' },
        colors: ['#5b9f68'],
      };

      const chart = new window.google.visualization.LineChart(
        document.getElementById('daily-orders-chart')
      );
      chart.draw(window.google.visualization.arrayToDataTable(chartData), options);
    }
  }, [data]);

  return <div id="daily-orders-chart" style={{ width: '100%', height: '400px', margin: "auto" }} />;
};

export default DailyOrdersChart;
