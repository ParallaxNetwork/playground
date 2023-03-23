// import Image from "next/image";
const CollectionImage = ({ src, className, noBorder=false }) => {
  return (
    <div className={`relative ${!noBorder && "ring-2 ring-black"} ${className}`}>
      <img
        alt="collectionimage"
        className="w-full h-full"
        src={src}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = "/assets/picture/placeholder.png";
        }}
      />
    </div>
  );
};

export default CollectionImage;
