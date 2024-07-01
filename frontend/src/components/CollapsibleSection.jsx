import React, { useState } from 'react';

const CollapsibleSection = ({ title, children, option, className = "", visibility = false }) => {
    const [isVisible, setIsVisible] = useState(visibility);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className={`max-h-[90vh] border shadow-md rounded-lg p-2 ${className}`}>
            <div className='flex justify-between items-center'>
                <p className="font-semibold text-gray-900 pl-4">{title}</p>
                <button
                    className={`border px-4 py-1 rounded cursor-pointer hover:bg-blue-200 ${isVisible ? 'rotate-180' : ''}`}
                    onClick={toggleVisibility}
                >
                    v
                </button>
            </div>
            {isVisible && (<>
                <div className='flex gap-4 pt-2 justify-end'>
                    {option && option}
                </div>
                <div className='mt-4 bg-gray-50'>
                    {children}
                </div>
            </>
            )}
        </div>
    );
};

export default CollapsibleSection;
