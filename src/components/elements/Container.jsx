const LayoutContainer = ({ children, className }) => {
  return (
    <div className={`px-[20px] md:px-[80px] xxl:px-[250px] py-[20px] mb-10`}>
      {children}
    </div>
  );
};

export const LayoutTop = ({ children }) => {
  return (
    <div className="flex flex-col w-full px-[20px] md:px-[80px] xxl:px-[250px] pt-[20px] ">
      {children}
    </div>
  );
};

export default LayoutContainer;
