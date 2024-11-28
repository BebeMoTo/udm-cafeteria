import React, { useEffect } from 'react';

const BarGraphOverallBestSelling = ({ bestSellingItems }) => {
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
            const label = `${item.item_name} (${item.store_name})`; // Combine item and store name
            data.addRow([label, item.order_count]);
        });

        const options = {
            title: 'Best Selling Items (Last 7 Days)',
            hAxis: { title: 'Items' },
            vAxis: { title: 'Orders' },
            legend: 'none',
            bar: { groupWidth: '50%' },
            colors: ['#5b9f68'],
        };

        const chart = new window.google.visualization.ColumnChart(
            document.getElementById('bar-chart')
        );
        chart.draw(data, options);
    };

    return <div id="bar-chart" style={{ width: '100%', height: '500px', margin: "auto", marginTop: "16px" }} />;
};

export default BarGraphOverallBestSelling;
