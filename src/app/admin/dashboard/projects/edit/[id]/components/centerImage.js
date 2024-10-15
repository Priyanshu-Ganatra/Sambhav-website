// components/ProjectcenterImageUpload.js
import Image from 'next/image';

export default function CenterImageUpload({ imageUrl, imageChange, imageDelete }) {
    return (
        <div className='flex flex-col justify-center items-center gap-5 p-5 px-10 border className= dark-theme w-full'>
            {imageUrl && (
                <>
                    <Image
                        src={imageUrl}
                        alt="Project centerImage"
                        width={150}
                        height={150}
                        quality={100}
                        className="rounded-md mb-4 h-[150px] w-auto object-contain"
                    />
                </>
            )}
            <div className='flex gap-2 '>
                <label htmlFor="centerImage" className="text-sm mb-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pencil">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                        <path d="M13.5 6.5l4 4" />
                    </svg>

                    Center Image
                </label>
                <input
                    type="file"
                    id="centerImage"
                    name="centerImage"
                    onChange={imageChange}
                    accept=".jpg, .jpeg, .png, .webp, .gif"
                    className="mt-1 px-4 hidden py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                />
                {imageUrl && (
                    <button className='text-sm mb-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex gap-1' onClick={imageDelete}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 7l16 0" /><path d="M10 11l0 6" />
                            <path d="M14 11l0 6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};