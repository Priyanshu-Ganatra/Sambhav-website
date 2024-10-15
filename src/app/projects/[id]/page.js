"use client";
import Header from "@/components/project_header";
import Slideshow from "./components/slideshow";
import { useEffect, useState } from "react";
import ProjectDetails from "./components/projectDetails";
import ExtraDetails from "./components/extraDetails";
import Amenitites from "./components/amenityImage";
import { Loader2 } from "@/components/loader";
import Link from "next/link";

export default function SingleProjectPage({ params }) {
  const [loading, setLoading] = useState(true); // State to manage loading
  const [projectData, setProjectData] = useState({});
  const [moreProjectData, setMoreProjectData] = useState([]);
  const [projectImages, setProjectImages] = useState([]);

  const projectId = atob(decodeURIComponent(params.id));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/projects/get?id=${projectId}`, {
          cache: "no-store",
          next: { revalidate: 10 },
        });
        const data = await response.json();
        setProjectData(data);
        setMoreProjectData(data.projectData);
        setProjectImages(data.projectImages.map((image) => image.imageUrl));
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) {
    return <Loader2 />;
  }

  return (
    <>
      <div className="absolute top-6 z-50 min-h-24 flex flex-col justify-center w-max">
        <Link
          title="Back to Project page"
          href="/projects"
          className="absolute top-1 left-4 md:left-40 text-white bg-black rounded-sm p-2 z-50 flex gap-1  opacity-50 hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l14 0" />
            <path d="M5 12l6 6" />
            <path d="M5 12l6 -6" />
          </svg>
        </Link>
        {/* <Header theme="transparent-theme" /> */}
      </div>
      <main className="dark-theme pt-24 h-full overflow-auto">
        <div>
          <Slideshow images={projectImages} />
        </div>
        <br />
        <div className="page-section">
          <ProjectDetails projectData={projectData} />
          <ExtraDetails moreProjectData={moreProjectData} />
          <Amenitites amenities={projectData.amenityImage} />
          <br />
        </div>
      </main>
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
