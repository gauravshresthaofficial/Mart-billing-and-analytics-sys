import { twMerge } from 'tailwind-merge';


const Button = ({ onClick, text, className = '', ...props }) => {
  const buttonClassName = twMerge(
    'bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg',
    className
  );

  return (
    <button onClick={onClick} className={buttonClassName} {...props}>
      {text}
    </button>
  );
};

export default Button;
