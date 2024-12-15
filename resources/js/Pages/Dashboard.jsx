import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TopSelling from './DashboardComponents/TopSelling';
import { useState } from 'react';
import TopSellingRecommendations from './DashboardComponents/TopSellingRecommendations';
import TopSellingFavorite from './DashboardComponents/TopSellingFavorite';
import DailyOrdersChart from './DashboardComponents/DailyOrdersChart';
import BarGraph from './DashboardComponents/BarGraph';
import BarGraphOverallBestSelling from './DashboardComponents/BarGraphOverallBestSelling';
import MyCardSimple from './DashboardComponents/MyCardSimple';
import MyCardSimple1 from './DashboardComponents/MyCardSimple1';
import DailyOrdersChartIndividual from './DashboardComponents/DailyOrdersChartIndividual';
import DailyOrdersChartIndividualMonth from './DashboardComponents/DailyOrdersChartIndividualMonth';
import DailyOrdersChartOverall from './DashboardComponents/DailyOrdersChartOverall';
import DailyOrdersChartOverallMonth from './DashboardComponents/DailyOrdersChartOverallMonth';
import DailyOrdersChartOverallYear from './DashboardComponents/DailyOrdersChartOverallYear';


export default function Dashboard({ auth, topSellingItems, userTopItems, recommendedItems, dailyOrders, dailyIncome, storeTopSellingItems, salesToday, salesThisMonth, pendingOrders, acceptedOrders, overallDailyIncome, overallMonthlyIncome, overallYearlyIncome, overallTopSellingItems, storeWiseDailyIncome, storeWiseMonthlyIncome, predictedSales, percentageOfPrediction, percentageOfPrediction1,
}) {
    const [topSelling, setTopSelling] = useState(topSellingItems);
    const [userTop, setUserTop] = useState(userTopItems);
    const [recommended, setRecommended] = useState(recommendedItems);

    function showStoreBalance() {
        if (auth.user.type === "Seller") {
            return auth.user.store.balance;
        }
        else {
            return
        }
    }

    const uniqueStores = Array.from(
        new Map(
            storeWiseDailyIncome.map((data) => [
                data.store_id,
                { store_id: data.store_id, store_name: data.store },
            ])
        ).values()
    );
    const uniqueStoresMonth = Array.from(
        new Map(
            storeWiseMonthlyIncome.map((data) => [
                data.store_id,
                { store_id: data.store_id, store_name: data.store },
            ])
        ).values()
    );

    // State to store the selected store ID and its sales data
    const [selectedStoreId, setSelectedStoreId] = useState(uniqueStores[0]?.store_id || null);
    const [filteredSales, setFilteredSales] = useState(
        storeWiseDailyIncome.filter((data) => data.store_id === selectedStoreId)
    );

    // State to store the selected store ID and its sales data
    const [selectedStoreIdMonth, setSelectedStoreIdMonth] = useState(uniqueStoresMonth[0]?.store_id || null);
    const [filteredSalesMonth, setFilteredSalesMonth] = useState(
        storeWiseMonthlyIncome.filter((data) => data.store_id === selectedStoreIdMonth)
    );

    // Handle the change of the store selection
    const handleStoreChange = (event) => {
        const storeId = parseInt(event.target.value, 10);
        setSelectedStoreId(storeId);

        // Filter sales for the selected store
        const sales = storeWiseDailyIncome.filter((data) => data.store_id === storeId);
        setFilteredSales(sales);
    };

    // Handle the change of the store selection
    const handleStoreChangeMonth = (event) => {
        const storeIdMonth = parseInt(event.target.value, 10);
        setSelectedStoreIdMonth(storeIdMonth);

        // Filter sales for the selected store
        const salesMonth = storeWiseMonthlyIncome.filter((data) => data.store_id === storeIdMonth);
        setFilteredSalesMonth(salesMonth);
    };

    const isAdmin = () => {
        return(
        <div>
            <label htmlFor="store-select">Select Store:</label> &nbsp;
            <select id="store-select" value={selectedStoreId} onChange={handleStoreChange}>
                {uniqueStores.map((store) => (
                    <option key={store.store_id} value={store.store_id}>
                        {store.store_name}
                    </option>
                ))}
            </select>

            {/* Display the filtered sales data */}
            <h3>Sales for {uniqueStores.find((store) => store.store_id === selectedStoreId)?.store_name}</h3>
        </div>
        );
    }

    const [selectedRange, setSelectedRange] = useState("week");
    const isAdminOverallSales = () => {
        if (selectedRange === "week") {
            return(
                <div>
                    <label htmlFor="range-select">Select Range:</label> &nbsp;
                    <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select> <br /><br />
        
                    <DailyOrdersChartOverall data={overallDailyIncome}/>
                </div>
                );
        }
        else if (selectedRange === "month") {
            return(
                <div>
                    <label htmlFor="range-select">Select Range:</label> &nbsp;
                    <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select> <br /><br />
        
                    <DailyOrdersChartOverallMonth data={overallMonthlyIncome}/>
                </div>
                );
        }
        else if (selectedRange === "year") {
            return(
                <div>
                    <label htmlFor="range-select">Select Range:</label> &nbsp;
                    <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select> <br /><br />
                    
                    <DailyOrdersChartOverallYear data={overallYearlyIncome}/>
                </div>
                );
        }
    }

    const isAdminMonth = () => {
        return(
        <div>
            <label htmlFor="store-select">Select Store:</label> &nbsp;
            <select id="store-select" value={selectedStoreIdMonth} onChange={handleStoreChangeMonth}>
                {uniqueStoresMonth.map((store) => (
                    <option key={store.store_id} value={store.store_id}>
                        {store.store_name}
                    </option>
                ))}
            </select>

            {/* Display the filtered sales data */}
            <h3>Sales for {uniqueStoresMonth.find((store) => store.store_id === selectedStoreIdMonth)?.store_name}</h3>
        </div>
        );
    }


const { props } = usePage(); // Access Inertia props
console.log('Props received:', props); // Debugging
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Dashboard</h2>}
            type={auth.user.type}
            balance={auth.user.balance}
            storeBalance={showStoreBalance()}
        >
            <Head title="Dashboard" />

            <div className="py-5 ">
                <div className=" mx-auto sm:px-6 lg:px-8">

                {/*Admin Graphs and Charts*/}

                <div style={{display: "flex", flexShrink: 0, gap: "16px", overflowX: "auto", paddingBottom: "16px"}}>                
                    {auth.user.type === "Admin" ? <MyCardSimple1 percentVal={salesToday.percentage_change} plain={false} pesoSign={'\u20B1'} number={salesToday.sales_today.toFixed(2)} title={"Sales Today"}/> : ""}
                    {auth.user.type === "Admin" ? <MyCardSimple1 plain={true} pesoSign={'\u20B1'} number={salesToday.sales_today.toFixed(2)} title={"Sales Today"}/> : ""}
                </div>
                {auth.user.type === "Admin" ? isAdminOverallSales() : ""}

                {auth.user.type === "Admin" ? isAdmin() : ""}
                {auth.user.type === "Admin" ? <DailyOrdersChartIndividual data={filteredSales} />: ""}
                {auth.user.type === "Admin" ? isAdminMonth() : ""}
                {auth.user.type === "Admin" ? <DailyOrdersChartIndividualMonth data={filteredSalesMonth} />: ""}
                {auth.user.type === "Admin" ? <BarGraphOverallBestSelling bestSellingItems={overallTopSellingItems} />: ""}
                {auth.user.type === "Admin" ? <div><br /><br /></div> : ""}


                {/*Seller Infos Card*/}
                <div style={{display: "flex", flexShrink: 0, gap: "16px", overflowX: "auto", paddingBottom: "16px"}}>                
                    {auth.user.type === "Seller" ? <MyCardSimple1 percentVal={salesToday.percentage_change} percentVal1={salesToday.percentage_change} plain={false} pesoSign={'\u20B1'} number={salesToday.sales_today.toFixed(2)} title={"Sales Today"}/> : ""}
                    {auth.user.type === "Seller" ? <MyCardSimple1 percentVal={salesToday.percentage_to_prediction} percentVal1={salesToday.percentage_to_prediction} plain={false} pesoSign={'\u20B1'} number={salesToday.predicted_sales.toFixed(2)} title={"Sales Prediciton"}/> : ""}
                    {auth.user.type === "Seller" ? <MyCardSimple1 plain={true} pesoSign={'\u20B1'} number={salesThisMonth.toFixed(2)} title={"Sales This Month"}/> : ""}
                </div>


                    {auth.user.type == "User" ? <TopSelling topSelling={topSelling} chapterTitle={"Top Selling Items Today"}/> : ""}

                    {auth.user.type == "User" ? userTop && <TopSellingFavorite topFavorite={userTop} chapterTitle={"Your Favorites"}/> : ""}

                    {auth.user.type == "User" ? recommended && <TopSellingRecommendations topSelling={recommended} chapterTitle={"Foods that you might like"}/> : ""}

                    {auth.user.type === "Seller" ? <DailyOrdersChart data={dailyIncome}/> : ""}

                    {auth.user.type === "Seller" ? <BarGraph bestSellingItems={storeTopSellingItems} />: ""}



                </div>
            </div>
        </AuthenticatedLayout>
    );
}
