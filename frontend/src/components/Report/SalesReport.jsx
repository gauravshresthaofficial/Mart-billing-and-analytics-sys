import PeriodDropdown from "../PeriodDropdown";

export const salesReport = async (bills) => {
  return bills;
};

const propertyLabels = {
  totalRevenue: "Total Revenue",
  totalPayment: "Total Payment",
  outstandingBalance: "Outstanding Balance",
  totalDue: "Total Due",
  unitsSold: "Units Sold",
  totalCosts: "Total Costs",
  netProfit: "Net Profit",
  profitMargin: "Profit Margin",
};

export function getLabelForFactor(factor) {
  return propertyLabels[factor] || factor;
}

export const ChartOption = ({ chartType, setChartType }) => {
  return (
    <PeriodDropdown
      selectedPeriod={chartType}
      onSelectPeriod={setChartType}
      datas={["Line", "Bar"]}
      text="Select Type"
    />
  );
};

export function getTopSales(data, period) {
  // console.log(data);

  // Helper function to parse the date and filter by the specified period
  function filterByPeriod(date, period) {
    const now = new Date();
    const itemDate = new Date(date);

    if (period === "daily") {
      return itemDate.toDateString() === now.toDateString();
    } else if (period === "weekly") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    } else if (period === "monthly") {
      return (
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      );
    }
    return false;
  }

  // Filter the data based on the period
  const filteredData = data.filter(
    (item) => item.createdAt && filterByPeriod(item.createdAt, period)
  );

  // Calculate the total sales for each item and store in an array
  const salesData = filteredData.map((item) => {
    const totalAmount = item.items.reduce((sum, curr) => {
      const unitPrice = parseFloat(curr.unitPrice) || 0;
      const quantity = parseFloat(curr.quantity) || 0;
      const discount = parseFloat(curr.discount) || 0;
      return sum + (unitPrice * quantity - discount);
    }, 0);
    return {
      x: item._id, // You can change this to item name or any other identifier if needed
      y: totalAmount,
    };
  });

  // Sort the sales data in descending order
  salesData.sort((a, b) => b.y - a.y);

  // Get the top 10 sales
  const topSales = salesData.slice(0, 10);

  // Format the data for output
  const formattedData = {
    id: "sales",
    color: "hsl(225, 70%, 50%)", // Example color, can be dynamic or changed as needed
    data: topSales,
  };

  // console.log(formattedData, "topsales");

  return formattedData;
}

export function getLatestSales(data, period, year = 2023) {
  // console.log(data);

  // Helper function to filter by the last N periods and generate labels
  function getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  function getEndOfWeek(date) {
    const endOfWeek = new Date(getStartOfWeek(date));
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  function getEndOfMonth(date) {
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return endOfMonth;
  }

  function formatLabel(date, period) {
    const options = { day: "numeric", month: "short" };
    if (period === "weekly") {
      const endOfWeek = getEndOfWeek(date);
      return endOfWeek.toLocaleDateString(undefined, options);
    } else if (period === "monthly") {
      const endOfMonth = getEndOfMonth(date);
      return endOfMonth.toLocaleDateString(undefined, options);
    } else {
      // Daily
      return date.toLocaleDateString(undefined, options);
    }
  }

  function filterAndLabelByLastNPeriods(period, n) {
    const now = new Date();
    const periods = [];

    if (period === "daily") {
      for (let i = 0; i < n; i++) {
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - i);
        startDate.setHours(0, 0, 0, 0);
        periods.push({ startDate, label: formatLabel(startDate, period) });
      }
    } else if (period === "weekly") {
      for (let i = 0; i < n; i++) {
        const startDate = getStartOfWeek(new Date(now));
        startDate.setDate(startDate.getDate() - i * 7);
        const endDate = getEndOfWeek(startDate);
        periods.push({
          startDate,
          endDate,
          label: formatLabel(endDate, period),
        });
      }
    } else if (period === "monthly") {
      for (let i = 0; i < n; i++) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = getEndOfMonth(startDate);
        periods.push({
          startDate,
          endDate,
          label: formatLabel(endDate, period),
        });
      }
    }
    // else {
    //   for (let i = 0; i < n; i++) {
    //     const startDate = new Date()
    //   }
    // }

    return periods.reverse(); // Reverse to have the latest period first
  }

  // Define the number of periods to filter
  const numberOfPeriods = 10;
  const periods = filterAndLabelByLastNPeriods(period, numberOfPeriods);

  // Initialize sales data
  const salesData = periods.map((p) => ({ x: p.label, y: 0 }));

  // Accumulate sales data for each period
  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    periods.forEach((p, index) => {
      if (
        itemDate >= p.startDate &&
        (!periods[index + 1] || itemDate < periods[index + 1].startDate)
      ) {
        const totalAmount = item.items.reduce((sum, curr) => {
          const unitPrice = parseFloat(curr.unitPrice) || 0;
          const quantity = parseFloat(curr.quantity) || 0;
          const discount = parseFloat(curr.discount) || 0;
          return sum + (unitPrice * quantity - discount);
        }, 0);
        salesData[index].y += totalAmount;
      }
    });
  });

  // Format the data for output
  const formattedData = [
    {
      id: "sales",
      color: "hsl(225, 70%, 50%)", // Example color, can be dynamic or changed as needed
      data: salesData,
    },
  ];

  // console.log(formattedData);

  return formattedData;
}

