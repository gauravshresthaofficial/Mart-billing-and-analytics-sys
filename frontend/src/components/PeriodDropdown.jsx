import { getLabelForFactor } from "./Report/SalesReport";

// YearDropdown.js
const PeriodDropdown = ({ selectedPeriod, onSelectPeriod, datas, text, className = "", product=false }) => {
    console.log(datas)

    const handleChange = (e) => {
        onSelectPeriod((e.target.value));
    };


    return (
        <select value={selectedPeriod || ''} onChange={handleChange} className={`p-2 border rounded text-sm ${className}`}>
            {/* <option value="">{text}</option> */}
            {datas.map(data => (
                <option key={product? data.value : data} value={product? data.value : data} className='cursor-pointer p-2 hover:bg-blue-50 hover:text-gray-800 rounded-md text-sm'>
                    <p className='p-4 text-sm'>
                        {product? data.label : getLabelForFactor(data)}
                    </p>
                </option>
            ))}
        </select>
    );
};

export default PeriodDropdown;