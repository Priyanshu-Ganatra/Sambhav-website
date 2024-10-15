// components/ProjectLogoUpload.js
import Image from "next/image";

const ProjectLogoUpload = ({ logoUrl, handleLogoChange }) => {
  return (
    <div className="dark-theme flex flex-col justify-center items-center gap-5 p-5 px-10 border className= h-full w-full">
      <Image
        src={logoUrl}
        alt="Project Logo"
        width={150}
        height={150}
        quality={100}
        className="rounded-md mb-4 h-[150px] w-auto object-contain"
        unoptimized
      />
      <label
        htmlFor="logo"
        className="text-sm mb-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
          <path d="M13.5 6.5l4 4" />
        </svg>
        Change Logo
      </label>
      <input
        type="file"
        id="logo"
        name="logo"
        accept=".jpg, .jpeg, .png, .webp, .gif"
        onChange={handleLogoChange}
        className="mt-1 px-4 hidden py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
};

export default ProjectLogoUpload;
