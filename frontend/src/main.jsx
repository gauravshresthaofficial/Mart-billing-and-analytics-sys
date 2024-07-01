// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store.js'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
)



// import { useAuth } from './useAuth'

// const AuthenticatedApp = () => {
//   const isAuthenticated = useAuth()

//   return (
//     <BrowserRouter>
//       <App isAuthenticated={isAuthenticated} />
//     </BrowserRouter>
//   )
// }

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <AuthenticatedApp />
//   </React.StrictMode>
// )