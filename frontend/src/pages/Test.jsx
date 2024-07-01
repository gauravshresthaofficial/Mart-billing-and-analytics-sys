import React, { useState, useEffect } from 'react';
import withAuth from "../hooks/withAuth";
import { useSelector, useDispatch } from 'react-redux';
import { getProduct, addProduct } from '../redux/product/productActions';
import { getInvoiceNumber, updateInvNumber } from '../redux/invoiceNumber/invoiceNumberActions'
import InputLabel from '../components/InputLabel';
import InputField from '../components/InputField';
import Button from '../components/Button'
import { ProductAnalysis } from './ProductAnalysis';

const Test = ({ username, Logout }) => {
  const { products } = useSelector(state => state.products);
  const { invoiceNumber } = useSelector(state => state.invoiceNumber)
  const dispatch = useDispatch();
  const [tab, setTab] = useState("default")

  useEffect(() => {
    // Fetch initial products when component mounts
    dispatch(getProduct());
    dispatch(getInvoiceNumber())
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });

  const [filteredProductNames, setFilteredProductNames] = useState([]);
  const { name, price, description } = formData;

  let debounceTimer;

  const handleProductNameChange = e => {
    const { value } = e.target;
    setFormData({ ...formData, [e.target.name]: value });

    // Debounce API call
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      dispatch(getProduct()); // Trigger API call after debounce time
    }, 2000); // Wait for 2 seconds before making the API call

    // Filter product names based on user input
    const filteredNames = products.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase())
    ).map(product => product.name);
    setFilteredProductNames(filteredNames);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addProduct(formData)); // Wait for addProduct action to complete
    dispatch(getProduct());
    // Clear form fields after submission
    setFormData({
      name: '',
      price: '',
      description: '',
    });

    console.log("form submitted")
  };

  const increaseInvoiceNumber = async () => {
    // Parse the numeric part of the invoice number
    const currentNumber = parseInt(invoiceNumber.split('-')[1]);

    // Increment the numeric part by 1
    const newNumber = currentNumber + 1;

    // Create the new invoice number by concatenating the prefix "INV-" with the incremented number
    const newInvoiceNumber = `INV-${newNumber}`;

    await dispatch(updateInvNumber(newInvoiceNumber))
    // console.log(data)

    // Now newInvoiceNumber contains the increased invoice number
    console.log(newInvoiceNumber); // Output: INV-1006 (if the current invoice number is INV-1005)
  };

  return (<>
    <Button onClick={() => { setTab("default") }} text="Default" />
    <Button onClick={() => { setTab("product") }} text="Product" />
    {tab == "default" &&
      <div className="invoice_page">
        <h4>
          Hello <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
        {/* <p onClick={onTabChange("product")}>product</p> */}

        {/* Product form */}
        {/* <form onSubmit={onSubmit}>
        <div className='w-1/3'>
          <label>Name:</label>
          <div className='inline w-fit'>
            <InputField
              type="text"
              placeholder="Product Name"
              name="name"
              value={name}
              onChange={handleProductNameChange}
              required
            />
            <ul className='relative border left-0'>
              {filteredProductNames.map((productName, index) => (
                <li key={index}>{productName}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            placeholder="Product Price"
            name="price"
            value={price}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            placeholder="Product Description"
            name="description"
            value={description}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form> */}

        {/* Display products */}
        <ul>
          {products.map(product => (
            <li key={product._id}>{product.name} - ${product.price}</li> // Assign a unique key prop
          ))}
        </ul>

        <div className='w-full bg-red-400 h-10'></div>
        <div>
          <p>{invoiceNumber}</p>
          <Button text="Increase Invoice Number" onClick={increaseInvoiceNumber} />
        </div>
      </div>
    }
    {tab == "product" &&
      <ProductAnalysis />
    }
  </>
  );
};

export default Test;
