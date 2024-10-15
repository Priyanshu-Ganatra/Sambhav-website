import Image from "next/image";
import { Petemoss } from "next/font/google";
const petemoss = Petemoss({
  weight: "400",
  subsets: ["latin"],
});

export default function ProjectDetails({ projectData }) {
  return (
    <>
      <div className="py-20 flex flex-col items-start">
        <div className="flex items-center justify-center">
          <Image
            src={projectData.logoUrl}
            width={150}
            height={150}
            quality={100}
            alt={projectData.name}
          />
        </div>
        {projectData.tagLine && (
          <div
            className={`max-page-width w-full text-center text-5xl mt-2 ${petemoss.className} flex gap-8 justify-center items-center`}
          >
            {/* <span className="h-[1px] w-[190px] border-b-[1px] rounded-sm"></span> */}
            {/* <h2>
                            {projectData.tagLine}
                        </h2> */}
            {/* <span className="h-[1px] w-[190px] border-b-[1px] rounded-sm"></span> */}
          </div>
        )}
        {projectData.shortDescription && (
          <div
            className="max-page-width w-full text-left mt-10 md:pr-[300px]"
            dangerouslySetInnerHTML={{ __html: projectData.shortDescription }}
          />
        )}
      </div>

      <div className="grid grid-cols-3 justify-between items-center gap-2 dark-theme py-10 sm:px-20 md:px-0 text-center max-w-[500px]">
        <div className="flex flex-col gap-2 items-start">
          {/* <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-building-skyscraper"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 21l18 0" /><path d="M5 21v-14l8 -4v18" /><path d="M19 21v-10l-6 -4" /><path d="M9 9l0 .01" /><path d="M9 12l0 .01" /><path d="M9 15l0 .01" /><path d="M9 18l0 .01" /></svg>
                    </div> */}
          <p className="font-bold">TYPE</p>
          <p>{projectData.type}</p>
        </div>
        <div className="flex flex-col gap-2 items-start">
          {/* <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-award"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" /><path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889" /><path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" /></svg>
                    </div> */}
          <p className="font-bold">STATUS</p>
          <p>{projectData.status}</p>
        </div>
        <div className="flex flex-col gap-2 items-start">
          {/* <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></svg>
                    </div> */}
          <p className="font-bold">LOCATION</p>
          <p>{projectData.city}</p>
        </div>
      </div>

      <div className="flex items-center justify-center py-10">
        <div className="max-page-width flex flex-col justify-center items-center">
          {projectData.centerImage && projectData.centerImage.length > 0 && (
            <div className="">
              <Image
                src={projectData.centerImage}
                width={3000}
                height={3000}
                alt={projectData.name}
                quality={100}
                className="className= w-full max-h-[400px] h-auto"
              />
            </div>
          )}
          <br />
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{ __html: projectData.longDescription }}
          />
        </div>
      </div>
    </>
  );
}
