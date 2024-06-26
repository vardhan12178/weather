const Footer = () => {
    const text = "Developed by Bala Vardhan | Powered by React © 2024";
    return (
      <footer className="w-full py-2 mt-5 text-xs font-serif bg-gradient-to-r from-blue-800 to-purple-800 dark:from-gray-700 dark:to-gray-600 text-white dark:text-gray-200 text-center shadow-lg">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block font-medium animate-fadeIn"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </footer>
    );
  };
  
  export default Footer;
  