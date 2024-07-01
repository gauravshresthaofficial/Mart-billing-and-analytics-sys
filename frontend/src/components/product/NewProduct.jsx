import { useState, useEffect } from 'react';
import Button from '../Button';
import InputField from '../InputField';
import InputLabel from '../InputLabel';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../../redux/product/productActions';

const NewProduct = ({ handleClose, isUpdate = false, data, displayToast, hideToast }) => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        cost: '',
        description: ''
    });

    useEffect(() => {
        // If it's an update and product is provided
        if (isUpdate && data) {
            // Extract only the required fields from the product object
            const { name, price, cost, description } = data;

            // Update the form data with the extracted fields
            setFormData({ name, price, cost, description });
        }
    }, [isUpdate, data]);

    // Handle form input changes
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isUpdate) {
                await dispatch(addProduct(formData));
                displayToast("Added Successfully", false); // Show added success toast
            } else {
                await dispatch(updateProduct(data._id, formData));
                displayToast("Updated Successfully", false); // Show updated success toast
            }
            // Clear form fields after submission
            setFormData({
                name: '',
                price: '',
                cost: '',
                description: ''
            });
            // Close the modal or navigate back to the product list page
            handleClose();
        } catch (error) {
            // Handle errors here
            console.error('Error:', error.message);
            // Display error message in toast
            displayToast('Error occurred. Please try again.', true);
            // Auto-close toast after 3000 milliseconds (3 seconds)
            setTimeout(() => {
                hideToast()
            }, 3000);
        }
    };




    return (
        <div className='fixed inset-0 flex items-center justify-center z-10'>
            <section className="backdrop-blur-sm bg-slate-500/20 w-full h-full bg-red" onClick={handleClose}></section>
            <div className="absolute w-full bg-white rounded-lg shadow md:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className='flex items-center justify-between'>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            {isUpdate ? 'Update Product' : 'Add New Product'}
                        </h1>
                        <p onClick={handleClose} className='font-semibold bg-gray-100 px-4 py-2 hover:border rounded-lg border border-white hover:border-gray-900 hover:font-bold hover:bg-red-700 hover:text-white'>X</p>
                    </div>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <InputLabel htmlFor="name" className="block" text="Product Name" />
                            <InputField
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full p-2.5"
                                placeholder="Enter your Product Name"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="price" className="block" text="Selling Price" />
                            <InputField
                                type="number"
                                name="price"
                                id="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="block w-full p-2.5"
                                placeholder="Enter your Unit Price"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="cost" className="block" text="Cost Price" />
                            <InputField
                                type="number"
                                name="cost"
                                id="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                className="block w-full p-2.5"
                                placeholder="Enter your Unit Price"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" className="block" text="Description" />
                            <InputField
                                type="text"
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full p-2.5"
                                placeholder="Product Description"
                                required
                            />
                        </div>

                        <Button type="submit" text={isUpdate ? 'Update Product' : 'Add Product'} className="w-full" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewProduct;
