import React, { useEffect } from 'react';

const DailyOrdersChartOverall = ({ data }) => {
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
        title: 'Overall Sales (Last 7 Days)',
        hAxis: { title: 'Date' },
        vAxis: { title: 'Total Amount' },
        curveType: 'none',
        legend: { position: 'bottom' },
        colors: ['#5b9f68'],
      };

      const chart = new window.google.visualization.LineChart(
        document.getElementById('daily-orders-chart-overall')
      );
      chart.draw(window.google.visualization.arrayToDataTable(chartData), options);
    }
  }, [data]);

  return <div id="daily-orders-chart-overall" style={{ width: '100%', height: '400px', margin: "auto", marginBottom: "16px" }} />;
};

export default DailyOrdersChartOverall;