// Pie chart
export const calculateBillStatus = (bills) => {
  // Ensure that bills is an array
  if (!Array.isArray(bills)) {
    console.error("Input bills should be an array");
    return [];
  }

  // Filter the bills based on their status
  const paidBills = bills.filter(
    (bill) => bill.status && bill.status.toLowerCase() == "paid"
  );
  const dueBills = bills.filter(
    (bill) => bill.status && bill.status.toLowerCase() == "due"
  );
  const overdueBills = bills.filter(
    (bill) => bill.status && bill.status.toLowerCase() == "overdue"
  );

  // Calculate the total amount for each category
  const paidTotal = paidBills.reduce((sum, bill) => sum + (bill.total || 0), 0);
  const dueTotal = dueBills.reduce((sum, bill) => sum + (bill.total || 0), 0);
  const overdueTotal = overdueBills.reduce(
    (sum, bill) => sum + (bill.total || 0),
    0
  );

  // Log intermediate results for debugging
  // console.log("Paid Bills:", paidBills);
  // console.log("Due Bills:", dueBills);
  // console.log("Overdue Bills:", overdueBills);

  return [
    {
      id: "paid",
      label: "Paid",
      value: paidTotal.toFixed(0),
      color: "hsl(120, 70%, 50%)", // Green color for paid
    },
    {
      id: "due",
      label: "Due",
      value: dueTotal.toFixed(0),
      color: "hsl(60, 70%, 50%)", // Yellow color for due
    },
    {
      id: "overdue",
      label: "Overdue",
      value: overdueTotal.toFixed(0),
      color: "hsl(0, 70%, 50%)", // Red color for overdue
    },
  ];
};

// Bill issued

export function aggregateBills(period, invoices) {
  const result = {};
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Initialize result with zero values for continuous periods
  if (period === "daily") {
    const daysInMonth = currentDate.getDate(); // from the start of the month to today
    for (let i = 1; i <= daysInMonth; i++) {
      const key = `${i}-${currentMonth + 1}-${currentYear}`;
      result[key] = 0;
    }
  } else if (period === "monthly") {
    for (let i = 0; i <= currentMonth; i++) {
      const key = `${i + 1}-${currentYear}`;
      result[key] = 0;
    }
  } else if (period === "yearly") {
    for (let i = currentYear - 4; i <= currentYear; i++) {
      result[i] = 0;
    }
  }

  // Aggregate invoice data
  invoices.forEach((invoice) => {
    const date = new Date(invoice.createdAt);
    let key;

    if (
      period === "daily" &&
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth
    ) {
      key = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    } else if (period === "monthly" && date.getFullYear() === currentYear) {
      key = `${date.getMonth() + 1}-${date.getFullYear()}`;
    } else if (period === "yearly" && date.getFullYear() >= currentYear - 4) {
      key = `${date.getFullYear()}`;
    } else {
      return;
    }

    result[key] += 1;
  });

  // Return data with date only for daily aggregation
  if (period === "daily") {
    return Object.keys(result).map((key) => ({
      period: key.split("-")[0], // Extracting only the date
      "bill issued": result[key],
    }));
  } else {
    return Object.keys(result).map((key) => ({
      period: key,
      "bill issued": result[key],
    }));
  }
}

