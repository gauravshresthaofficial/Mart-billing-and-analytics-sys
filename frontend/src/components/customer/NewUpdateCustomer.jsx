import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../Button';
import InputField from '../InputField';
import InputLabel from '../InputLabel';
import { addCustomer, updateCustomer } from '../../redux/customer/customerActions';


const NewUpdateCustomer = ({ handleClose, isUpdate = false, data, displayToast, hideToast }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        creditLimit: '',
        outstandingBalance:'0',
        address: { country: '', province: '', district: '', street: '' }
    });

    useEffect(() => {
        if (isUpdate && data) {
            const { name, email, phone, creditLimit, address } = data;
            setFormData({ name, email, phone, creditLimit, address: { ...address } });
        }
    }, [isUpdate, data]);

    const handleChange = e => {
        setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const handleAddressChange = e => {
        setFormData(prevState => ({
            ...prevState,
            address: { ...prevState.address, [e.target.name]: e.target.value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isUpdate) {
                await dispatch(addCustomer(formData));
                displayToast("Added Successfully", false);
            } else {
                await dispatch(updateCustomer(data._id, formData));
                displayToast("Updated Successfully", false);
            }
            setFormData({
                name: '',
                email: '',
                phone: '',
                creditLimit: '',
                address: { country: '', province: '', district: '', street: '' }
            });
            handleClose();
        } catch (error) {
            console.error('Error:', error.message);
            displayToast('Error occurred. Please try again.', true);
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
                            {isUpdate ? 'Update Customer' : 'Add New Customer'}
                        </h1>
                        <p onClick={handleClose} className='font-semibold bg-gray-100 px-4 py-2 hover:border rounded-lg border border-white hover:border-gray-900 hover:font-bold hover:bg-red-700 hover:text-white'>X</p>
                    </div>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <InputLabel htmlFor="name" className="block" text="Customer Name" />
                            <InputField
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full p-2.5"
                                placeholder="Customer Name"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" className="block" text="Email" />
                            <InputField
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full p-2.5"
                                placeholder="example@gmail.com"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" className="block" text="Phone Number" />
                            <InputField
                                type="text"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="block w-full p-2.5"
                                placeholder="98xxxxxxxx"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="creditLimit" className="block" text="Credit Limit" />
                            <InputField
                                type="number"
                                name="creditLimit"
                                id="creditLimit"
                                value={formData.creditLimit}
                                onChange={handleChange}
                                className="block w-full p-2.5"
                                placeholder="Credit Limit"
                                required
                            />
                        </div>
                        <div className='flex'>
                            <div>
                                <InputLabel htmlFor="country" className="block" text="Country" />
                                <InputField
                                    type="text"
                                    name="country"
                                    id="country"
                                    value={formData.address.country}
                                    onChange={handleAddressChange}
                                    className="block w-full p-2.5"
                                    placeholder="Country"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="province" className="block" text="Province" />
                                <InputField
                                    type="text"
                                    name="province"
                                    id="province"
                                    value={formData.address.province}
                                    onChange={handleAddressChange}
                                    className="block w-full p-2.5"
                                    placeholder="Province"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="district" className="block" text="District" />
                                <InputField
                                    type="text"
                                    name="district"
                                    id="district"
                                    value={formData.address.district}
                                    onChange={handleAddressChange}
                                    className="block w-full p-2.5"
                                    placeholder="District"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="street" className="block" text="Street" />
                                <InputField
                                    type="text"
                                    name="street"
                                    id="street"
                                    value={formData.address.street}
                                    onChange={handleAddressChange}
                                    className="block w-full p-2.5"
                                    placeholder="Street"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" text={isUpdate ? 'Update Customer' : 'Add Customer'} className="w-full" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewUpdateCustomer;
