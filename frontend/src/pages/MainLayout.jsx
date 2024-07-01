import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import withAuth from '../hooks/withAuth';

const MainLayout = () => {

    return (
        <div className="w-full h-screen flex flex-col bg-gray-400 font-Poppins">
            <Header />
            <div className="flex-grow flex">
                <Sidebar />
               
                <div className="grow flex flex-col max-h-[calc(100vh-3.5rem-3rem)] overflow-hidden">
                    <Outlet />
                </div>
            </div>
            {/* footer */}
            <div className="h-12 w-full bg-slate-800 text-white flex justify-center items-center px-5 text-sm">
                <p>Copyright@2024</p>
            </div>
        </div>
    );
};

export default withAuth(MainLayout);
