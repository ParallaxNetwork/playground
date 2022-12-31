// import Image from "next/image";

// const CollectionImage = ({ src, className }) => {
//   return (
//     <div className={`relative ring-2 ring-black ${className}`}>
//       <Image alt="collectionimage" src={src} fill placeholder="blur" blurDataURL={src}></Image>
//     </div>
//   );
// };

const CollectionImage = ({ src, className }) => {
  return (
    <div className={`relative ring-2 ring-black ${className}`}>
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
