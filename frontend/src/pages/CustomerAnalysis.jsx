import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import CollapsibleSection from "../components/CollapsibleSection";
import DynamicTable from "../components/DynamicTable";
import PeriodDropdown from "../components/PeriodDropdown";
import { ChartOption, convertToPieChartData, customerProfitability, formatDataForBarChart, getCustomerTrend, getCustomerTrendByYears, getLabelForFactor, getMetric, sortArrayByColumn, sortDataByTopLeast } from "../components/Report/SalesReport";
import { getBill } from "../redux/bill/billActions";
import { getAllCustomers } from "../redux/customer/customerActions";
import { MyResponsivePie } from "../components/Report/PieChart";
import { MyResponsiveBar } from "../components/Report/Bar";
import { MyResponsiveLine } from "../components/Report/NivoLine";

const CustomerAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const bills = useSelector(state => state.bills).bills;
  const customers = useSelector(state => state.customers).customers;
  const [year, setYear] = useState("All Time");
  const [factor, setFactor] = useState("totalRevenue");
  const [month, setMonth] = useState("All Time");
  const [piechartdata, setPiechartdata] = useState([]);

  const [customerPerformance, setCustomerPerformance] = useState([])
  const [sortedData, setSortedData] = useState([]);
  const [topLeast, setTopLeast] = useState("Top");
  const [chartType, setChartType] = useState("Line")

  const [trendYear, setTrendYear] = useState(2024);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([])
  const [trendData, setTrendData] = useState([]);

  const [trendCustomer, setTrendCustomer] = useState()
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [selectedYears, setSelectedYears] = useState([2024]);
  const [trendDataMultiYear, setTrendDataMultiYear] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getBill());
        await dispatch(getAllCustomers());
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (bills && customers) {
      setCustomerPerformance(customerProfitability(bills, customers, year, month, factor));
    }
  }, [bills, customers, year, month, factor]);

  useEffect(() => {
    setPiechartdata(convertToPieChartData(sortArrayByColumn(getMetric(customerPerformance, factor), factor), colors, factor, "name"));
    setSortedData(sortDataByTopLeast(getMetric(sortArrayByColumn(customerPerformance, factor), factor), topLeast, factor));
  }, [customerPerformance, factor, topLeast]);

  useEffect(() => {
    if (customers && customers.length > 1) {
      setTrendCustomer(customers[0]._id)
      setSelectedCustomerIds([customers[0]._id]);
    }
  }, [customers]);

  useEffect(() => {
    if (customers && selectedCustomerIds.length > 0) {
      const data = getCustomerTrend(customers, bills, selectedCustomerIds, trendYear, factor);
      setTrendData(data);
      console.log(trendData, "sut trend")
    }
  }, [customers, bills, selectedCustomerIds, trendYear, factor]);

  useEffect(() => {
    if (customers && trendCustomer) {
      const data = getCustomerTrendByYears(customers, bills, trendCustomer, selectedYears, factor);
      setTrendDataMultiYear(data);
      console.log(trendDataMultiYear, "check")
    }
  }, [customers, bills, selectedYears, trendCustomer, factor]);


  const factorOptions = ['totalRevenue', 'totalPayment', 'totalDue']
  const colors = ['#FF6B6B', '#FFA500', '#9B59B6', '#3498DB', '#2ECC71', '#E67E22', '#8E44AD', '#16A085', '#D35400', '#2980B9'];

  const sortOption = () => {
    return (
      <div className='flex items-center gap-4'>
        <p>Sort By:</p>
        <PeriodDropdown
          selectedPeriod={year}
          onSelectPeriod={setYear}
          datas={['All Time', '2022', '2023', '2024']}
          text="Select Year"
        />
        <PeriodDropdown
          selectedPeriod={month}
          onSelectPeriod={setMonth}
          datas={['All Time', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
          text="Select Month"
        />
        <PeriodDropdown
          selectedPeriod={factor}
          onSelectPeriod={setFactor}
          datas={factorOptions}
          text="Select Period"
        />
      </div>
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };

  const handleCustomerSelection = (customerId) => {
    setSelectedCustomerIds(prevSelected => {
      if (prevSelected.includes(customerId)) {
        return prevSelected.filter(id => id !== customerId);
      } else {
        return [...prevSelected, customerId];
      }
    });
  };

  const handleYearSelection = (year) => {
    setSelectedYears(prevSelected => {
      if (prevSelected.includes(year)) {
        return prevSelected.filter(id => id !== year);
      } else {
        return [...prevSelected, year];
      }
    });
  };

  if (loading) {
    return (
      <div className='w-full h-full flex justify-center items-center bg-white'>
        <Loading />
      </div>
    )
  }

  if (customerPerformance) {
    console.log(sortArrayByColumn(customerPerformance), "custchek")
    console.log(bills, "bills")
    console.log(piechartdata, "pieeeee")
    console.log(getCustomerTrend(customers, bills, selectedCustomerIds, trendYear, factor), selectedCustomerIds, trendYear, factor, customers, bills, "sut trend")
  }
  return (
    <div className='w-full h-full flex flex-col bg-gray-50 p-4 pt-0 gap-4 overflow-y-scroll'>
      <div className='flex justify-between items-center pl-2 py-4 bg-gray-50 sticky top-0 z-30 shadow'>
        <h1 className="font-bold text-lg text-gray-900">Customer Analysis</h1>
      </div>
      {loading == true ?
        <div className='w-full h-full flex justify-center items-center bg-white'>
          <Loading />
        </div>
        :
        <>
          <CollapsibleSection title="Customer Performance Summary" option={sortOption()} className='max-h-fit' visibility={false}>
            <DynamicTable
              columns={['customer name', 'total Sales', 'total Payment', "Total due"]}
              tableBody={['name', 'totalRevenue', 'totalPayment', 'totalDue']}
              data={sortArrayByColumn(customerPerformance, factor)}
              action="no"
              fixedRowNumber="7"
            />
          </CollapsibleSection>

          <CollapsibleSection title={`${getLabelForFactor(factor)} volume of each Customer`} option={sortOption()}>
            {/* Content here */}
            <div className='h-[60vh]'>
              <MyResponsivePie
                data={piechartdata}
                legendDir='column'
                legendAnchor='top-right'
                showLabel="true"
                labelOffset="0.5"
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={`${topLeast} Customer Performance`}
            option={
              <>
                {sortOption()}
                <PeriodDropdown selectedPeriod={topLeast} onSelectPeriod={setTopLeast} datas={['Top', 'Least']} text="Select Top/Least" className='w-fit' />
              </>}>
            {/* Content here */}
            <div className="h-[60vh] pb-6">
              <MyResponsiveBar
                data={sortedData}
                keys={[factor]}
                leftLegend="Cash"
                bottomLegend="product"
                indexBy="name"
                colors={colors}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Customer Sales Trends Comparison"
            option={<div className='flex gap-4'>
              <ChartOption chartType={chartType} setChartType={setChartType} />
              <PeriodDropdown
                selectedPeriod={trendYear}
                onSelectPeriod={setTrendYear}
                datas={['2022', '2023', '2024']}
                text="Select Year"
              />
              <PeriodDropdown
                selectedPeriod={factor}
                onSelectPeriod={setFactor}
                datas={factorOptions}
                text="Select Period"
              />
              <div className=''>
                <button
                  id="dropdownBgHoverButton"
                  data-dropdown-toggle="dropdownBgHover"
                  className="hover:bg-blue-50 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center border w-48"
                  type="button"
                  onClick={toggleDropdown}
                >
                  Select Customer
                  <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div id="dropdownBgHover" className="z-10 w-48 bg-white rounded-lg shadow relative">
                    <ul className="p-3 space-y-1 text-sm text-gray-700 h-56 overflow-y-auto absolute inset-0 border rounded-lg bg-white z-10" aria-labelledby="dropdownBgHoverButton">
                      {customers.map((customer) => (
                        <li key={customer._id}>
                          <div className="flex items-center p-2 rounded hover:bg-gray-100">
                            <input
                              id={`checkbox-item-${customer._id}`}
                              type="checkbox"
                              checked={selectedCustomerIds.includes(customer._id)}
                              onChange={() => {
                                handleCustomerSelection(customer._id);
                                toggleDropdown();
                              }}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
                            />
                            <label
                              htmlFor={`checkbox-item-${customer._id}`}
                              className="w-full ms-2 text-sm font-medium text-gray-900 rounded"
                            >
                              {customer.name}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>} >
            <div className='h-[60vh]'>
              {chartType == "Line" ?
                <MyResponsiveLine
                  data={trendData}
                  legendX={trendYear}
                  legendY={getLabelForFactor(factor)}
                />
                :
                <MyResponsiveBar
                  data={formatDataForBarChart(trendData)}
                  keys={Object.keys(formatDataForBarChart(trendData)[0]).filter(key => key !== 'month')}
                  leftLegend="Cash"
                  bottomLegend="product"
                  indexBy="month"
                  colors={colors}
                />
              }
            </div>
          </CollapsibleSection>


          <CollapsibleSection title="Customer Sales Trends comparison with Years"
            option={<div className='flex gap-4'>
              <ChartOption chartType={chartType} setChartType={setChartType} />
              <PeriodDropdown
                selectedPeriod={trendCustomer}
                onSelectPeriod={setTrendCustomer}
                datas={customers.map((customer) => ({ value: customer._id, label: customer.name }))}
                text="Select Customer"
                product={true}
              />

              <PeriodDropdown
                selectedPeriod={factor}
                onSelectPeriod={setFactor}
                datas={factorOptions}
                text="Select Period"
              />
              <div className=''>
                <button
                  id="dropdownBgHoverButton"
                  data-dropdown-toggle="dropdownBgHover"
                  className="hover:bg-blue-50 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center border w-48"
                  type="button"
                  onClick={toggleDropdown1}
                >
                  Select Year
                  <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                {isDropdownOpen1 && (
                  <div id="dropdownBgHover" className="z-10 w-48 bg-white rounded-lg shadow relative">
                    <ul className="p-3 space-y-1 text-sm text-gray-700 h-56 overflow-y-auto absolute inset-0 border rounded-lg bg-white z-10" aria-labelledby="dropdownBgHoverButton">
                      {[2022, 2023, 2024].map((year) => (
                        <li key={year}>
                          <div className="flex items-center p-2 rounded hover:bg-gray-100">
                            <input
                              id={`checkbox-item-${year}`}
                              type="checkbox"
                              checked={selectedYears.includes(year)}
                              onChange={() => {
                                handleYearSelection(year);
                                toggleDropdown1();
                              }}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
                            />
                            <label
                              htmlFor={`checkbox-item-${year}`}
                              className="w-full ms-2 text-sm font-medium text-gray-900 rounded"
                            >
                              {year}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>} >
            <div className='h-[60vh]'>
              {chartType == "Line" ?
                <MyResponsiveLine data={trendDataMultiYear}
                  legendX="Months" legendY={getLabelForFactor(factor)} />
                :
                <MyResponsiveBar
                  data={formatDataForBarChart(trendDataMultiYear)}
                  keys={Object.keys(formatDataForBarChart(trendDataMultiYear)[0]).filter(key => key !== 'month')}
                  leftLegend={getLabelForFactor(factor)}
                  bottomLegend="Month"
                  indexBy="month"
                  colors={colors}
                />
              }
            </div>
          </CollapsibleSection>
        </>}
    </div>
  )
}

export default CustomerAnalysis;
