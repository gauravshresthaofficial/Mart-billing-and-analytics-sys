import { useEffect, useState, useRef } from 'react';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from './Loading';
// import { deleteProduct } from '../../redux/product/productActions';


const DynamicTable = ({
    columns,
    data,
    handleEditClick = () => { },
    deleteData = () => { },
    loading,
    showToast = () => { },  // Default empty function
    displayToast = () => { },
    hideToast = () => { },
    isSearch = false,
    tableBody = [],
    from = "",
    action = "editDelete",
    fixedRowNumber = null,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxTableHeight, setMaxTableHeight] = useState(0);
    const tableContainerRef = useRef(null);
    const [rowHeight, setRowHeight] = useState(0);
    const dispatch = useDispatch();



    console.log(data,"dynamic table data")
    // Effect to handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (tableContainerRef.current) {
                const navHeight = document.querySelector('nav').clientHeight; // Get height of navigation bar
                const newMaxTableHeight = tableContainerRef.current.scrollHeight - navHeight; // Subtract navigation bar height
                setMaxTableHeight(newMaxTableHeight);
                calculateRowHeight();
                updateMaxTableHeight();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    // Effect to calculate row height and initial maxTableHeight
    useEffect(() => {
        calculateRowHeight();
        updateMaxTableHeight();
    }, []);

    // Effect to reset currentPage when isSearch changes
    useEffect(() => {
        if (!isSearch) {
            setCurrentPage(1);
        }
    }, [isSearch]);

    // Effect to reset currentPage when maxTableHeight changes
    useEffect(() => {
        setCurrentPage(1);
    }, [maxTableHeight]);

    // Function to calculate row height
    const calculateRowHeight = () => {
        if (tableContainerRef.current) {
            const firstRowElement = tableContainerRef.current.querySelector('table tbody tr');
            if (firstRowElement) {
                setRowHeight(firstRowElement.clientHeight);
            }
        }
    };

    // Function to update maxTableHeight
    const updateMaxTableHeight = () => {
        if (tableContainerRef.current) {
            setMaxTableHeight(tableContainerRef.current.scrollHeight);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState(null);

    // Function to handle delete click
    const handleDeleteClick = async (id) => {
        // Set the item id to delete and display the modal
        setItemIdToDelete(id);
        setShowModal(true);
    };

    // Function to handle confirmation and delete
    const handleConfirmation = async () => {
        if (!itemIdToDelete) return; // Check if an item id is set
        // Proceed with deletion using the id
        await dispatch(deleteData(itemIdToDelete));
        // Other deletion related operations
        setItemIdToDelete(null); // Reset the item id
        setShowModal(false); // Hide the modal
    };

    // Function to handle cancellation
    const handleCancel = () => {
        setItemIdToDelete(null); // Reset the item id
        setShowModal(false); // Hide the modal
    };


    // Function to calculate index range for current page
    const calculateIndexRange = () => {
        const itemsPerPage = calculateItemsPerPage();
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return [indexOfFirstItem, indexOfLastItem];
    };


    // Function to calculate items per page
    const calculateItemsPerPage = () => {
        if (fixedRowNumber) {
            return fixedRowNumber;
        }
        const itemHeight = rowHeight;
        return Math.floor(maxTableHeight / itemHeight);
    };
    // Function to handle pagination
    const paginate = pageNumber => setCurrentPage(pageNumber);


    // Get current items based on pagination
    const [indexOfFirstItem, indexOfLastItem] = calculateIndexRange();
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Function to format date to display only the date part
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the format as needed
    };

    const color = (status) => {
        if (status === "Paid") {
            return "bg-green-500 text-white";
        }
        else if (status === "Due") {
            return "bg-red-100 text-red-500";
        }
        else if (status === "Overdue") {
            return "bg-yellow-100 text-yellow-500";
        }
    }

    return (
        <>
            <div className="relative overflow-x-auto border sm:rounded-lg h-full flex justify-between flex-col " ref={tableContainerRef}>
                {/* Toast message */}
                {showModal && (
                <div className="fixed inset-0 w-full h-full backdrop-blur-sm backdrop-brightness-60 backdrop-contrast-50 backdrop-saturate-50 flex justify-center items-center" onClick={handleCancel}>
                    <div className="p-6  border border-slate-500 min-w-80 rounded-lg gap-6 bg-slate-100 shadow grid grid-flow-row">
                        <p className='text-center'>Are you sure ?</p>
                        <div className='grid grid-flow-col gap-4'>
                        <Button onClick={handleConfirmation} text="Delete" className='bg-red-600 hover:bg-red-800 shadow'/>
                        <Button onClick={handleCancel} text="Cancel" className='bg-gray-50 text-black border shadow hover:bg-gray-200'/>
                        </div>
                        {/* <button onClick={handleConfirmation}>Yes</button>
                        <button onClick={handleCancel}>No</button> */}
                    </div>
                </div>
            )}
                {showToast.message && (
                    <div id="toast-success" className={`animate-fade animate-duration-[300ms] animate-delay-50 animate-ease-in absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-fit flex items-center w-full max-w-xs p-4 mb-4 text-white ${showToast.message == "Deleted Successfully" ? "bg-red-500" : "bg-green-500"} rounded-lg shadow`} role="">
                        <div className="ms-3 text-sm font-normal">{showToast.message}</div>
                        <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-success" aria-label="Close" onClick={hideToast}>
                            <span className="sr-only">Close</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Table */}
                <table className="w-full text-sm text-left text-gray-500" >
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                        <tr>
                            <th scope="col" className="ps-6 py-3 w-6">S.N.</th>
                            {columns.map((column, index) => (
                                <th key={index} scope="col" className="px-6 py-3 whitespace-nowrap">
                                    {column}
                                </th>
                            ))}
                            {action === "no" ? null :
                                from !== "home" ?
                                    <th className="px-6 py-3 w-56">Actions</th> : null
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {/* Loading animation */}
                        {loading && currentItems.length === 0 &&
                            <tr className='border-b'>
                                <td colSpan={columns.length + 2} className='px-6 py-4'>
                                    <Loading/>
                                </td>
                            </tr>
                        }
                        {/* No data message */}
                        {currentItems.length === 0 && !loading ? <tr className='border-b'><td colSpan={columns.length + 2} className='px-6 py-4 text-center'>No data found</td></tr> :
                            currentItems.map((row, rowIndex) => (
                                <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'even:bg-gray-50' : 'odd:bg-white'} border-b`}>
                                    <td className={`ps-6 ${from != "report" ? "py-4" : ""}  w-6`}>{rowIndex + ((currentPage - 1) * calculateItemsPerPage()) + 1}</td>
                                    {tableBody.map((cell) => (
                                        <td key={cell} className={`px-6 ${from === "report" ? "py-4" : ""} max-w-56 whitespace-nowrap`}>
                                            {cell === "description" ?
                                                (row[cell].length > 24 ? row[cell].slice(0, 24) + "..." : row[cell])
                                                :
                                                (cell === "customer" ? row[cell].name : (cell === "dueDate" || cell === "createdAt" ? (row[cell] ? formatDate(row[cell]) : "-") : cell === "status" ? <p className={`py-1.5 w-4/5 rounded-lg text-center text-xs font-bold ${color(row[cell])}`}>{row[cell]}</p> : row[cell]))
                                            }
                                        </td>
                                    ))}
                                    {action === "editDelete" ? (
                                        <td className="px-6 w-56 space-x-2">
                                            <Button
                                                className="text-sm font-medium text-blue-600 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                                text="Edit"
                                                onClick={() => handleEditClick(row)}
                                            />
                                            <Button
                                                className="text-sm font-medium text-red-600 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                                text="Delete"
                                                onClick={() => handleDeleteClick(row._id)}
                                            />
                                        </td>
                                    ) : (
                                        action === "view" && (
                                            <td className="px-6 w-56 space-x-2">
                                                <Link
                                                    className="font-medium py-2 px-4 text-sm text-blue-600 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                                    to={`/bill/${row._id}`}
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        )
                                    )}

                                </tr>
                            ))}
                    </tbody>

                </table>
                {/* Pagination controls */}
                {Math.ceil(data.length / calculateItemsPerPage()) > 1 && from !== "home" && (
                    <nav aria-label="Page navigation example" className='ml-auto mr-2 my-2'>
                        <ul className="inline-flex -space-x-px text-sm">
                            <li>
                                <button
                                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 "
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {Array.from({ length: Math.ceil(data.length / calculateItemsPerPage()) }).map((_, index) => (
                                <li key={index}>
                                    <button
                                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border  ${currentPage === index + 1 ? "bg-blue-500 text-white border-blue-600" : ' bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 '}`}
                                        onClick={() => paginate(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(data.length / calculateItemsPerPage())}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>)}
            </div>
        </>
    );
};

export default DynamicTable;