// #########################################################################
// #########################################################################
// ---------------Customer Profitability-----------------------------------
// #########################################################################
// #########################################################################

export const customerProfitability = (
  bills,
  customers,
  year = "All Time",
  month = "All Time",
  factor
) => {
  const profitability = {};

  console.log(bills, "Ccccccccccc");
  console.log(factor, "Ccccccccccc");

  // Loop through each invoice
  bills.forEach((bill) => {
    const customerName = bill.customer.name;

    // If the customer is not in the profitability object, add them
    if (!profitability[customerName]) {
      profitability[customerName] = {
        totalSales: 0,
        totalPayments: 0,
        outstandingBalance: 0,
        totalDue: 0,
      };
    }

    bills.forEach((bill) => {
      const billYear = new Date(bill.createdAt).getFullYear();
      const billMonth = new Date(bill.createdAt).getMonth();

      if (
        (year === "All Time" || billYear === parseInt(year)) &&
        (month === "All Time" || billMonth === parseInt(month))
      ) {
        // Add the total sales amount
        profitability[customerName].totalSales += bill.total;

        // Add the total due amount
        profitability[customerName].totalDue += bill.amtDue;

        // Loop through payment records to calculate total payments
        bill.paymentRecords.forEach((record) => {
          profitability[customerName].totalPayments += record.amountPaid || 0;
          console.log(record.amountPaid, "amount paid")
        });

        // Update outstanding balance
        profitability[customerName].outstandingBalance =
          bill.customer.outstandingBalance || 0;
      }
    });
  });

  // Convert the object into an array of objects
  const formattedData = Object.keys(profitability).map((customer) => {
    return {
      name: customer,
      totalRevenue: profitability[customer].totalSales.toFixed(0) || 0,
      totalPayment: profitability[customer].totalPayments.toFixed(0) || 0,
      outstandingBalance:
        profitability[customer].outstandingBalance.toFixed(0) || 0,
      totalDue: profitability[customer].totalDue.toFixed(0) || 0,
    };
  });

  // Sort the array by totalSales in descending order and take the top 7
  const topCustomers = formattedData.sort((a, b) => b[factor] - a[factor]);

  return topCustomers;
};

// #########################################################################
// #########################################################################
// ---------------Customer Profit-----------------------------------
// #########################################################################
// #########################################################################

export function calculateCustomerRevenueCostProfit(bills, products) {
  const productCosts = {};
  products.forEach((product) => {
    productCosts[product.name] = product.cost;
  });
  // console.log(productCosts);

  const customerData = {};

  bills.forEach((bill) => {
    const customerName = bill.customer.name;
    if (!customerData[customerName]) {
      customerData[customerName] = {
        customer: customerName,
        totalRevenue: 0,
        totalCost: 0,
        netProfit: 0,
      };
    }

    let billTotalRevenue = 0;
    let billTotalCost = 0;

    bill.items.forEach((item) => {
      const unitPrice = parseFloat(item.unitPrice);
      const quantity = parseFloat(item.quantity);
      const discount = parseFloat(item.discount);
      const itemRevenue = unitPrice * quantity - discount;
      const itemCost = (productCosts[item.itemName] || 0) * quantity;

      billTotalRevenue += itemRevenue;
      billTotalCost += itemCost;
    });

    const vat = parseFloat(bill.vat) || 0;
    const totalDiscount = parseFloat(bill.discount) || 0;

    const totalRevenue = billTotalRevenue + vat - totalDiscount;
    const totalCost = billTotalCost;
    const netProfit = totalRevenue - totalCost;

    customerData[customerName].totalRevenue += totalRevenue;
    customerData[customerName].totalCost += totalCost;
    customerData[customerName].netProfit += netProfit;
  });

  const topCustomers = Object.values(customerData)
    .sort((a, b) => b.netProfit - a.netProfit)
    .slice(0, 8);

  return topCustomers;
}

