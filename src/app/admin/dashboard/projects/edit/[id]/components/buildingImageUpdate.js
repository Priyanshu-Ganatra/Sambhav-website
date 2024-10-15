// components/ProjectbuildingImageUpload.js
import Image from 'next/image';

const ProjectBldgImageUpload = ({ buildingImageUrl, handleBuildingImageChange }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-5 p-5 px-10 border className= dark-theme h-full w-full'>
      <Image
        src={buildingImageUrl}
        alt="Project buildingImage"
        width={150}
        height={150}
        quality={100}
        className="rounded-md mb-4 h-[150px] w-auto object-contain "
      />
      <label htmlFor="buildingImage" className="text-sm mb-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pencil">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
          <path d="M13.5 6.5l4 4" />
        </svg>
        Change Building Image
      </label>
      <input
        type="file"
        id="buildingImage"
        name="buildingImage"
        accept=".jpg, .jpeg, .png, .webp, .gif"
        onChange={handleBuildingImageChange}
        className="mt-1 px-4 hidden py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
};

export default ProjectBldgImageUpload;
