import './App.css'
import { Routes, Route, Navigate, } from 'react-router-dom'
import { Login, Signup, Home, InvoiceForm } from './pages'

import Test from './pages/Test'
import useAuth from './hooks/withAuth'
import withAuth from './hooks/withAuth'
import Header from './components/Header'
import ProtectedRoute from './components/functions/Protected'
import MainLayout from './pages/MainLayout'
import Product from './pages/Product'
import Customer from './pages/Customer'
import Report from './pages/Report'
import InvoiceRecord from './pages/InvoiceRecord'
import { InvoiceList } from './pages/InvoiceList'
import { ProductAnalysis } from './pages/ProductAnalysis'
import CustomerAnalysis from './pages/CustomerAnalysis'
import Profile from './pages/Profile'
// import InvoiceFormUpdate from './pages/InvoiceFormUpdate'

function App() {

  // const username = useAuth();
  // console.log(username)




  return (
    <>
      {/* {username && <Header />} */}
      <Routes>
        {/* <Route path="/" element={<Home />}/> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/invoice" element={<InvoiceForm />} /> */}

        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="bill" element={<InvoiceForm />} />
          {/* <Route path="invoice/edit/:invoiceId" element={<InvoiceFormUpdate />} /> */}
          <Route path="product" element={<Product />} />
          <Route path="customer" element={<Customer />} />
          <Route path="bill/record" element={<InvoiceList />} />
          <Route path="bill/:invoiceId" element={<InvoiceRecord />} />
          <Route path="analysis" element={<Report />} />
          <Route path="analysis/product" element={<ProductAnalysis />} />
          <Route path="analysis/customer" element={<CustomerAnalysis />} />
          <Route path='profile' element={<Profile />} />
          {/* <Route path="report/product" element={<ProductAnalysis />} /> */}
          {/* Add more routes here */}
        </Route>
        {/* <ProtectedRoute path="test/">
          <Test />
        </ProtectedRoute> */}
        <Route
          path="/test"
          element={<Test />}

        />
      </Routes>
    </>
  )
}

export default App