// #########################################################################
// #########################################################################
// ---------------Product Performance-----------------------------------
// #########################################################################
// #########################################################################

// export function calculateProductPerformance(bills, products) {
//   const productCosts = {};
//   products.forEach((product) => {
//     productCosts[product.name] = product.cost;
//   });

//   const productData = {};

//   bills.forEach((bill) => {
//     bill.items.forEach((item) => {
//       const itemName = item.itemName;
//       const unitPrice = parseFloat(item.unitPrice);
//       const quantity = parseFloat(item.quantity);
//       const discount = parseFloat(item.discount);
//       const itemRevenue = unitPrice * quantity - discount;
//       const itemCost = (productCosts[itemName] || 0) * quantity;

//       if (!productData[itemName]) {
//         productData[itemName] = {
//           product: itemName,
//           unitsSold: 0,
//           totalRevenue: 0,
//           totalCosts: 0,
//           netProfit: 0,
//         };
//       }

//       productData[itemName].unitsSold += quantity;
//       productData[itemName].totalRevenue += itemRevenue;
//       productData[itemName].totalCosts += itemCost;
//       productData[itemName].netProfit += itemRevenue - itemCost;
//     });
//   });

//   const topProduct = Object.values(productData).sort(
//     (a, b) => b.netProfit - a.netProfit
//   );

//   return topProduct;
// }

export function calculateProductPerformance(
  bills,
  products,
  year = "All Time",
  month = "All Time",
  factor
) {
  const productCosts = {};
  products.forEach((product) => {
    productCosts[product.name] = product.cost;
  });

  const productData = {};

  bills.forEach((bill) => {
    const billYear = new Date(bill.createdAt).getFullYear();
    const billMonth = new Date(bill.createdAt).getMonth() + 1;

    if (
      (year === "All Time" || billYear === parseInt(year)) &&
      (month === "All Time" || billMonth === parseInt(month))
    ) {
      bill.items.forEach((item) => {
        const itemName = item.itemName;
        const unitPrice = parseFloat(item.unitPrice);
        const quantity = parseFloat(item.quantity);
        const discount = parseFloat(item.discount);
        const itemRevenue = unitPrice * quantity - discount;
        const itemCost = (item.cost || 0) * quantity;

        if (!productData[itemName]) {
          productData[itemName] = {
            product: itemName,
            unitsSold: 0,
            totalRevenue: 0,
            totalCosts: 0,
            netProfit: 0,
            profitMargin: 0,
          };
        }

        productData[itemName].unitsSold += quantity;
        productData[itemName].totalRevenue += itemRevenue;
        productData[itemName].totalCosts += itemCost;
        productData[itemName].netProfit += itemRevenue - itemCost;
      });
    }
  });

  Object.values(productData).forEach((product) => {
    product.profitMargin = product.totalRevenue
      ? ((product.netProfit / product.totalRevenue) * 100).toFixed(2)
      : 0;
  });

  const topProduct = Object.values(productData).sort(
    (a, b) => b[factor] - a[factor]
  );

  return topProduct;
}

