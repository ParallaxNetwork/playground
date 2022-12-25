import Image from "next/image";

const CollectionImage = ({ src, className }) => {
  return (
    <div className={`relative ring-2 ring-black ${className}`}>
      <Image alt="collectionimage" src={src} fill placeholder="blur" blurDataURL={src}></Image>
    </div>
  );
};

export default CollectionImage;
