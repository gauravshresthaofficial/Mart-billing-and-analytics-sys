import React, { useState, useEffect } from 'react';
import * as api from "../api/index";

const DataDisplay = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [todaySales, setTodaySales] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from API
                const [salesResponse, customerResponse, productsResponse, todaySalesResponse] = await Promise.all([
                    api.salesResponse(),
                    api.customerResponse(),
                    api.productResponse(),
                    api.todaySalesResponse()
                ]);

                // Update state
                setTotalSales(salesResponse.data);
                setTotalCustomers(customerResponse.data);
                setTotalProducts(productsResponse.data);
                setTodaySales(todaySalesResponse.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4">
            <DisplayBox title="Today Sales" value={todaySales} showRs />
            <DisplayBox title="Total Month Sales" value={totalSales.toFixed(0)} showRs />
            <DisplayBox title="Total Customers" value={totalCustomers} />
            <DisplayBox title="Total Products" value={totalProducts} />
        </div>
    );
};

const DisplayBox = ({ title, value, showRs }) => {
    return (
        <div className="box min-h-24 rounded-2xl flex justify-center items-center border-gray-400 border hover:bg-gray-100">
            <p>{title}:
                <span className='block w-full text-center pt-2 font-semibold text-lg'>
                    {showRs ? `Rs. ${value}` : value}
                </span>
            </p>
        </div>
    );
};

export default DataDisplay;