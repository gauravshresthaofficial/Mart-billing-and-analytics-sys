export function calculateCustomersPerformance(
    bills,
    customers,
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
  