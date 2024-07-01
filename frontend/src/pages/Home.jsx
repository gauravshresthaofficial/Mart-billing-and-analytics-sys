import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import withAuth from "../hooks/withAuth";
import { getBill } from "../redux/bill/billActions";
import Sidebar from "../components/Sidebar";
import DataDisplay from "../components/DataDisplay";
import { MyResponsivePie } from "../components/Report/PieChart";
import { calculateBillStatus } from "../components/Report/SalesReport";
import DynamicTable from "../components/DynamicTable";


const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { bills } = useSelector((state) => state.bills);
  const [filteredBills, setFilteredBills] = useState([])

  useEffect(() => {
    setLoading(true);
    dispatch(getBill())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  // Update filteredBills whenever bills changes
  useEffect(() => {
    // Sort bills by date in descending order
    const sortedBills = [...bills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // Slice to get only the recent 5 bills
    const recentBills = sortedBills.slice(0, 5);
    setFilteredBills(recentBills);
  }, [bills]);
  console.log(filteredBills)

  const Logout = () => {
    removeCookie("token");
    navigate('/login');
  };

  // Function to format date to display only the date part
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust the format as needed
  };

  const pieChartDetails = calculateBillStatus(bills)

  //##########################################
  //##########################################
  //##########################################

  const columns = ['Bill No.', 'Customer Name', 'Date', 'Total', 'Payment Status', 'Due Amount'];
  const tableBody = ["invoiceNumber", "customer", "createdAt", "total", "status", "amtDue"];




  return (
    <>
      {/* main */}
      <div className="w-full h-full flex flex-col bg-gray-50 p-4 gap-4">
        {/* new invoice */}
        {/* box */}
        <div className='flex justify-between items-center pl-2'>
          <h1 className="font-bold text-lg text-gray-900">Dashboard</h1>
          <Link className='bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg ml-auto block' to={`/bill`}>Create Bill</Link>
        </div>

        <div className="flex-grow grid grid-rows-2 gap-4 rounded-lg border p-4 shadow-md bg-white">
          <div className="grid grid-cols-2 w-full h-full">
            <DataDisplay />
            <MyResponsivePie data={pieChartDetails}></MyResponsivePie>
          </div>
          <div className="h-full w-full hover:bg-blue-50 hover:shadow-sm" onClick={()=>navigate("/bill/record")}>
          <DynamicTable columns={columns} data={filteredBills || []} loading={loading} tableBody={tableBody} action="no" />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
