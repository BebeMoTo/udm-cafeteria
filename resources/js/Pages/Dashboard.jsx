import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TopSelling from './DashboardComponents/TopSelling';
import { useState } from 'react';
import TopSellingRecommendaitons from './DashboardComponents/TopSellingRecommendations';
import TopSellingFavorite from './DashboardComponents/TopSellingFavorite';
export default function Dashboard({ auth, topSellingItems, userTopItems, recommendedItems }) {
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

            <div className="py-5">
                <div className=" mx-auto sm:px-6 lg:px-8">
                    {auth.user.type !== "Seller" ? <TopSelling topSelling={topSelling} chapterTitle={"Top Selling Items Today"}/> : ""}

                    {auth.user.type !== "Seller" ? userTop && <TopSellingFavorite topFavorite={userTop} chapterTitle={"Your Favorites"}/> : ""}

                    {auth.user.type !== "Seller" ? recommended && <TopSellingRecommendaitons topSelling={recommended} chapterTitle={"Foods that you might like"}/> : ""}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
