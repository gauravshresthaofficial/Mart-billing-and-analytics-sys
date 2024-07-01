import React, { useState, useCallback, useEffect } from "react";
import InputField from "./InputField"; // Assuming InputField is a custom component

const LiveSearch = ({
    results,
    renderItem,
    value="",
    placeholder = "Search...",
    setFormData,
    searchFor,
    name,
    index,
    className,
    ...props
}) => {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [showResults, setShowResults] = useState(false);
    const [defaultValue, setDefaultValue] = useState("");
    const [filteredResults, setFilteredResults] = useState(results);

    const handleSelection = (selectedItem) => {
        setDefaultValue(selectedItem[name]);
        if (name === "name" || name === "phone") {
            setFormData(prevData => ({
                ...prevData,
                client: {
                    ...prevData.client,
                    id: selectedItem._id,
                    name: selectedItem.name,
                    phone: selectedItem.phone
                }, 
                paidBy: selectedItem.name
            }));

        } else {
            setFormData(prevData => ({
                ...prevData,
                items: prevData.items.map((item, idx) => {
                    if (idx === index) {
                        return {
                            ...item,
                            itemName: selectedItem.name,
                            unitPrice: selectedItem.price,
                            cost: selectedItem.cost,
                            discount: selectedItem.discount || 0 // Set discount to zero if selectedItem.discount is falsy
                        };
                    }
                    return item;
                })
            }));
        }

        setShowResults(false);
    };

    const resetSearchComplete = useCallback(() => {
        setFocusedIndex(-1);
        setShowResults(false);
    }, []);

    const handleKeyDown = (e) => {
        const { key } = e;
        let nextIndexCount = 0;

        if (key === "ArrowDown") nextIndexCount = (focusedIndex + 1) % filteredResults.length;
        if (key === "ArrowUp") nextIndexCount = (focusedIndex + filteredResults.length - 1) % filteredResults.length;
        if (key === "Escape") resetSearchComplete();
        if (key === "Enter") {
            e.preventDefault();
            handleSelection(filteredResults[focusedIndex]);
        }

        setFocusedIndex(nextIndexCount);
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setDefaultValue(value);

        // Filter results based on input value
        const filteredResults = results.filter((item) =>
            item[searchFor].toLowerCase().includes(value.toLowerCase())
        );
        setFilteredResults(filteredResults);
        setShowResults(true); // Always show results when there's input
        setFocusedIndex(-1);
    };

    useEffect(() => {
        if (focusedIndex !== -1) {
            const element = document.getElementById(`result_${focusedIndex}`);
            if (element) {
                element.scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                });
            }
        }
    }, [focusedIndex]);

    useEffect(() => {
        setDefaultValue(value);
    }, [value]);

    return (
        <div className="relative w-full">
            <InputField
                value={defaultValue}
                name={name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="text"
                className={className}
                placeholder={placeholder}
                onFocus={() => {
                    const filteredResults = results.filter((item) =>
                        item[searchFor].toLowerCase().includes(defaultValue.toLowerCase())
                    );
                    setFilteredResults(filteredResults);
                    setShowResults(true);
                }}
                onBlur={() => setShowResults(false)}
                {...props}
            />

            {showResults && (
                <div className="absolute z-10 mt-1 w-full p-2 bg-white shadow-lg rounded-bl rounded-br max-h-56 overflow-y-auto">
                    {filteredResults.length === 0 ? (
                        <p className="p-2 text-gray-500 text-sm">No records found</p>
                    ) : (
                        filteredResults.map((item, index) => (
                            <div
                                key={index}
                                id={`result_${index}`}
                                className={`cursor-pointer p-2 hover:bg-blue-50 hover:text-gray-800 rounded-md ${index === focusedIndex ? "bg-gray-100" : ""}`}
                                onMouseDown={() => handleSelection(item)}
                            >
                                <p className="text-sm">{item[searchFor]}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default LiveSearch;
