import { useState, useEffect, useMemo } from 'react';
import NewUpdateCustomer from '../components/customer/NewUpdateCustomer';
import Button from '../components/Button';
import InputField from '../components/InputField';
import DynamicTable from '../components/DynamicTable';
import { useSelector, useDispatch } from 'react-redux';
import { getCustomers, deleteCustomer } from '../redux/customer/customerActions';

const Customer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const datas = useSelector(state => state.customers).customers;
    const dispatch = useDispatch();
    const columns = ['Name', 'Email', 'Outstanding Balance', 'Credit Limit'];
    const tableBody = ["name", "email", "outstandingBalance", "creditLimit"];
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateData, setUpdateData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearch, setIsSearch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState({ message: "", isError: false });

    useEffect(() => {
        setLoading(true);
        dispatch(getCustomers())
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [dispatch]);

    const handleEditClick = data => {
        handleClose();
        setIsUpdate(true);
        setUpdateData(data);
    };

    const handleChange = e => {
        setSearchTerm(e.target.value);
        setIsSearch(true);
        if (!e.target.value.trim()) {
            setIsSearch(false);
        }
    };

    const handleClose = () => {
        setIsOpen(prevState => !prevState);
        setIsUpdate(false);
    };

    const filteredDatas = useMemo(() => {
        if (!datas) return [];
        if (!searchTerm.trim()) return datas;
        return datas.filter(data => 
            data && data.name && data.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [datas, searchTerm]);

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
        <div className='w-full h-full flex flex-col bg-gray-50 p-4 gap-4'>
            <div className='flex justify-between items-center pl-2'>
                <h1 className="font-bold text-lg text-gray-900">Customers Details</h1>
                <Button type="button" text="Add Customer" onClick={handleClose} className='ml-auto block' />
            </div>
            {isOpen && <NewUpdateCustomer handleClose={handleClose} isUpdate={isUpdate} data={updateData} displayToast={displayToast} hideToast={hideToast} />}
            <div className='flex-grow flex flex-col gap-4 rounded-lg border p-4 shadow-md bg-white'>
                <div className='w-full flex gap-4 '>
                    <div className='flex items-baseline gap-4'>
                        <form className="max-w-lg mx-auto">
                            <div className="flex">
                                <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search Customers</label>
                                <div className="relative w-[24rem]">
                                    <InputField type="search" id="search" className="block p-2.5 ps-14 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Search Customer Name..." value={searchTerm} onChange={handleChange} />
                                    <button type='button' className="absolute top-0 start-0 w-12 flex justify-center items-center text-sm font-medium h-full text-gray-600 border-r">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <DynamicTable columns={columns} data={filteredDatas} handleEditClick={handleEditClick} loading={loading} showToast={showToast} displayToast={displayToast} hideToast={hideToast} isSearch={isSearch} deleteData={deleteCustomer} tableBody={tableBody} from="customer"/>
            </div>
        </div>
    );
};

export default Customer;
