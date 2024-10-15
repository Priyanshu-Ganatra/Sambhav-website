// components/ImageUpload.js
const ImageUpload = ({ handleImageChange }) => {
    return (
      <div>
        <label htmlFor="images" className="block text-lg font-semibold text-gray-700 mt-4 mb-2">
          Add banner Images:
        </label>
        <input
          type="file"
          id="images"
          name="images"
          accept=".jpg, .jpeg, .png, .webp, .gif"
          className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
          onChange={handleImageChange}
          multiple
        />
      </div>
    );
  };
  
  export default ImageUpload;
  