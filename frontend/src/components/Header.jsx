import { useState, useEffect } from 'react';

const Header = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Function to update time and date every minute
        const updateTime = () => {
            const now = new Date();
            const timeOptions = { hour: '2-digit', minute: '2-digit'}; // Format options for hours and minutes
            setCurrentTime(now.toLocaleTimeString([], timeOptions)); // Use options to display only hours and minutes
            setCurrentDate(now.toDateString());
        };

        // Update time immediately and then every minute
        updateTime();
        const intervalId = setInterval(updateTime, 1000); // Update every minute (60000 milliseconds)

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bg-[#1E1E1E] h-14 grid grid-cols-12 px-6 text-center border-b shadow-lg">
            <div className="col-span-10 flex items-center h-full">
                <p className="text-[#F1F5F9] font-bold">Mart Billing and Analytics System</p>
            </div>
            <div className="col-span-2 flex flex-col items-end justify-center">
                <div className="text-[#F1F5F9] font-bold flex flex-col items-end">
                    <p className="inline-block">{currentTime}</p>
                    {/* <p className="inline-block text-xs font-thin w-3">:</p> */}
                    <p className="inline-block text-xs">{currentDate}</p>
                </div>
                {/* <p className="text-[#F1F5F9] font-semibold text-xs">{currentDate}</p> */}
            </div>
        </div>
    );
};

export default Header;
