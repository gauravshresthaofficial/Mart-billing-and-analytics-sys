// YearDropdown.js
import React from 'react';

const YearDropdown = ({ selectedYear, onSelectYear }) => {
    const years = [2024, 2023, 2022, 2021]; // Example years

    const handleYearChange = (e) => {
        onSelectYear(Number(e.target.value));
    };

    return (
        <select value={selectedYear || ''} onChange={handleYearChange} className="p-2 border rounded text-sm">
            <option value="">Select Year</option>
            {years.map(year => (
                <option key={year} value={year} className='cursor-pointer p-4 hover:bg-blue-50 hover:text-gray-800 rounded-md'>
                    <p className='p-4'>
                        {year}
                    </p>
                </option>
            ))}
        </select>
    );
};

export default YearDropdown;