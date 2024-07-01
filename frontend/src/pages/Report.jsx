import { useDispatch, useSelector } from "react-redux"
import { useEffect, useMemo, useState } from "react";
import { getBill } from '../redux/bill/billActions'
import { aggregateBills, calculateBillStatus, calculateCustomerRevenueCostProfit, calculateProductPerformance, customerProfitability, getLatestSales, getTopSales } from '../components/Report/SalesReport'
import { MyResponsiveLine } from "../components/Report/NivoLine";
import { MyResponsivePie } from "../components/Report/PieChart"
import { MyResponsiveBar } from "../components/Report/Bar"
import { getProduct } from "../redux/product/productActions";
import YearDropdown from "../components/YearDropdown";
import PeriodDropdown from "../components/PeriodDropdown";
import Button from "../components/Button";
import { ProductAnalysis } from "./ProductAnalysis";
import Loading from "../components/Loading";
import CustomerAnalysis from "./CustomerAnalysis";

const Report = () => {
  const dispatch = useDispatch();
  const bills = useSelector(state => state.bills).bills;
  const products = useSelector(state => state.products).products;
  const [loading, setLoading] = useState(true)
  const [latestSalesData, setLatestSalesData] = useState([]);
  const [topsales, setTopSales] = useState([]);
  const [billIssuedData, setBillIssuedData] = useState([]);
  const [customerProfit, setCustomerProfit] = useState([]);
  const [customerNet, setCustomerNet] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [tab, setTab] = useState("default")

  const periods = ["daily", "monthly", "yearly"]

  useEffect(() => {
    setLoading(true)
    dispatch(getBill())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
    dispatch(getProduct())
      .then(() => setLoading(false)) // Set loading to false after products are fetched
      .catch(() => setLoading(false)); // Handle any errors and still set loading to false
  }, [dispatch])



  useEffect(() => {
    // console.log(selectedPeriod)
    setLatestSalesData(getLatestSales(bills, selectedPeriod));
    setTopSales(getTopSales(bills, selectedPeriod));
    setBillIssuedData(aggregateBills(selectedPeriod, bills));
    // setCustomerProfit(customerProfitability(bills));
    setCustomerNet(calculateCustomerRevenueCostProfit(bills, products));
    setProductPerformance(calculateProductPerformance(bills, products).slice(0, 5));
  }, [bills, selectedPeriod, products]);





  return (
    <>

      <div className='w-full h-full flex flex-col bg-gray-50 p-4 pt-0 gap-4 overflow-y-scroll'>
        <div className='flex justify-between items-center pl-2 py-4 bg-gray-50 sticky top-0 z-30 shadow'>
          <h1 className="font-bold text-lg text-gray-900">Sales Analysis</h1>
          {/* <div className="flex  bg-white gap-6 items-center justify-center pt-4">
            <Button onClick={() => { setTab("default") }} text="Default" className={tab == "default" ? "" : "bg-gray-100 text-black hover:bg-gray-200"} />
            <Button onClick={() => { setTab("product") }} text="Product" className={tab == "product" ? "" : "bg-gray-100 text-black hover:bg-gray-200"} />
            <Button onClick={() => { setTab("customer") }} text="Customer" className={tab == "customer" ? "" : "bg-gray-100 text-black hover:bg-gray-200"} />
          </div> */}
        </div>
        {loading == true ?
          <div className='w-full h-full flex justify-center items-center bg-white'>
            <Loading />
          </div>
          :
          // <div className="flex-grow flex flex-col space-y-10 rounded-lg border p-4 shadow-md bg-white">
          <div>
            <div className="flex flex-col flex-grow h-[70vh] w-full">
              <div className="flex justify-between">
                <h1 className="font-semibold text-lg text-gray-900 ml-10 mb-0">Sales Trends</h1>
                <PeriodDropdown selectedPeriod={selectedPeriod} onSelectPeriod={setSelectedPeriod} datas={periods} text="Select Period"></PeriodDropdown>
              </div>
              <MyResponsiveLine data={latestSalesData} legendX={'Time - ' + selectedPeriod} legendY="Revenue"></MyResponsiveLine>
            </div>

            <div className="h-[75vh] border-t-2 py-6">
              <h1 className="font-semibold text-lg text-gray-900 ml-10 mb-0 block">Total Bill Issued</h1>
              <MyResponsiveBar data={billIssuedData} keys={["bill issued"]} leftLegend="Bill Issued" bottomLegend="June" indexBy="period" ></MyResponsiveBar>
            </div>


            {/* 
            <div className="h-[75vh] border-t-2 py-6">
              <h1 className="font-semibold text-lg text-gray-900 ml-10 mb-0 block">Customer Transaction</h1>
              <MyResponsiveBar data={customerProfit} keys={['totalSales', 'totalPayments', 'outstandingBalance']} leftLegend="Cash" bottomLegend="Customer" indexBy="customer" colors={customColors}
              // groupMode="stacked"
              ></MyResponsiveBar>
            </div> */}

            {/* //customerProfitability */}
            {/* <div className="h-[75vh] border-t-2 py-6">
                <h1 className="font-semibold text-lg text-gray-900 ml-10 mb-0 block">Customer Profitability</h1>
                <MyResponsiveBar data={customerNet} keys={['totalRevenue', 'totalCost', 'netProfit']} leftLegend="Cash" bottomLegend="Customer" indexBy="customer" colors={customColors} ></MyResponsiveBar>
              </div> */}


            {/* <div className="h-[75vh] border-t-2 py-6">
                <h1 className="font-semibold text-lg text-gray-900 ml-10 mb-0 block">Product Performance</h1>
                <MyResponsiveBar data={productPerformance} keys={['totalRevenue', 'unitsSold', 'totalCosts', 'netProfit']} leftLegend="Cash" bottomLegend="product" indexBy="product" colors={customColors} ></MyResponsiveBar>
              </div> */}



          </div>}
      </div >
    </>
  )
}

export default Report
