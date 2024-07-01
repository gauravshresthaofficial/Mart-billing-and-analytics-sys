import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Sidebar = ({ active }) => {
    // Define state variables
    const [links] = useState([
        { name: 'Dashboard', path: '/' },
        { name: 'Bill', path: '/bill' },
        { name: 'Product', path: '/product' },
        { name: 'Customer', path: '/customer' },
        {
            name: 'Analysis', path: '/analysis', subMenu: [
                { name: 'Product Analysis', path: '/analysis/product' },
                { name: 'Customer Analysis', path: '/analysis/customer' },
            ]
        },
        {
            name: "Profile", path: '/profile'
        },
    ]);

    const [expanded, setExpanded] = useState({}); // Manage expanded state for submenus
    const location = useLocation();
    const pathActive = location.pathname;

    // Function to toggle the submenu
    const toggleSubMenu = (name) => {
        setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    // JSX for rendering links
    const renderLinks = () => {
        return links.map((link, index) => {
            const isActive = link.path === pathActive || (link.subMenu && link.subMenu.some(subLink => subLink.path === pathActive));

            return (
                <div key={index}>
                    <div
                        className={`flex items-center p-2 rounded-lg dark:text-white group dark:hover:text-white cursor-pointer ${isActive ? 'bg-blue-700 dark:bg-blue-700 text-gray-50' : 'hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Link
                            to={link.path}
                            className="flex-grow flex items-center"
                        >
                            <span className="ms-3">{link.name}</span>
                        </Link>
                        {link.subMenu && (
                            <button
                                onClick={() => toggleSubMenu(link.name)}
                                className="ml-auto focus:outline-none"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform transform ${expanded[link.name] ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {/* Render submenu items if any */}
                    {link.subMenu && expanded[link.name] && (
                        <div className="ml-4 py-2 space-y-2">
                            {link.subMenu.map((subLink, subIndex) => (
                                <Link
                                    key={subIndex}
                                    to={subLink.path}
                                    className={`flex items-center text-sm p-2 rounded-lg dark:text-white group dark:hover:text-white ${pathActive === subLink.path ? 'bg-blue-700 dark:bg-blue-700 text-gray-50' : 'hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700'}`}
                                >
                                    <span className="ms-3">{subLink.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <aside
            id="default-sidebar"
            className="min-w-64 bg-gray-200 dark:bg-gray-800 flex flex-col"
            aria-label="Sidebar"
        >
            <div className="flex-grow px-3 py-4 overflow-y-auto">
                <ul className="space-y-2 font-medium">
                    {renderLinks()}
                    {/* Add more items as needed */}
                </ul>
            </div>
            <div className='px-4 py-2 text-center border-y border-gray-300 dark:border-gray-700'>
                <LogoutButton className="w-full" />
            </div>
        </aside>
    );
};

export default Sidebar;
