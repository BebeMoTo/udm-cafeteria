import React, { useEffect } from 'react';

const BarGraph = ({ bestSellingItems }) => {
    useEffect(() => {
        if (window.google) {
            // Load the visualization library
            window.google.charts.load('current', { packages: ['corechart'] });
            window.google.charts.setOnLoadCallback(drawChart);
        }
    }, [bestSellingItems]);

    const drawChart = () => {
        const data = new window.google.visualization.DataTable();
        data.addColumn('string', 'Item');
        data.addColumn('number', 'Orders');

        // Add data from `bestSellingItems` prop
        bestSellingItems.forEach((item) => {
            data.addRow([item.item_name, item.order_count]);
        });

        const options = {
            title: 'Best Selling Items (Last 7 Days)',
            hAxis: { title: 'Items' },
            vAxis: { title: 'Orders' },
            legend: 'none',
            bar: { groupWidth: '50%' },
        };

        const chart = new window.google.visualization.ColumnChart(
            document.getElementById('bar-chart')
        );
        chart.draw(data, options);
    };

    return <div id="bar-chart" style={{ width: '100%', height: '500px', margin: "auto", marginTop: "16px" }} />;
};

export default BarGraph;
