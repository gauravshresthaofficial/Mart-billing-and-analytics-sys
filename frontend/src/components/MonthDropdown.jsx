// MonthDropdown.js
import React from 'react';

const MonthDropdown = ({ selectedMonth, onSelectMonth }) => {
    const months = [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' },
    ];

    const handleMonthChange = (e) => {
        onSelectMonth(Number(e.target.value));
    };

    return (
        <select value={selectedMonth || ''} onChange={handleMonthChange} className="p-2 border rounded text-sm">
            <option value="">Select Month</option>
            {months.map(month => (
                <option key={month.value} value={month.value}>{month.name}</option>
            ))}
        </select>
    );
};

export default MonthDropdown;