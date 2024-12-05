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
import DailyOrdersChartIndividual from './DashboardComponents/DailyOrdersChartIndividual';
import DailyOrdersChartIndividualMonth from './DashboardComponents/DailyOrdersChartIndividualMonth';
import DailyOrdersChartOverall from './DashboardComponents/DailyOrdersChartOverall';

export default function Dashboard({ auth, topSellingItems, userTopItems, recommendedItems, dailyOrders, dailyIncome, storeTopSellingItems, salesToday, salesThisMonth, pendingOrders, acceptedOrders, overallDailyIncome, overallMonthlyIncome, overallTopSellingItems, storeWiseDailyIncome, storeWiseMonthlyIncome,
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
                {auth.user.type === "Admin" ? isAdmin() : ""}
                {auth.user.type === "Admin" ? <DailyOrdersChartIndividual data={filteredSales} />: ""}
                {auth.user.type === "Admin" ? isAdminMonth() : ""}
                {auth.user.type === "Admin" ? <DailyOrdersChartIndividualMonth data={filteredSalesMonth} />: ""}
                {auth.user.type === "Admin" ? <DailyOrdersChartOverall data={overallDailyIncome}/> : ""}
                {auth.user.type === "Admin" ? <BarGraphOverallBestSelling bestSellingItems={overallTopSellingItems} />: ""}
                {auth.user.type === "Admin" ? <div><br /><br /></div> : ""}


                {/*Seller Infos Card*/}
                <div style={{display: "flex", flexShrink: 0, gap: "16px", overflowX: "auto"}}>                
                    {auth.user.type === "Seller" ? <MyCardSimple pesoSign={'\u20B1'} number={salesToday.toFixed(2)} title={"Sales Today"}/> : ""}
                    {auth.user.type === "Seller" ? <MyCardSimple pesoSign={'\u20B1'} number={salesThisMonth.toFixed(2)} title={"Sales This Month"}/> : ""}
                    {auth.user.type === "Seller" ? <MyCardSimple pesoSign={''} number={pendingOrders} title={"Pending Orders"}/> : ""}
                    {auth.user.type === "Seller" ? <MyCardSimple pesoSign={''} number={acceptedOrders} title={"Accepted Orders"}/> : ""}
                </div>


                    {auth.user.type !== "Seller" ? <TopSelling topSelling={topSelling} chapterTitle={"Top Selling Items Today"}/> : ""}

                    {auth.user.type !== "Seller" ? userTop && <TopSellingFavorite topFavorite={userTop} chapterTitle={"Your Favorites"}/> : ""}

                    {auth.user.type !== "Seller" ? recommended && <TopSellingRecommendations topSelling={recommended} chapterTitle={"Foods that you might like"}/> : ""}

                    {auth.user.type !== "Seller" ? <DailyOrdersChart data={dailyOrders}/> : ""}

                    {auth.user.type === "Seller" ? <DailyOrdersChart data={dailyIncome}/> : ""}

                    {auth.user.type === "Seller" ? <BarGraph bestSellingItems={storeTopSellingItems} />: ""}



                </div>
            </div>
        </AuthenticatedLayout>
    );
}
