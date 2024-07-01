export const Toast = ({ message, isError = false, onClose }) => {
    return (
        <div className={`animate-fade animate-duration-[300ms] animate-delay-50 animate-ease-in absolute bottom-10 left-1/2 transform h-fit flex items-center w-full max-w-xs p-4 mb-4 text-white ${isError ? "bg-red-500" : "bg-green-500"} rounded-lg shadow z-20`}>
            <div className="ms-3 text-sm font-normal">{message}</div>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-success" aria-label="Close" onClick={onClose}>
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>

    );
};

export const showToast = (message, setToast, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
        setToast(prevState => ({ ...prevState, show: false }));
    }, 3000);
};

export const onClose = (setToast) => {
    setToast({ show: false, message: "", isError: false })
}