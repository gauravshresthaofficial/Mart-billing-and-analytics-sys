import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getBillRecord, updateBill } from '../redux/bill/billActions';// Adjust the import path as necessary
import Button from '../components/Button';
// import { usePDF } from 'react-to-pdf';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import InputLabel from '../components/InputLabel';
import InputField from '../components/InputField';

const InvoiceRecord = () => {
  const { invoiceId } = useParams();
  const [showPopup, setShowPopup] = useState(false)
  const [showToast, setShowToast] = useState({ message: "", isError: false });



  const dispatch = useDispatch();
  // const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

  // Fetch invoice record from Redux store
  const invoice = useSelector(state =>
    state.bills.billRecord
  );
  console.log(invoice)

  // Get today's date in ISO format
  const today = new Date().toISOString();

  const [formData, setFormData] = useState({
    "total": "",
    "amtDue": "",
    "amountPaid": "",
    "paidBy": "",

  })

  const [errors, setErrors] = useState({
    amountPaid: '',
  });

  // Fetch invoice record on component mount
  useEffect(() => {
    dispatch(getBillRecord(invoiceId));
  }, [dispatch]);

  useEffect(() => {
    if (invoice) {
      setFormData(() => ({
        ['total']: invoice.total,
        ['amtDue']: invoice.amtDue,
        ["paidBy"]: invoice.customer.name,
      }));
    }
  }, [invoiceId, invoice])

  // Handle loading state
  if (!invoice) {
    return <div className='w-full h-full flex justify-center items-center bg-white'>
      <svg aria-hidden="true" className="w-8 h-8 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
    </div>;
  }

  // Calculate total amount paid
  const totalAmountPaid = invoice.paymentRecords.reduce((total, record) => total + record.amountPaid, 0);


  function formatDate(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function formatDateTime(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hours to 12-hour format
    hours = String(hours).padStart(2, '0'); // Ensure hours is always two digits

    return `${year}-${month}-${day} ${hours}:${minutes} ${amPm}`;
  }

  function ItemsTable(items, discount) {
    // Calculate total quantity, subtotal, and grand total
    let totalQuantity = 0;
    let grandTotal = 0;

    items.forEach(item => {
      totalQuantity += parseInt(item.quantity);
      grandTotal += ((item.unitPrice * item.quantity) * (100 - item.discount) / 100);
    });

    grandTotal = grandTotal - discount

    return (
      <div className="relative overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 w-80">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Unit
              </th>
              <th scope="col" className="px-6 py-3">
                Rate
              </th>
              <th scope="col" className="px-6 py-3">
                Discount
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id} className="bg-white border-b">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-80">
                  {item.itemName}
                </th>
                <td className="px-6 py-4">
                  {item.quantity}
                </td>
                <td className="px-6 py-4">
                  {item.unitPrice}
                </td>
                <td className="px-6 py-4">
                  {item.discount}
                </td>
                <td className="px-6 py-4">
                  Rs. {(item.unitPrice * item.quantity) * (100 - item.discount) / 100}
                </td>
              </tr>
            ))}

            {/* <tr>
              <td colSpan={4} className='px-6 py-2 font-bold text-right'>Vat:</td>
              <td className='px-6 py-2 font-bold'>{invoice.vat}</td>
            </tr> */}
            <tr>
              <td colSpan={4} className='px-6 py-2 font-bold text-right'>Discount:</td>
              <td className='px-6 py-2 font-bold'>{invoice.discount}</td>
            </tr>
            {/* Additional row for total quantity, subtotal, and grand total */}
            <tr className="bg-gray-50 border-b">
              <td className="px-6 font-bold text-right"> Total Units:</td>
              <td className="px-6 font-bold"> {totalQuantity}</td>
              <td colSpan={2} className="px-6  py-2 font-bold text-lg text-right">Grand Total:</td>
              <td className="px-6 font-bold text-lg"> Rs. {grandTotal}</td>
            </tr>
            {console.log((grandTotal - totalAmountPaid))}

            {(grandTotal - totalAmountPaid) > 0 &&
              <>
                <tr className="border-b">
                  <td colSpan={4} className='px-6 py-2 text-end font-bold'>Paid:</td>
                  <td className='px-6 py-2 font-bold'>Rs. {totalAmountPaid}</td>
                </tr>
                <tr className="bg-gray-50 border-b">
                  <td colSpan={4} className='px-6 py-2 text-end text-red-600 font-bold'>Due Amount:</td>
                  <td className='px-6 py-2 font-bold text-red-600 text-lg'>Rs. {grandTotal - totalAmountPaid}</td>
                </tr>
              </>
            }
          </tbody>
        </table>
      </div>
    );
  }

  const options = {
    // default is `save`
    method: 'open',
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.HIGH,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      // default is 'A4'
      format: 'letter',
      // default is 'portrait'
      orientation: 'landscape',
    },
  };

  // you can use a function to return the target element besides using React refs
  const getTargetElement = () => document.getElementById('content-id');

  const togglePaymentPopup = () => {
    setShowPopup(!showPopup);
    console.log(showPopup)
  }

  // Function to display toast message
  const displayToast = (message, isError = false) => {
    console.log("-------------------------------------")
    setShowToast({ message: message, isError: isError });
    // Hide toast message after 3 seconds
    setTimeout(() => {
      hideToast()
    }, 3000);
  };

  // Function to hide toast message
  const hideToast = () => {
    setShowToast({ message: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      if (formData.amountPaid > formData.amtDue) {
        setErrors({
          amountPaid: "Amount Received exceed the Amount Due."
        })
        return;
      }
      else {
        formData.newAmtDue = (formData.amtDue - formData.amountPaid)
        if (formData.newAmtDue == 0) {
          formData.status = "Paid";
          formData.dueDate = "";
        }
      }



      const data = {
        "status": formData.status ? formData.status : invoice.status,
        "dueDate": formData.dueDate ? formData.dueDate : invoice.dueDate,
        "amtDue": formData.newAmtDue,
        "paymentRecords": [
          {
            "amountPaid": formData.amountPaid,
            "datePaid": today,
            "paidBy": formData.paidBy,
          }
        ]
      }

      console.log(data)
      await dispatch(updateBill(invoiceId, data))
      displayToast("Added Successfully", false);
      setFormData({
        amountPaid: ""
      })
    } catch (error) {
      console.error('Error:', error.message);
      displayToast('Error occurred. Please try again.', true);
    }
    setShowPopup(false);
  }


  // Display invoice details
  return (
    <div className='w-full flex-grow flex flex-col bg-gray-50 p-4 gap-4 text-sm overflow-y-scroll max-h-[calc(100vh-3.5rem-3rem)]' >
      <div className='flex justify-between items-center pl-2'>
        <h1 className="font-bold text-lg text-gray-900">Bill: {invoice.invoiceNumber}</h1>
        <div className='flex gap-4 flex-grow justify-end'>
          <Link className='bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg ml-auto block' to={`/bill`}>Create Bill</Link>
          <Link className=' font-medium py-2 px-4  text-sm text-blue-600 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100' to={`/bill/record`}>Bill Record</Link>
          {invoice.amtDue > 0 && <Button type="Button" text="Pay" onClick={togglePaymentPopup} />}
          <Button type="button" className='border-2 bg-white text-gray-900 shadow-sm hover:bg-gray-100' text="Print" onClick={() => generatePDF(getTargetElement, options)} />
        </div>
      </div>

      {showPopup &&
        <div className='fixed inset-0 flex items-center justify-center z-10'>
          <section className="backdrop-blur-sm bg-slate-500/20 w-full h-full bg-red" onClick={togglePaymentPopup}></section>
          <div className="absolute w-full bg-white rounded-lg shadow md:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className='flex items-center justify-between'>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Pay Due Amount
                </h1>
                <p onClick={togglePaymentPopup} className='font-semibold bg-gray-100 px-4 py-2 hover:border rounded-lg border border-white hover:border-gray-900 hover:font-bold hover:bg-red-700 hover:text-white'>X</p>
              </div>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <InputLabel htmlFor="total" className="block" text="Total Amount" />
                  <InputField
                    type="text"
                    name="total"
                    id="total"
                    value={formData.total}
                    className="block w-full p-2.5 font-bold"
                    disabled
                  />
                </div>
                <div>
                  <InputLabel htmlFor="amtDue" className="block" text="Due Amount" />
                  <InputField
                    type="number"
                    name="amtDue"
                    id="amtDue"
                    value={formData.amtDue}
                    // onChange={handleChange}
                    className={`block w-full p-2.5 font-semibold ${invoice.amtDue <= 0 ? "" : "text-red-600 "}`}
                    // placeholder="Enter your Unit Price"
                    disabled
                  />
                </div>
                <div>
                  <InputLabel htmlFor="amountPaid" className="block" text="Amount Received" />
                  <InputField
                    type="text"
                    name="amountPaid"
                    id="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    className="block w-full p-2.5"
                    placeholder="Amount Received"
                    required
                  />
                  {errors.amountPaid && <div className="text-red-500 text-xs w-full text-center">{errors.amountPaid}</div>}
                </div>
                <div className=''>
                  <InputLabel htmlFor="paidBy" text="Paid By :" className='block' />
                  <InputField type="text" id="paidBy" name="paidBy" value={formData.paidBy} onChange={handleChange} className='block w-full p-2.5' />
                </div>

                <Button type="submit" text="Update" className="w-full" />
              </form>
            </div>
          </div>
        </div>}

      <div id="content-id" className='flex-grow h-full flex flex-col gap-4 rounded-lg border p-4 shadow-md bg-white'>
        <div className='flex flex-col items-center gap-1'>
          <h1 className='text-xl font-semibold '>Bill</h1>
          <h1 className='text-2xl font-bold '>Inayab Mart</h1>
          <p className='text-sm'>Bojepokhari, Imadol, Lalitpur</p>
        </div>

        <div className='flex'>
          <div className='flex flex-col w-full gap-1.5'>
            <p>Bill No: {invoice.invoiceNumber}</p>
            <p>Date: {formatDateTime(invoice.createdAt)}</p>
            <p>Customer Name: {invoice.customer.name}</p>
          </div>
          <div className='w-1/2 flex flex-col items-end justify-end gap-1.5'>
            PAN No: 615418777
            {invoice.dueDate && <p>Due Date: {formatDate(invoice.dueDate)}</p>}
            <p className='ml-auto'>Payment Status:
              <span className={`min-w-20 rounded-md text-center text-xs font-bold p-2 ml-2 inline-block 
              ${invoice.status.toLowerCase() === 'paid' ? 'bg-green-400 text-gray-900' :
                  invoice.status.toLowerCase() === 'partial payment' ? 'bg-yellow-400 text-gray-900' :
                    'bg-red-400 text-gray-200'
                }`}>
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        <div>
          {ItemsTable(invoice.items, invoice.discount)}
        </div>

        <div className='flex flex-col w-full gap-4'>
          <p className='ml-auto'>
            Cashier: {invoice.creator.length > 0 ? invoice.creator[invoice.creator.length - 1] : "Admin"}
          </p>

          <p className='mx-auto'><span className='font-bold mr-2'>Note:</span>{invoice.notes ? invoice.notes : "Thank You for your visit !"}</p>
        </div>

        <div className='border-t pt-4 text-center'>
          <p>If you have any question please contact : inayabmart@gmail.com</p>
        </div>
      </div>
      {showToast.message && (
        <div id="toast-success" className={`animate-fade animate-duration-[300ms] animate-delay-50 animate-ease-in absolute bottom-12 left-[60%] transform -translate-x-1/2 h-fit flex items-center w-full max-w-xs p-4 mb-4 text-white ${showToast.message == "Deleted Successfully" ? "bg-red-500" : "bg-green-500"} rounded-lg shadow`} role="">
          <div className="ms-3 text-sm font-normal">{showToast.message}</div>
          <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-success" aria-label="Close" onClick={hideToast}>
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceRecord;
