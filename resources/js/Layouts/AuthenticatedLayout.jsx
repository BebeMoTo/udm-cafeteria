import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import WalletIcon from '@mui/icons-material/Wallet';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Authenticated({ user, header, type, balance, children, storeBalance }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [userBalance, setBalance] = useState(balance);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-green border-b border-gray-100" style={{position: "fixed",backgroundColor: "#f3f4f6", width: "100%", zIndex: "500"}}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                {type == 'User' && (
                                    <NavLink href={route('stores.index')} active={route().current('stores.index')}>
                                        Stores
                                    </NavLink>
                                )}
                                {type == 'User' && (
                                    <NavLink href={route('carts.index')} active={route().current('carts.index')}>
                                        Cart
                                    </NavLink>
                                )}
                                {type == 'User' && (
                                    <NavLink href={route('orders.index')} active={route().current('orders.index')}>
                                        Orders
                                    </NavLink>
                                )}
                                {type === 'Admin' && (
                                    <NavLink href={route('users.index')} active={route().current('users.index')}>
                                        <AdminPanelSettingsIcon/>
                                        Accounts
                                    </NavLink>
                                )}
                                {type === 'Admin' && (
                                    <NavLink href={route('users.create')} active={route().current('users.create')}>
                                        <AdminPanelSettingsIcon/>
                                        Create
                                    </NavLink>
                                )}
                                {type === 'Admin' && (
                                    <NavLink href={route('items.index')} active={route().current('items.index')}>
                                        <AdminPanelSettingsIcon/>
                                        Items
                                    </NavLink>
                                )}
                                {type === 'Admin' && (
                                    <NavLink href={route('admin.stores')} active={route().current('admin.stores')}>
                                        <AdminPanelSettingsIcon/>
                                        Stalls
                                    </NavLink>
                                )}
                                {type === 'Admin' && (
                                    <NavLink href={route('stores.physical')} active={route().current('stores.physical')}>
                                        <AdminPanelSettingsIcon/>
                                        Physical
                                    </NavLink>
                                )}
                                {type === 'Seller' && (
                                    <NavLink href={route('items.index')} active={route().current('items.index')}>
                                        Inventory
                                    </NavLink>
                                )}
                                {type === 'Seller' && (
                                    <NavLink href={route('orders.index')} active={route().current('orders.index')}>
                                        Orders
                                    </NavLink>
                                )}
                                {type === 'Seller' && (
                                    <NavLink href={route('stores.index')} active={route().current('stores.index')}>
                                        Store
                                    </NavLink>
                                )}
                                
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}
                style={{width: "100%", backgroundColor: "#f3f4f6"}}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        {type == 'User' && (
                            <ResponsiveNavLink href={route('stores.index')} active={route().current('stores.index')}>
                                Stores
                            </ResponsiveNavLink>
                        )}
                        {type == 'User' && (
                            <ResponsiveNavLink href={route('carts.index')} active={route().current('carts.index')}>
                                Cart
                            </ResponsiveNavLink>
                        )}
                        {type == 'User' && (
                            <ResponsiveNavLink href={route('orders.index')} active={route().current('orders.index')}>
                                Orders
                            </ResponsiveNavLink>
                        )}
                        {type === 'Admin' && (
                            <ResponsiveNavLink href={route('users.index')} active={route().current('users.index')}>
                                <AdminPanelSettingsIcon/>
                                Accounts
                            </ResponsiveNavLink>
                        )}
                        {type === 'Admin' && (
                            <ResponsiveNavLink href={route('users.create')} active={route().current('users.create')}>
                                <AdminPanelSettingsIcon/>
                                Create
                            </ResponsiveNavLink>
                        )}
                        {type === 'Admin' && (
                            <ResponsiveNavLink href={route('items.index')} active={route().current('items.index')}>
                                <AdminPanelSettingsIcon/>
                                Items
                            </ResponsiveNavLink>
                        )}
                        {type === 'Admin' && (
                            <ResponsiveNavLink href={route('admin.stores')} active={route().current('admin.stores')}>
                                <AdminPanelSettingsIcon/>
                                Stalls
                            </ResponsiveNavLink>
                        )}
                        {type === 'Admin' && (
                            <ResponsiveNavLink href={route('stores.physical')} active={route().current('stores.physical')}>
                                <AdminPanelSettingsIcon/>
                                Physical
                            </ResponsiveNavLink>
                        )}
                        {type === 'Seller' && (
                            <ResponsiveNavLink href={route(`items.index`)} active={route().current(`items.index`)}>
                                Inventory
                            </ResponsiveNavLink>
                        )}
                        {type === 'Seller' && (
                            <ResponsiveNavLink href={route('orders.index')} active={route().current('orders.index')}>
                                Orders
                            </ResponsiveNavLink>
                        )}
                        {type === 'Seller' && (
                            <ResponsiveNavLink href={route('stores.index')} active={route().current('stores.index')}>
                                Store
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && type === "Admin" && (
                <header className="bg-white shadow" style={{paddingTop: "64px"}}>
                    <div className="max-w-7xl mx-auto pb-4 pt-5 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {header && type === "User" && (
                <header className="bg-white shadow" style={{paddingTop: "64px"}}>
                    <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8"><h2 className="font-semibold text-xl text-gray-800 leading-tight"><WalletIcon/>: {'\u20B1'}{userBalance} <span style={{fontSize: ".7rem", color: "gray"}}>({user.expense})</span></h2></div>
                    <div className="max-w-7xl mx-auto pb-4 pt-2 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}
            {header && type === "Seller" && (
                <header className="bg-white shadow" style={{paddingTop: "64px"}}>
                    <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8"><h2 className="font-semibold text-xl text-gray-800 leading-tight"><WalletIcon/>: {'\u20B1'}{storeBalance} <span style={{fontSize: ".7rem", color: "gray"}}></span></h2></div>
                    <div className="max-w-7xl mx-auto pb-4 pt-2 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
