import { useEffect, useState } from 'react';
import withAuth from '../hooks/withAuth';
import InputField from '../components/InputField';
import InputLabel from '../components/InputLabel';
import Button from '../components/Button';
import LiveSearch from '../components/LiveSearch';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from "../redux/customer/customerActions";
import { getProduct } from "../redux/product/productActions";
import { getInvoiceNumber } from '../redux/invoiceNumber/invoiceNumberActions';
import { validateFormData } from '../components/ValidationData';
import { addBill, latestId } from '../redux/bill/billActions';
import { Toast, onClose, showToast } from '../components/Toast';
import { updateInvNumber } from '../redux/invoiceNumber/invoiceNumberActions';




const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    client: { id: '', name: '', phone: '' },
    invoiceNumber: '', // You might initialize this with a generated number
    items: [{ itemName: '', unitPrice: '', quantity: '', cost: '', discount: '', itemTotal: '' }],
    notes: '',
    subTotal: '',
    disRate: '',
    disAmt: '',
    total: '',
    amountPaid: '0',
    amountDue: '',
    dueDate: '',
    paidBy: '',
    status: "",
  });




  const [errors, setErrors] = useState({
    clientName: '',
    clientPhone: '',
    item: Array.from({ length: formData.items.length }, () => ''),
  });
  const [isDue, setIsDue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()



  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const { customers, loading: customersLoading } = useSelector(state => state.customers);
  const { products, loading: productsLoading } = useSelector(state => state.products);
  // const lastBillId = useSelector(state => state.bills.latestId)
  formData.invoiceNumber = useSelector(state => state.invoiceNumber).invoiceNumber;

  useEffect(() => {
    // Set loading to true when fetching data
    setIsLoading(true);
    dispatch(getCustomers());
    dispatch(getInvoiceNumber());
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    // Set loading to false when data fetching is complete
    if (!customersLoading && !productsLoading) {
      setIsLoading(false);
    }
  }, [customersLoading, productsLoading]);

  useEffect(() => {
    // Reset all errors
    setErrors({
      clientName: '',
      clientPhone: '',
      item: Array.from({ length: formData.items.length }, () => ''),
    });

  }, [formData])

  // useEffect(() => {
  //   dispatch(latestId())
  //     .then(() => setIsLoading(false))
  //     .catch(() => setIsLoading(false));
  // }, [isLoading]);



  const customerData = customers
  console.log("print", customerData)
  console.log("product", products)

  // Function to set due date one week ahead on component mount
  useEffect(() => {
    if (!isDue) {
      // Set dueDate to blank if isDue is true
      setFormData(prevState => ({ ...prevState, dueDate: '' }));
    } else {
      // Calculate due date 7 days ahead if isDue is false
      const currentDate = new Date();
      const dueDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Add one week
      const formattedDueDate = dueDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
      setFormData(prevState => ({ ...prevState, dueDate: formattedDueDate }));
    }
  }, [isDue]);

  // const customerData = [
  //   { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  //   { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
  //   // Add more customer objects as needed
  // ];



  const handleInputChange = (e, index, field) => {
    const { name, value } = e.target;
    if (isNaN(value) || value < 0) {
      showToast("Please enter a positive number.", setToast, true);
      return;
    }
    if (field === 'name') {
      setFormData({ ...formData, client: { ...formData.client, [name]: value } });
      return
    }
    if (field === 'items') {
      // Handle changes for items
      const updatedItems = [...formData.items];

      updatedItems[index][name] = value;

      // Calculate item total
      let itemTotal = (parseFloat(updatedItems[index].unitPrice) * parseFloat(updatedItems[index].quantity)) * (1 - (parseFloat(updatedItems[index].discount) / 100));

      // Set itemTotal to 0 if it's blank or NaN
      if (!itemTotal || isNaN(itemTotal)) {
        itemTotal = 0;
      }

      updatedItems[index].itemTotal = parseFloat(itemTotal).toFixed(2);
      setFormData({ ...formData, items: updatedItems });

      // Recalculate fields
      recalculateFields(updatedItems);
    } else if (name === 'disRate') {
      // Handle changes for taxRate or disRate
      const subTotal = formData.subTotal;
      const newDisRate = name === 'disRate' ? value || 0 : formData.disRate || 0;
      const disAmt = ((subTotal) * (newDisRate / 100)).toFixed(2);
      const total = (subTotal - parseFloat(disAmt)).toFixed(2);
      const amountDue = (total - parseFloat(formData.amountPaid)).toFixed(2);
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        disAmt,
        total,
        amountDue
      }));
    } else if (name === 'amountPaid') {
      // Handle changes for amountPaid
      const amountPaid = parseFloat(value) || 0;
      const total = parseFloat(formData.total) || 0;
      let amountDue = (total - amountPaid).toFixed(2);
      setFormData(prevState => ({
        ...prevState,
        amountPaid,
        amountDue,
        notes: "Thank You!"
      }));
    } else {
      // Handle other fields
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    const amountDue = formData.amountDue;
    if (amountDue <= 0) {
      setFormData(prevState => ({
        ...prevState,
        amountDue: 0,
      }));
      setIsDue(false);
    } else {
      setFormData(prevState => ({
        ...prevState,
        amountDue
      }));
      setIsDue(true);
    }
  }, [formData.amountDue])





  // Function to add a new item
  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { itemName: '', unitPrice: '', quantity: '', cost: "", discount: '', itemTotal: '' }] });
  };

  // Function to delete an item
  const deleteItem = (index) => {
    const updatedItems = [...formData.items];

    // Check if there is only one item left
    if (updatedItems.length === 1) {
      // Reset the values of the single item
      updatedItems[index] = { itemName: '', unitPrice: '', quantity: '', cost: "", discount: '', itemTotal: '' };
      console.log("delete one")
    } else {
      // Remove the item at the specified index
      updatedItems.splice(index, 1);
      console.log("delete more", updatedItems)
    }

    // Update the form data with the updated items
    setFormData({ ...formData, items: updatedItems });

    // Recalculate fields based on the updated items
    recalculateFields(updatedItems);
  };


  // Function to recalculate all fields
  const recalculateFields = (updatedItems) => {
    // Calculate subTotal
    const subTotal = updatedItems.reduce((acc, curr) => acc + parseFloat(curr.itemTotal || 0), 0);
    console.log(subTotal)

    // Get tax rate and discount rate, defaulting to 0 if not provided
    const disRate = parseFloat(formData.disRate) || 0;

    // Calculate discount amount
    const disAmt = ((subTotal) * (disRate / 100)).toFixed(2);

    // Calculate total
    const total = (subTotal - parseFloat(disAmt || 0)).toFixed(2);

    // Check if formData.amountPaid is empty, if so, set it to 0
    const amountPaid = formData.amountPaid !== "" ? parseFloat(formData.amountPaid) : 0;

    // Calculate amount due
    const amountDue = (total - amountPaid).toFixed(2);


    // Update form data with recalculated fields
    setFormData({ ...formData, items: updatedItems, subTotal, disAmt, total, amountPaid, amountDue });
  };

  // Function to reset the form fields
  const resetForm = () => {
    setFormData({
      client: { id: '', name: '', phone: '' },
      invoiceNumber: '', // You might initialize this with a generated number
      items: [{ itemName: '', unitPrice: '', quantity: '', cost: "", discount: '', itemTotal: '' }],
      notes: '',
      subTotal: '',
      disRate: '',
      disAmt: '',
      total: '',
      amountPaid: '',
      amountDue: '',
      dueDate: '',
      paidBy: '',
      status: "",
    });
    dispatch(getInvoiceNumber())
  };

  const validateFormDetails = () => {
    let isValid = true;

    // Validate client details
    const matchedCustomer = customers.find(customer =>
      customer.name === formData.client.name && customer.phone === formData.client.phone
    );
    if (!matchedCustomer) {
      setErrors(prevErrors => ({
        ...prevErrors,
        clientName: 'Customer not found in database',
        clientPhone: 'Customer not found in database',
      }));
      isValid = false;
    }

    // Validate each item in formData.items
    formData.items.forEach((item, index) => {
      const matchedProduct = products.find(product => product.name === item.itemName);
      if (!matchedProduct) {
        setErrors(prevErrors => ({
          ...prevErrors,
          item: {
            ...prevErrors.item,
            [index]: 'Product not found in database',
          }
        }));
        isValid = false;
      }
    });

    return isValid;
  };


  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
    const { isValid, updatedFormData, errors } = validateFormData(formData);

    if (isValid) {
      // Proceed with form submission
      console.log('Form data is valid:', updatedFormData);

      if (!validateFormDetails) {
        showToast("Error Input !", setToast);
        return;
      }

      try {
        // Add code to handle form submission, e.g., sending data to backend
        const data = await dispatch(addBill(updatedFormData))

        console.log(data.billing._id, "new bill");

        await dispatch(updateInvNumber(formData.invoiceNumber));
        console.log('Invoice Number in form:', formData.invoiceNumber);
        showToast("Bill Created Successfully !", setToast);
        resetForm();
        navigate(`/bill/${data.billing._id}`);

      } catch (error) {
        console.error('Error submitting form:', error);
        setIsLoading(false);
        showToast("Error Creating Bill !", setToast, true);
      }
    } else {
      // Form data is not valid, set errors
      setErrors(errors);
      showToast("Error Creating Bill !", setToast, true);
      setIsLoading(false);
    }
  };



  return (
    <div className="p-4 pt-0 grow flex flex-col bg-gray-50 overflow-y-scroll max-h-[calc(100vh-3.5rem-3rem)]">
      <div className="w-full border-b-2  border-gray-800 flex justify-between py-2 items-center sticky top-0 bg-white z-40">
        <h1 className="font-bold text-lg text-gray-900 mt-auto">Create Bill</h1>
        <Link className='font-medium py-2 px-4  text-sm text-blue-600 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100' to={`/bill/record`}>Bill Record</Link>
      </div>
      {/* Render toast if showToast is true */}
      {toast.show && <Toast message={toast.message} isError={toast.isError} onClose={() => onClose(setToast)} />}
      <form onSubmit={handleSubmit} className="relative w-full space-y-4 p-6">


        <div className='flex justify-between gap-6'>
          <div className='flex flex-col'>
            <div className='space-x-2 flex items-baseline'>
              <InputLabel htmlFor="clientName" text="Customer Name:" className='whitespace-nowrap' />
              <LiveSearch
                value={formData.client.name}
                setFormData={setFormData}
                searchFor="name"
                name="name"
                className="w-64"
                results={customerData}
              />
            </div>
            {errors.clientName && <div className="text-red-500 text-xs w-full text-center">{errors.clientName}</div>}
            {/* <InputField type="text" id="clientName" name="name" value={formData.client.name} onChange={(e) => handleInputChange(e, null, 'client')} /> */}
          </div>
          <div>
            <div className='space-x-2 flex items-baseline'>
              <InputLabel htmlFor="clientPhone" text="Customer Phone:" className='whitespace-nowrap' />
              {/* <InputField type="text" id="clientPhone" name="phone" value={formData.client.phone} onChange={(e) => handleInputChange(e, null, 'client')} /> */}
              <LiveSearch
                value={formData.client.phone}
                setFormData={setFormData}
                searchFor="phone"
                name="phone"
                className="w-full"
                results={customerData}
              />
            </div>
            {errors.clientPhone && <div className="text-red-500 text-xs w-full text-center">{errors.clientPhone}</div>}
          </div>
          <div className='space-x-2 flex items-baseline'>
            <InputLabel htmlFor="invoiceNumber" text="Bill Number:" className='whitespace-nowrap' />
            <InputField type="text" id="invoiceNumber" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleInputChange} disabled />
          </div>
        </div>
        <div>
          <div className='w-full flex-grow '>
            <div className='w-full flex justify-between gap-2 mb-2'>
              <div className='w-[30%] text-sm font-medium text-gray-900'>Item Name</div>
              <div className='w-[15%] text-sm font-medium text-gray-900'>Unit Price</div>
              <div className='w-[15%] text-sm font-medium text-gray-900'>Quantity</div>
              <div className='w-[15%] text-sm font-medium text-gray-900'>Discount</div>
              <div className='w-[15%] text-sm font-medium text-gray-900'>Item Total</div>
              <div className='w-[10%] text-sm font-medium text-gray-900'></div>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className='pb-4'>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-[30%]'>
                    <LiveSearch
                      type="text"
                      id={`itemName${index}`}
                      name="itemName"
                      value={item.itemName}
                      setFormData={setFormData}
                      searchFor="name"
                      results={products}
                      className='w-full border-0 border-b-2 rounded-none focus:border-b-gray-500 outline-0'
                      index={index}
                    />
                    {/* <InputField
                    type="text"
                    id={`itemName${index}`}
                    name="itemName"
                    value={item.itemName}
                    className='w-full border-0 border-b-2 rounded-none focus:border-b-gray-500 outline-0'
                    onChange={(e) => handleInputChange(e, index, 'items')}
                  /> */}
                  </div>
                  <div className='w-[15%]'>
                    <InputField
                      type="text"
                      id={`unitPrice${index}`}
                      name="unitPrice"
                      value={item.unitPrice}
                      className='w-full'
                      onChange={(e) => handleInputChange(e, index, 'items')}
                      disabled
                    />
                  </div>
                  <div className='w-[15%] hidden'>
                    <InputField
                      type="text"
                      id={`cost${index}`}
                      name="cost"
                      value={item.cost}
                      className='w-full'
                      onChange={(e) => handleInputChange(e, index, 'items')}
                    // disabled
                    />
                  </div>
                  <div className='w-[15%]'>
                    <InputField
                      type="number"
                      id={`quantity${index}`}
                      name="quantity"
                      value={item.quantity}
                      className='w-full'
                      onChange={(e) => handleInputChange(e, index, 'items')}
                      min="0"
                    />
                  </div>
                  <div className='w-[15%]'>
                    <InputField
                      type="number"
                      id={`discount${index}`}
                      name="discount"
                      value={item.discount}
                      className='w-[80%] inline-block'
                      onChange={(e) => handleInputChange(e, index, 'items')}
                      min="0"

                    />
                    <p className='w-[18%] inline-block text-gray-900 bg-gray-100 text-sm border-b-2 border-gray-300 p-1.5'>%</p>
                  </div>
                  <div className='w-[15%]'>
                    <InputField
                      type="number"
                      id={`itemTotal${index}`}
                      name="itemTotal"
                      value={item.itemTotal}
                      className='w-full'
                      onChange={(e) => handleInputChange(e, index, 'items')}
                      disabled
                    />
                  </div>
                  <div className='w-[10%] flex justify-center'>
                    <Button type="button" className='bg-red-700 hover:bg-red-800' onClick={() => deleteItem(index)} text="Delete" />
                  </div>
                </div>
                {errors.item[index] && <div className='text-red-500 text-xs w-full text-center'>{errors.item[index]}</div>}
              </div>
            ))}
          </div>
          <Button type="button" text="+ Add Item" onClick={addItem} className='block ml-auto' />
        </div>
        <div className='flex w-full '>
          <div className='flex justify-between flex-col'>
            <div>
              <InputLabel htmlFor="notes" text="Notes :" className='block' />
              <InputField type='textarea' id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={5} cols={80} />
            </div>
            <div className='w-full flex flex-col'>
              {!isDue && (formData.total - formData.amountPaid) < 0 &&
                <p className="text-green-500 pb-2 ml-auto text-sm">No amount due. Return amount :<span className='font-medium'> Rs. {Math.floor(Math.abs(formData.total - formData.amountPaid))} </span> </p>}
              <Button type="submit" text={isLoading ? "Loading . . ." : "Create Bill"} className={`ml-auto w-40 whitespace-nowrap ${isLoading ? "bg-blue-800/80 pointer-events-none" : ""}`} disabled={isLoading} />
            </div>
          </div>
          <div className='flex flex-grow flex-col items-end gap-2'>
            <div className='space-x-2'>
              <InputLabel htmlFor="subTotal" text="Subtotal :" />
              <InputField type="number" id="subTotal" name="subTotal" value={formData.subTotal} className='text-end pr-2' onChange={handleInputChange} disabled />
            </div>
            {/* <div className='space-x-2 flex justify-end'>
              <div className='space-x-2 flex items-baseline'>
                <InputLabel htmlFor="taxRate" text="Tax Rate :" />
                <div>
                  <InputField type="string" id="taxRate" name="taxRate" value={formData.taxRate} className='text-end pr-2 w-10' placeholder="0" onChange={handleInputChange} />
                  <p className='inline-block text-gray-900 bg-gray-100 text-sm border-b-2 border-gray-300 p-1.5'>%</p>
                </div>
              </div>
              <div className='space-x-2'>
                <InputLabel htmlFor="taxAmt" text="Tax Amount :" />
                <InputField type="number" id="taxAmt" name="taxAmt" className='text-end pr-2 w-24' value={formData.taxAmt} onChange={handleInputChange} disabled />
              </div>
            </div> */}
            <div className='space-x-2 flex justify-end'>
              <div className='space-x-2 flex items-baseline'>
                <InputLabel htmlFor="disRate" text="Dis Rate :" />
                <div>
                  <InputField type="string" id="disRate" name="disRate" value={formData.disRate} className='text-end pr-2 w-10' placeholder="0" onChange={handleInputChange} min="0" />
                  <p className='inline-block text-gray-900 bg-gray-100 text-sm border-b-2 border-gray-300 p-1.5'>%</p>
                </div>
              </div>
              <div className='space-x-2'>
                <InputLabel htmlFor="disAmt" text="Dis Amount :" />
                <InputField type="number" id="disAmt" name="disAmt" className='text-end pr-2 w-24' value={formData.disAmt} onChange={handleInputChange} disabled />
              </div>
            </div>
            <div className='space-x-2'>
              <InputLabel htmlFor="total" text="Total :" />
              <InputField type="number" id="total" name="total" value={formData.total} className='text-end pr-2' disabled />
            </div>
            <div className='space-x-2'>
              <InputLabel htmlFor="amountPaid" text="Amount Paid :" />
              <InputField type="number" id="amountPaid" name="amountPaid" value={formData.amountPaid} className='text-end pr-2' onChange={(e) => handleInputChange(e, null, 'paymentRecords')} min="0" />
            </div>
            <div className='space-x-2'>
              <InputLabel htmlFor="amountDue" text="Amount Due :" />
              <InputField type="number" id="amountDue" name="amountDue" className='text-end pr-2 text-red-600' value={formData.amountDue} disabled />
            </div>
            <div className='space-x-2'>
              <InputLabel htmlFor="dueDate" text="Due Date :" />
              <InputField type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleInputChange} />
            </div>
            <div className='space-x-2'>
              <InputLabel htmlFor="paidBy" text="Paid By :" />
              <InputField type="text" id="paidBy" name="paidBy" value={formData.paidBy} className='text-end pr-2' onChange={(e) => handleInputChange(e, null, 'paymentRecords')} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withAuth(InvoiceForm);
