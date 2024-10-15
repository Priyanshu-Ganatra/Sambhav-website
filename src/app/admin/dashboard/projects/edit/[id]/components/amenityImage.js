import Image from "next/image";

const AmenityImage = ({
  handleAmenityImageChange,
  images,
  handleDeleteAmenityImage,
}) => {
  return (
    <>
      <div className="">
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700 mt-4 mb-2"
        >
          Add Amenity icon Images (Up to 6 at once):
        </label>
        <input
          type="file"
          id="images"
          name="images"
          className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
          accept=".jpg, .jpeg, .png, .webp, .gif"
          onChange={handleAmenityImageChange}
          multiple
        />
      </div>
      <div className="grid grid-cols-6 items-center justify-center gap-10 my-10 dark-theme p-5">
        {images &&
          images.map((image, index) => (
            <div className="relative " key={image.id}>
              <Image
                quality={100}
                src={image.amenityUrl}
                height={150}
                width={150}
                className="object-contain w-full aspect-square"
              />
              <Image
                src="/icons/trash_red.svg"
                height={25}
                width={25}
                className="absolute bottom-0 right-0 m-2 bg-slate-50  p-1 rounded"
                onClick={(e) => {
                  handleDeleteAmenityImage(`${image.id}`);
                }}
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default AmenityImage;
