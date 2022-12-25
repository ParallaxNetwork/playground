const LayoutContainer = ({ children }) => {
  return (
    <div className="px-[20px] md:px-[45px] xxl:px-[150px] py-[20px] mb-10">
      {children}
    </div>
  );
};

export const LayoutTop = ({ children }) => {
  return (
    <div className="flex flex-col w-full px-[20px] md:px-[45px] xxl:px-[150px] pt-[20px] ">
      {children}
    </div>
  );
};

export default LayoutContainer;
