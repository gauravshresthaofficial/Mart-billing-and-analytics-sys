import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProduct } from '../redux/product/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { getBill } from '../redux/bill/billActions';
import { MyResponsiveBar } from '../components/Report/Bar';
import DynamicTable from '../components/DynamicTable';
import PeriodDropdown from '../components/PeriodDropdown';
import { MyResponsiveLine } from '../components/Report/NivoLine';
import { calculateProductPerformance, getMetric, convertToPieChartData, sortDataByTopLeast, sortArrayByColumn, getProductTrend, getProductTrendForMultipleYears, formatDataForBarChart, ChartOption } from '../components/Report/SalesReport';
import { MyResponsivePie } from '../components/Report/PieChart';
import Loading from '../components/Loading';
import CollapsibleSection from '../components/CollapsibleSection';

export const ProductAnalysis = () => {
    const dispatch = useDispatch();
    const bills = useSelector(state => state.bills).bills;
    const products = useSelector(state => state.products).products;
    const [loading, setLoading] = useState(true);
    const [productPerformance, setProductPerformance] = useState([]);
    const [piechartdata, setPiechartdata] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [year, setYear] = useState("All Time");
    const [factor, setFactor] = useState("totalRevenue");
    const [month, setMonth] = useState("All Time");
    const [topLeast, setTopLeast] = useState("Top");
    const [trendYear, setTrendYear] = useState(2024);
    const [trendProduct, setTrendProduct] = useState()
    const [firstProductId, setFirstProductId] = useState();
    const [secondProductId, setSecondProductId] = useState();
    const [selectedYears, setSelectedYears] = useState([2024]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [isChartVisible, setIsChartVisible] = useState(false);
    const [isLineChartVisible, setIsLineChartVisible] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
    const [trendData, setTrendData] = useState([]);
    const [trendDataMultiYear, setTrendDataMultiYear] = useState([])
    const [chartType, setChartType] = useState("Bar")

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getBill());
                await dispatch(getAllProduct());
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (bills && products) {
            setProductPerformance(calculateProductPerformance(bills, products, year, month, factor));
        }
    }, [bills, products, year, month, factor]);

    useEffect(() => {
        if (products && products.length > 1) {
            setFirstProductId(products[0]._id);
            setSecondProductId(products[1]._id);
            setTrendProduct(products[0]._id);
            setSelectedProductIds([products[0]._id]);
        }
    }, [products]);

    const customColors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'];
    const colors = ['#FF6B6B', '#FFA500', '#9B59B6', '#3498DB', '#2ECC71', '#E67E22', '#8E44AD', '#16A085', '#D35400', '#2980B9'];

    useEffect(() => {
        setPiechartdata(convertToPieChartData(getMetric(productPerformance, factor), colors, factor));
        setSortedData(sortDataByTopLeast(getMetric(sortArrayByColumn(productPerformance, factor), factor), topLeast, factor));
        console.log(sortedData, "sorttttttttttt")
    }, [productPerformance, factor, topLeast]);

    useEffect(() => {
        if (products && selectedProductIds.length > 0) {
            const data = getProductTrend(products, bills, selectedProductIds, trendYear, factor);
            setTrendData(data);
            console.log(trendData, "product trend")
        }
    }, [products, bills, selectedProductIds, trendYear, factor]);

    useEffect(() => {
        if (products && trendProduct) {
            const data = getProductTrendForMultipleYears(products, bills, trendProduct, selectedYears, factor);
            setTrendDataMultiYear(data);
            console.log(trendDataMultiYear, "check")
        }
    }, [products, bills, selectedYears, trendProduct, factor]);

    const propertyLabels = {
        totalRevenue: "Total Revenue",
        unitsSold: "Units Sold",
        totalCosts: "Total Costs",
        netProfit: "Net Profit",
        profitMargin: "Profit Margin"
    };

    function getLabelForFactor(factor) {
        return propertyLabels[factor] || factor;
    }

    // const toggleChartVisibility = (chart) => {
    //     if (chart === "lineChart") {
    //         setIsLineChartVisible(!isLineChartVisible);
    //         console.log(isLineChartVisible)
    //     } else {
    //         setIsChartVisible(!isChartVisible);
    //     }
    // };

    const handleProductSelection = (productId) => {
        setSelectedProductIds(prevSelected => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter(id => id !== productId);
            } else {
                return [...prevSelected, productId];
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const toggleDropdown1 = () => {
        setIsDropdownOpen1(!isDropdownOpen1);
    };

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
                    datas={['totalRevenue', 'unitsSold', 'totalCosts', 'netProfit', "profitMargin"]}
                    text="Select Period"
                />
            </div>
        );
    };

    const chartOption = () => {
        return (
            <PeriodDropdown
                selectedPeriod={chartType}
                onSelectPeriod={setChartType}
                datas={['Line', 'Bar']}
                text="Select Type"
            />
        );
    }

    if (firstProductId)
        console.log(getProductTrendForMultipleYears(products, bills, trendProduct, [2023, 2024], factor), "multiyear")

    console.log(formatDataForBarChart(trendData), "trtenda")
    console.log(formatDataForBarChart(trendDataMultiYear), "barchart")
    console.log(sortedData, "sorted")
    console.log(getMetric(productPerformance, factor), "meeeeee")

    if (loading) {
        return <div className='w-full h-full flex justify-center items-center bg-white'>
            <Loading />
        </div>;
    }


    return (
        <div className='w-full h-full flex flex-col bg-gray-50 p-4 pt-0 gap-4 overflow-y-scroll'>
            <div className='flex justify-between items-center pl-2 py-4 bg-gray-50 sticky top-0 z-30 shadow'>
                <h1 className="font-bold text-lg text-gray-900">Product Analysis</h1>
            </div>
            {loading == true ?
                <div className='w-full h-full flex justify-center items-center bg-white'>
                    <Loading />
                </div>
                :
                <>
                    <CollapsibleSection title="Product Performance Summary" option={sortOption()} className='max-h-fit' visibility={false}>
                        <DynamicTable
                            columns={['product name', 'total Revenue', 'units Sold', 'total Costs', 'net Profit', 'profit margin']}
                            tableBody={['product', 'totalRevenue', 'unitsSold', 'totalCosts', 'netProfit', 'profitMargin']}
                            data={sortArrayByColumn(productPerformance, factor)}
                            action="no"
                            fixedRowNumber="8"
                        />
                    </CollapsibleSection>
                    <CollapsibleSection title={`${getLabelForFactor(factor)} volume of each product`} option={sortOption()}>
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

                    <CollapsibleSection title={`${topLeast} Product Performance`}
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
                                indexBy="product"
                                colors={customColors}
                            />
                        </div>
                    </CollapsibleSection>

                    {/* Product trends */}
                    <CollapsibleSection title="Product Sales Trends Comparison"
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
                                datas={['totalRevenue', 'unitsSold', 'totalCosts', 'netProfit', "profitMargin"]}
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
                                    Select Product
                                    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                {isDropdownOpen && (
                                    <div id="dropdownBgHover" className="z-10 w-48 bg-white rounded-lg shadow relative">
                                        <ul className="p-3 space-y-1 text-sm text-gray-700 h-56 overflow-y-auto absolute inset-0 border rounded-lg bg-white z-10" aria-labelledby="dropdownBgHoverButton">
                                            {products.map((product) => (
                                                <li key={product._id}>
                                                    <div className="flex items-center p-2 rounded hover:bg-gray-100">
                                                        <input
                                                            id={`checkbox-item-${product._id}`}
                                                            type="checkbox"
                                                            checked={selectedProductIds.includes(product._id)}
                                                            onChange={() => {
                                                                handleProductSelection(product._id);
                                                                toggleDropdown();
                                                            }}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
                                                        />
                                                        <label
                                                            htmlFor={`checkbox-item-${product._id}`}
                                                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded"
                                                        >
                                                            {product.name}
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
                                    keys={trendData && formatDataForBarChart(trendData)[0] ? Object.keys(formatDataForBarChart(trendData)[0]).filter(key => key !== 'month') : []}
                                    leftLegend="Cash"
                                    bottomLegend="product"
                                    indexBy="month"
                                    colors={customColors}
                                />}
                        </div>
                    </CollapsibleSection>

                    {/* #####################################################'
                    same product in multiple year line chart
                    #####################################################
                    ##################################################### */}
                    <CollapsibleSection title="Product Sales Trends comparison with Years"
                        option={<div className='flex gap-4'>
                            <ChartOption chartType={chartType} setChartType={setChartType} />
                            <PeriodDropdown
                                selectedPeriod={trendProduct}
                                onSelectPeriod={setTrendProduct}
                                datas={products.map((product) => ({ value: product._id, label: product.name }))}
                                text="Select Product"
                                product={true}
                            />

                            <PeriodDropdown
                                selectedPeriod={factor}
                                onSelectPeriod={setFactor}
                                datas={['totalRevenue', 'unitsSold', 'totalCosts', 'netProfit', "profitMargin"]}
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
                                    let keys = {trendDataMultiYear && formatDataForBarChart(trendDataMultiYear)[0] ? Object.keys(formatDataForBarChart(trendDataMultiYear)[0]).filter(key => key !== 'month') : []}
                                    leftLegend="Cash"
                                    bottomLegend="product"
                                    indexBy="month"
                                    colors={customColors}
                                />
                            }
                        </div>
                    </CollapsibleSection>
                </>}
        </div>
    )

}

