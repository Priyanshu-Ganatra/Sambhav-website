"use client";
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
      <main className="dark-theme h-full overflow-auto">
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
