"use client";
import { Loader1, Loader2 } from "@/components/loader";
import Header from "@/components/project_header";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects/get/all", {
          cache: "no-store",
          next: { revalidate: 10 },
        });
        const data = await response.json();
        setProjects(data);
        setLoading(false); // Set loading to false once projects are fetched
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <Loader2 />;
  }

  return (
    <>
      <main
        className={`relative pt-24 items-center justify-between h-full overflow-auto`}
      >
        <div className="">
          <div className="location-filter"></div>
          <div className="page-section grid grid-cols-2 md:grid-cols-4 gap-5">
            {projects?.map(
              (
                { id, logoUrl, buildingName, city, projectImages, centerImage },
                index
              ) => {
                return (
                  <Link
                    href={`/projects/${btoa(
                      id
                    )}?project=${buildingName}_${city}`}
                    key={id + String(index)}
                  >
                    <div className="project-img-container relative">
                      {projectImages && projectImages.length > 0 ? (
                        <div className="w-full overflow-hidden">
                          <Image
                            className="w-full h-[200px] object-cover"
                            src={projectImages[0].imageUrl}
                            quality={100}
                            width={500}
                            height={500}
                            alt={`${buildingName}_${city}`}
                          />
                        </div>
                      ) : centerImage ? (
                        <div className="w-full  overflow-hidden">
                          <Image
                            className="w-full h-[200px] object-cover"
                            src={centerImage}
                            quality={100}
                            width={500}
                            height={500}
                            alt={`${buildingName}_${city}`}
                          />
                        </div>
                      ) : (
                        <div className="w-full overflow-hidden">
                          <Image
                            className="w-full h-[200px] object-contain"
                            src={logoUrl}
                            quality={100}
                            width={500}
                            height={500}
                            alt="logo"
                          />
                        </div>
                      )}
                      <div className="project-logo-container w-full  absolute top-0 left-0 h-full flex justify-between items-end gap-2 bg-black opacity-0 hover:opacity-90 transition-opacity duration-300 py-2 cursor-pointer px-4">
                        <div className="w-full flex h-full flex-col justify-center items-center gap-2">
                          <Image
                            className="project-logo h-[80%] object-contain mb-2"
                            src={logoUrl}
                            width={500}
                            height={500}
                            alt="logo"
                          />
                          <div className="w-full flex flex-col gap-1 text-center">
                            {/* <div className="bg-white text-black px-2 py-1 rounded-sm w-full text-xs ">{buildingName}</div> */}
                            {/* <div className="text-white text-xs font-light px-2">{city}</div> */}
                          </div>
                        </div>
                        {/* <div>
                          <Image
                            src="/icons/circle_right_arrow.svg"
                            height={25}
                            width={25}
                            alt="icon"
                          />
                        </div> */}
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </main>
    </>
  );
}
