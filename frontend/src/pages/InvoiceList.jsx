import React, { useState, useEffect, useMemo } from 'react';
import InputField from '../components/InputField';
import DynamicTable from '../components/DynamicTable';
import { useSelector, useDispatch } from 'react-redux';
import { getBill } from '../redux/bill/billActions';
import { Link } from 'react-router-dom';
import YearDropdown from '../components/YearDropdown';
import MonthDropdown from '../components/MonthDropdown';
import LiveSearch from '../components/LiveSearch';

export const InvoiceList = () => {
    const datas = useSelector(state => state.bills).bills;
    const dispatch = useDispatch();
    const columns = ['Bill No.', 'Customer Name', 'Due Date', 'Created At', 'Total', 'Payment Status', 'Due Amount'];
    const tableBody = ["invoiceNumber", "customer", "dueDate", 'createdAt', "total", "status", "amtDue"];
    const [searchTermCustomer, setSearchTermCustomer] = useState('');
    const [searchTermInvoice, setSearchTermInvoice] = useState('');
    const [searchFor, setSearchFor] = useState('');
    const [isSearch, setIsSearch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState({ message: "", isError: false });
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    useEffect(() => {
        setLoading(true);
        dispatch(getBill())
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [dispatch]);

    const [filterOptions, setFilterOptions] = useState({
        dueAmt: false,
        paid: false,
        partial: false,
        overdue: false,
    });

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilterOptions(prevOptions => ({
            ...prevOptions,
            [name]: checked,
        }));
    };

    const handleChange = e => {
        const searchForAttribute = e.target.getAttribute('searchFor');
        setSearchFor(searchForAttribute);
        if (searchForAttribute === "name") {
            setSearchTermCustomer(e.target.value);
            setSearchTermInvoice("")
        } else {
            setSearchTermInvoice(e.target.value);
            setSearchTermCustomer("")
        }
        setIsSearch(true);
        if (!searchTermCustomer.trim() && !searchTermInvoice.trim()) {
            setIsSearch(false);
        }
    };

    const handleClearFilters = () => {
        setSearchTermCustomer('');
        setSearchTermInvoice('');
        setSearchFor('');
        setFilterOptions({
            dueAmt: false,
            paid: false,
            partial: false,
            overdue: false,
        });
        setSelectedYear(null);
        setSelectedMonth(null);
        setIsSearch(false);
    };

    const filteredDatas = useMemo(() => {
        if (!datas) return [];

        const filteredBySearchTerm = datas.filter(data => {
            if (!searchTermCustomer.trim() && !searchTermInvoice.trim()) {
                return true;
            } else {
                if (searchFor === "name") {
                    return data?.customer?.name?.toLowerCase().includes(searchTermCustomer.toLowerCase());
                } else {
                    return data?.invoiceNumber?.toLowerCase().includes(searchTermInvoice.toLowerCase());
                }
            }
        });

        const filteredByStatus = filteredBySearchTerm.filter(data => {
            if (!filterOptions.dueAmt && !filterOptions.paid && !filterOptions.partial && !filterOptions.overdue) {
                return true;
            }
            if (filterOptions.dueAmt && data.status === 'Due') {
                return true;
            }
            if (filterOptions.paid && data.status === 'Paid') {
                return true;
            }
            if (filterOptions.partial && data.status === 'Partial Payment') {
                return true;
            }
            if (filterOptions.overdue && data.status === 'Overdue') {
                return true;
            }
            return false;
        });

        return filteredByStatus.filter(data => {
            const invoiceDate = new Date(data.createdAt);
            const invoiceYear = invoiceDate.getFullYear();
            const invoiceMonth = invoiceDate.getMonth() + 1;
            console.log(invoiceMonth, "invoicemonth")
            console.log(selectedMonth, "selectedmonth")

            if (selectedYear && invoiceYear !== selectedYear) {
                return false;
            }
            if (selectedMonth && invoiceMonth !== selectedMonth) {
                return false;
            }
            return true;
        });
    }, [datas, searchTermCustomer, searchTermInvoice, searchFor, filterOptions, selectedYear, selectedMonth]);

    const displayToast = (message, isError = false) => {
        setShowToast({ message, isError });
        setTimeout(() => {
            hideToast();
        }, 3000);
    };

    const hideToast = () => {
        setShowToast({ message: "" });
    };

    return (
        <div className='w-full flex-grow flex flex-col bg-gray-50 p-4 gap-4'>
            <div className='flex justify-between items-center pl-2'>
                <h1 className="font-bold text-lg text-gray-900">Bill Details</h1>
                <Link className='bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg ml-auto block' to={`/bill`}>Create Bill</Link>
            </div>
            <div className='flex-grow flex flex-col gap-4 rounded-lg border p-4 shadow-md bg-white'>
                <div className='w-full flex gap-4 '>
                    <div className='flex flex-col items-baseline gap-4 w-full'>
                        <form className="max-w-lg flex gap-6">
                            <div className="flex">
                                <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search Bills</label>
                                <div className="relative w-[24rem]">
                                    <InputField type="search" id="search" className="block p-2.5 ps-14 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Search Customer Name..." value={searchTermCustomer} searchFor="name" onChange={handleChange} />
                                    <button type='button' className="absolute top-0 start-0 w-12 flex justify-center items-center text-sm font-medium h-full text-gray-600 border-r">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex">
                                <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search Bill</label>
                                <div className="relative w-[24rem]">
                                    <InputField type="search" id="search" className="block p-2.5 ps-14 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Search Bill Number..." value={searchTermInvoice} searchFor="invoiceNumber" onChange={handleChange} />
                                    <button type='button' className="absolute top-0 start-0 w-12 flex my-0.5 justify-center items-center text-sm font-medium h-full text-gray-600 border-r">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className='flex justify-around items-center w-full'>
                            <div className='flex gap-6'>
                                <p className='font-semibold'>Filter</p>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="dueAmt"
                                        checked={filterOptions.dueAmt}
                                        onChange={handleFilterChange}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="dueAmt" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-900">Due</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="paid"
                                        checked={filterOptions.paid}
                                        onChange={handleFilterChange}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="paid" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-900">Paid</label>
                                </div>

                                {/* <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="partial"
                                        checked={filterOptions.partial}
                                        onChange={handleFilterChange}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="partial" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-900">Partial Paid</label>
                                </div> */}

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="overdue"
                                        checked={filterOptions.overdue}
                                        onChange={handleFilterChange}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="date" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-900">Overdue</label>
                                </div>
                            </div>

                            {/* filter with the time (year, month, day) when clicked filter button */}
                            <div className='flex gap-6 ml-auto'>
                                <YearDropdown selectedYear={selectedYear} onSelectYear={setSelectedYear} />
                                <MonthDropdown selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
                                {/* <LiveSearch results={[2021,2022,2023,2024]} value='2024' setFormData={}{setSelectedYear}></LiveSearch> */}
                                <button
                                    type='button'
                                    className='bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm'
                                    onClick={handleClearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <DynamicTable columns={columns} data={filteredDatas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || []} loading={loading} showToast={showToast} displayToast={displayToast} hideToast={hideToast} isSearch={isSearch} tableBody={tableBody} action='view' />
            </div>
        </div>
    );
};
