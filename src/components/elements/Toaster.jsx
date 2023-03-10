import toast, { Toaster } from "react-hot-toast";

export const ShowToast = ({ message = "...", state = "random", duration = 3000, id }) => {
  const icon = ["👏", "❤️", "✨"];
  return toast.custom(
    <div className="shadowBox bg-white max-w-[300px] lg:max-w-[400px] p-3 text-center">
      {state == "error"
        ? `❌ ${message}`
        : `${icon[Math.floor(Math.random() * 3) + 0]} ${message}`}
    </div>,
    { duration, id }
  );
};