export function getMonthlyProductPerformance(products, bills, productId, year) {
  try {
    // Create an array of 12 months for the given year
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

    // Find the product name for the given productId
    const product = products.find((p) => p._id.toString() === productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
    const productName = product.name;

    // Initialize the performance data objects
    const performanceData = {
      totalRevenue: {
        id: productName,
        color: "hsl(197, 70%, 50%)",
        data: [],
      },
      totalCost: {
        id: "totalcost",
        color: "hsl(100, 70%, 50%)",
        data: [],
      },
      totalProfit: {
        id: "totalprofit",
        color: "hsl(50, 70%, 50%)",
        data: [],
      },
      unitsSold: {
        id: "unitsSold",
        color: "hsl(300, 70%, 50%)",
        data: [],
      },
    };

    // Iterate through each month and calculate the performance metrics
    for (let i = 0; i < months.length; i++) {
      const startDate = new Date(year, i, 1);
      const endDate = new Date(year, i + 1, 1);

      // Filter the billing items for the current month
      const billingItems = bills.filter(
        (bill) =>
          new Date(bill.createdAt) >= startDate &&
          new Date(bill.createdAt) < endDate &&
          bill.items.some((item) => item.itemName === productName)
      );

      let monthlyQuantity = 0;
      let monthlyRevenue = 0;
      let monthlyCost = 0;

      // Calculate the performance metrics for the current month
      billingItems.forEach((bill) => {
        bill.items.forEach((item) => {
          if (item.itemName === productName) {
            const quantity = parseInt(item.quantity, 10);
            const unitPrice = parseFloat(item.unitPrice);
            const discount = parseFloat(item.discount);

            monthlyQuantity += quantity;
            monthlyRevenue += quantity * unitPrice * (1 - discount / 100);
            monthlyCost += quantity * unitPrice * (1 - discount / 100); // Cost calculated from bills
          }
        });
      });

      const monthlyProfit = monthlyRevenue - monthlyCost;
      const monthName = startDate.toLocaleString("default", { month: "long" });

      // Push the performance metrics for the current month
      performanceData.totalRevenue.data.push({
        x: monthName,
        y: monthlyRevenue,
      });
      performanceData.totalCost.data.push({
        x: monthName,
        y: monthlyCost,
      });
      performanceData.totalProfit.data.push({
        x: monthName,
        y: monthlyProfit,
      });
      performanceData.unitsSold.data.push({
        x: monthName,
        y: monthlyQuantity,
      });
    }

    return [
      performanceData.totalRevenue,
      performanceData.totalCost,
      // performanceData.totalProfit,
      // performanceData.unitsSold,
    ];
  } catch (error) {
    console.error("Error getting monthly product performance:", error);
    throw error;
  }
}

// #####################################################################
// #####################################################################
// Generate only revenue
// #####################################################################
// #####################################################################
export function getProductTrend(products, bills, productIds, year, factor) {
  try {
    // Create an array of 12 months for the given year
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

    // Initialize an object to hold the data for each product
    const trendData = {};

    // Iterate through each product ID
    productIds.forEach((productId) => {
      // Find the product name for the given productId
      const product = products.find((p) => p._id.toString() === productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }
      const productName = product.name;

      // Initialize the data object for the product
      trendData[productName] = {
        id: productName,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        data: [],
      };

      // Iterate through each month and calculate the required value
      for (let i = 0; i < months.length; i++) {
        const startDate = new Date(year, i, 1);
        const endDate = new Date(year, i + 1, 1);

        // Filter the billing items for the current month
        const billingItems = bills.filter(
          (bill) =>
            new Date(bill.createdAt) >= startDate &&
            new Date(bill.createdAt) < endDate &&
            bill.items.some((item) => item.itemName === productName)
        );

        let monthlyValue = 0;
        let monthlyRevenue = 0;
        let monthlyCost = 0;

        // Calculate the required value for the current month
        billingItems.forEach((bill) => {
          bill.items.forEach((item) => {
            if (item.itemName === productName) {
              const quantity = parseInt(item.quantity, 10);
              const unitPrice = parseFloat(item.unitPrice);
              const discount = parseFloat(item.discount);
              const cost = parseFloat(item.cost);

              switch (factor) {
                case "totalRevenue":
                  monthlyValue += quantity * unitPrice * (1 - discount / 100);
                  break;
                case "totalCosts":
                  monthlyValue += quantity * cost;
                  break;
                case "netProfit":
                  monthlyValue +=
                    quantity * (unitPrice - cost) * (1 - discount / 100);
                  break;
                case "unitsSold":
                  monthlyValue += quantity;
                  break;
                case "profitMargin":
                  monthlyRevenue += quantity * unitPrice * (1 - discount / 100);
                  monthlyCost += quantity * cost;
                  break;
                default:
                  throw new Error(`Invalid factor: ${factor}`);
              }
            }
          });
        });

        if (factor === "profitMargin") {
          monthlyValue = monthlyRevenue
            ? ((monthlyRevenue - monthlyCost) / monthlyRevenue) * 100
            : 0;
        }

        const monthName = startDate.toLocaleString("default", {
          month: "long",
        });

        // Push the calculated data for the current month
        trendData[productName].data.push({
          x: monthName,
          y: monthlyValue,
        });
      }
    });

    console.log(trendData, "ccccccccccccccccccccccc")

    return Object.values(trendData);
  } catch (error) {
    console.error("Error getting product trend data:", error);
    throw error;
  }
}

export function compareProductTrends(
  products,
  bills,
  productId,
  years,
  factor
) {
  try {
    // Initialize an object to hold the data for the product across different years
    const trendData = [];

    // Find the product name for the given productId
    const product = products.find((p) => p._id.toString() === productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
    const productName = product.name;

    // Iterate through each year
    years.forEach((year) => {
      // Create an array of 12 months for the given year
      const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

      // Initialize the data object for the product for this year
      const yearData = {
        id: `${productName} (${year})`,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        data: [],
      };

      // Iterate through each month and calculate the required value
      for (let i = 0; i < months.length; i++) {
        const startDate = new Date(year, i, 1);
        const endDate = new Date(year, i + 1, 1);

        // Filter the billing items for the current month
        const billingItems = bills.filter(
          (bill) =>
            new Date(bill.createdAt) >= startDate &&
            new Date(bill.createdAt) < endDate &&
            bill.items.some((item) => item.itemName === productName)
        );

        let monthlyValue = 0;
        let monthlyRevenue = 0;
        let monthlyCost = 0;

        // Calculate the required value for the current month
        billingItems.forEach((bill) => {
          bill.items.forEach((item) => {
            if (item.itemName === productName) {
              const quantity = parseInt(item.quantity, 10);
              const unitPrice = parseFloat(item.unitPrice);
              const discount = parseFloat(item.discount);
              const cost = parseFloat(item.cost);

              switch (factor) {
                case "totalRevenue":
                  monthlyValue += quantity * unitPrice * (1 - discount / 100);
                  break;
                case "totalCosts":
                  monthlyValue += quantity * cost;
                  break;
                case "netProfit":
                  monthlyValue +=
                    quantity * (unitPrice - cost) * (1 - discount / 100);
                  break;
                case "unitsSold":
                  monthlyValue += quantity;
                  break;
                case "profitMargin":
                  monthlyRevenue += quantity * unitPrice * (1 - discount / 100);
                  monthlyCost += quantity * cost;
                  break;
                default:
                  throw new Error(`Invalid factor: ${factor}`);
              }
            }
          });
        });

        if (factor === "profitMargin") {
          monthlyValue = monthlyRevenue
            ? ((monthlyRevenue - monthlyCost) / monthlyRevenue) * 100
            : 0;
        }

        const monthName = startDate.toLocaleString("default", {
          month: "long",
        });

        // Push the calculated data for the current month
        yearData.data.push({
          x: monthName,
          y: monthlyValue,
        });
      }

      trendData.push(yearData);
    });

    return trendData;
  } catch (error) {
    console.error("Error comparing product trends:", error);
    throw error;
  }
}

export function formatDataForBarChart(data) {
  // Create an object to hold the final data format
  const formattedData = {};

  // Loop through each object in the input data
  for (const item of data) {
    // Loop through each data point in the 'data' array
    for (let i = 0; i < item.data.length; i++) {
      const dataPoint = item.data[i];
      const month = dataPoint.x;

      // If the month is not yet in the formattedData object, add it
      if (!formattedData[month]) {
        formattedData[month] = {
          month: month,
        };
      }

      // Add the value for the current year to the formattedData object
      formattedData[month][item.id] = dataPoint.y;
    }
  }

  // Convert the formattedData object to an array
  return Object.values(formattedData);
}

export function convertToPieChartData(data, colors, factor, key = "product") {
  let totalOther = 0;
  console.log(data, "inconverto");
  const result = data.slice(0, 7).map((item, index) => ({
    id: item[key],
    label: item[key],
    value: item[factor],
    color: colors[index] || colors[index % colors.length],
  }));

  for (let i = 7; i < data.length; i++) {
    totalOther += Number(data[i][factor]);
  }

  if (totalOther > 0) {
    result.push({
      id: "Other",
      label: "Other",
      value: totalOther,
      color: "#808080",
    });
  }

  return result;
}

export function getMetric(data, metric) {
  console.log(data, "metric");
  if (!data || data.length === 0) {
    return [];
  }

  // Get the first item from the data to determine the key name
  const firstItem = data[0];
  const keyName = Object.keys(firstItem).find((key) => key !== metric);

  if (!keyName) {
    throw new Error("Unable to determine key name");
  }

  return data.map((item) => {
    return { [keyName]: item[keyName], [metric]: item[metric] };
  });
}

export const sortArrayByColumn = (array, column) => {
  // console.log(array, "array");
  // console.log(column, "column");
  return array.sort((a, b) => {
    if (a[column] < b[column]) {
      return 1;
    }
    if (a[column] > b[column]) {
      return -1;
    }
    return 0;
  });
};

export function sortDataByTopLeast(data, topLeast, factor) {
  let result;
  // Check if the selected option is "Top" or "Least"
  if (topLeast === "Top") {
    // Sort the data array in descending order based on totalRevenue
    result = data.sort((a, b) => b[factor] - a[factor]);
  } else if (topLeast === "Least") {
    // Sort the data array in ascending order based on totalRevenue
    result = data.sort((a, b) => a[factor] - b[factor]);
  } else {
    // Handle invalid selection
    console.error("Invalid selection: Please choose 'Top' or 'Least'.");
    return data.slice(0, 5);
  }
  return result.slice(0, 7);
}

export function getProductTrendForMultipleYears(
  products,
  bills,
  productId,
  years,
  factor
) {
  try {
    // Initialize an array to hold the trend data for each year
    const trendData = [];

    // Find the product name for the given productId
    const product = products.find((p) => p._id.toString() === productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
    const productName = product.name;

    // Iterate through each year
    years.forEach((year) => {
      // Create an array of 12 months for the given year
      const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

      // Initialize the data object for the year
      const yearlyData = {
        id: year.toString(),
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        data: [],
      };

      // Iterate through each month and calculate the required value
      for (let i = 0; i < months.length; i++) {
        const startDate = new Date(year, i, 1);
        const endDate = new Date(year, i + 1, 1);

        // Filter the billing items for the current month
        const billingItems = bills.filter(
          (bill) =>
            new Date(bill.createdAt) >= startDate &&
            new Date(bill.createdAt) < endDate &&
            bill.items.some((item) => item.itemName === productName)
        );

        let monthlyValue = 0;
        let monthlyRevenue = 0;
        let monthlyCost = 0;

        // Calculate the required value for the current month
        billingItems.forEach((bill) => {
          bill.items.forEach((item) => {
            if (item.itemName === productName) {
              const quantity = parseInt(item.quantity, 10);
              const unitPrice = parseFloat(item.unitPrice);
              const discount = parseFloat(item.discount);
              const cost = parseFloat(item.cost);

              switch (factor) {
                case "totalRevenue":
                  monthlyValue += quantity * unitPrice * (1 - discount / 100);
                  break;
                case "totalCosts":
                  monthlyValue += quantity * cost;
                  break;
                case "netProfit":
                  monthlyValue +=
                    quantity * (unitPrice - cost) * (1 - discount / 100);
                  break;
                case "unitsSold":
                  monthlyValue += quantity;
                  break;
                case "profitMargin":
                  monthlyRevenue += quantity * unitPrice * (1 - discount / 100);
                  monthlyCost += quantity * cost;
                  break;
                default:
                  throw new Error(`Invalid factor: ${factor}`);
              }
            }
          });
        });

        if (factor === "profitMargin") {
          monthlyValue = monthlyRevenue
            ? ((monthlyRevenue - monthlyCost) / monthlyRevenue) * 100
            : 0;
        }

        const monthName = startDate.toLocaleString("default", {
          month: "long",
        });

        // Push the calculated data for the current month
        yearlyData.data.push({
          x: monthName,
          y: monthlyValue.toFixed(0),
        });
      }

      // Add the yearly data to the trend data array
      trendData.push(yearlyData);
    });

    return trendData;
  } catch (error) {
    console.error("Error getting product trend data:", error);
    throw error;
  }
}


export function getCustomerTrend(customers, bills, customerIds, year, factor) {
  try {
    // Create an array of 12 months for the given year
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

    // Initialize an object to hold the data for each customer
    const trendData = {};

    // Iterate through each customer ID
    customerIds.forEach((customerId) => {
      // Find the customer name for the given customerId
      const customer = customers.find((c) => c._id.toString() === customerId);
      if (!customer) {
        throw new Error(`Customer with ID ${customerId} not found.`);
      }
      const customerName = customer.name;

      // Initialize the data object for the customer
      if (!trendData[customerName]) {
        trendData[customerName] = {
          id: customerName,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
          data: Array.from({ length: 12 }, () => ({ x: '', y: 0 })),
        };
      }

      // Iterate through each month and calculate the required value
      for (let i = 0; i < months.length; i++) {
        const startDate = new Date(year, i, 1);
        const endDate = new Date(year, i + 1, 1);

        // Filter the billing items for the current month and current customer
        const billingItems = bills.filter(
          (bill) =>
            new Date(bill.createdAt) >= startDate &&
            new Date(bill.createdAt) < endDate &&
            bill.customer._id.toString() === customerId
        );

        let monthlyValue = 0;

        // Calculate the required value for the current month
        billingItems.forEach((bill) => {
          switch (factor) {
            case "totalRevenue":
              monthlyValue += bill.total;
              break;
            case "totalPayment":
              bill.paymentRecords.forEach((record) => {
                monthlyValue += record.amountPaid;
              });
              break;
            case "totalDue":
              monthlyValue += bill.amtDue;
              break;
            default:
              throw new Error(`Invalid factor: ${factor}`);
          }
        });

        const monthName = startDate.toLocaleString("default", {
          month: "long",
        });

        // Update the calculated data for the current month
        trendData[customerName].data[i] = {
          x: monthName,
          y: monthlyValue,
        };
      }
    });

    console.log(trendData, "Customer Trend Data");

    return Object.values(trendData);
  } catch (error) {
    console.error("Error getting customer trend data:", error);
    throw error;
  }
}


export function getCustomerTrendByYears(customers, bills, customerId, years, factor) {
  try {
    // Initialize an array to hold the trend data for the customer across multiple years
    const trendData = [];

    // Find the customer name for the given customerId
    const customer = customers.find((c) => c._id.toString() === customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }
    const customerName = customer.name;

    // Iterate through each year
    years.forEach((year) => {
      // Create an array of 12 months for the given year
      const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

      // Initialize an array to hold the monthly values for the current year
      const monthlyValues = [];

      // Iterate through each month and calculate the required value
      for (let i = 0; i < months.length; i++) {
        const startDate = new Date(year, i, 1);
        const endDate = new Date(year, i + 1, 1);

        // Filter the billing items for the current month
        const billingItems = bills.filter(
          (bill) =>
            new Date(bill.createdAt) >= startDate &&
            new Date(bill.createdAt) < endDate &&
            bill.customer._id.toString() === customerId
        );

        let monthlyValue = 0;

        // Calculate the required value for the current month
        billingItems.forEach((bill) => {
          switch (factor) {
            case "totalRevenue":
              monthlyValue += bill.total;
              break;
            case "totalPayment":
              bill.paymentRecords.forEach((record) => {
                monthlyValue += record.amountPaid;
              });
              break;
            case "totalDue":
              monthlyValue += bill.amtDue;
              break;
            default:
              throw new Error(`Invalid factor: ${factor}`);
          }
        });

        const monthName = startDate.toLocaleString("default", {
          month: "long",
        });

        // Push the calculated data for the current month
        monthlyValues.push({
          x: monthName,
          y: monthlyValue,
        });
      }

      // Add the yearly data to the trendData array
      trendData.push({
        id: year,
        customerName: customerName,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        data: monthlyValues,
      });
    });

    console.log(trendData, "Customer Trend Data");

    return trendData;
  } catch (error) {
    console.error("Error getting customer trend data:", error);
    throw error;
  }
}
