const LayoutContainer = ({ children, className }) => {
  return (
    <div className={`px-[20px] md:px-[80px] xxl:px-[400px] py-[20px] mb-10 ${className}`}>
      {children}
    </div>
  );
};

export const LayoutTop = ({ children }) => {
  return (
    <div className="flex flex-col w-full px-[20px] md:px-[80px] xxl:px-[400px] pt-[10px] bg-white">
      {children}
    </div>
  );
};

export default LayoutContainer;
