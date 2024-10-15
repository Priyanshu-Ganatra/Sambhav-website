import Image from "next/image";

// components/ProjectImage.js
const ProjectImage = ({ image, handleDeleteImage }) => {
    return (
      <div className='relative border' key={image.id}>
        <Image src={image.imageUrl} quality={100} height={200} width={200} className='object-contain w-full' />
        <Image src='/icons/trash_red.svg' quality={100} height={25} width={25} className='absolute bottom-0 right-0 m-2 bg-slate-50 opacity-[0.8] p-1 rounded' onClick={e => { handleDeleteImage(`${image.id}`) }} />
      </div>
    );
  };
  
  export default ProjectImage;
  