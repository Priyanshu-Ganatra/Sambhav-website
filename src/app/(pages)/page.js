"use client";

import Footer from "@/components/footer";
import { Loader2 } from "@/components/loader";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects/get/all", {
          cache: "no-store",
          next: { revalidate: 10 },
        });
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Restore scroll position
  useEffect(() => {
    const restoreScrollPosition = () => {
      if (containerRef.current) {
        const savedScrollPosition = localStorage.getItem("scrollPosition");
        if (savedScrollPosition) {
          containerRef.current.scrollTo(0, parseInt(savedScrollPosition, 10));
          setScrollPosition(parseInt(savedScrollPosition, 10));
        }
      }
    };

    // Ensure DOM rendering before restoring scroll
    const timeout = setTimeout(restoreScrollPosition, 0);
    return () => clearTimeout(timeout);
  }, [loading]);

  // Handle scroll events
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    const distanceFromCenter = Math.abs(containerHeight / 2 - scrollTop);
    const scale = 1 - Math.min(distanceFromCenter / containerHeight, 0.1);

    gsap.to(container, {
      scale,
      duration: 0.2,
      ease: "power2.out",
    });

    const currentScrollPosition = container.scrollTop;
    const deltaPosition = Math.abs(currentScrollPosition - scrollPosition);
    const deltaTime = performance.now();
    setScrollSpeed(deltaPosition / deltaTime / 50);
    setScrollPosition(currentScrollPosition);

    clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      gsap.to(container, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      setScrollSpeed(0);
    }, 300);

    localStorage.setItem("scrollPosition", currentScrollPosition);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 />
      </div>
    );
  }

  return (
    <>
      <main
        className="relative pt-28 h-full overflow-auto"
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div className="page-section grid grid-cols-1 gap-10 md:gap-5 main-project-display will-change-transform origin-center">
          {Array.isArray(projects) &&
            projects.map(
              (
                {
                  id,
                  buildingImageUrl,
                  buildingHoverImage,
                  buildingName,
                  city,
                },
                index
              ) => (
                <Link
                  key={index}
                  href={`/projects/${btoa(id)}`}
                  className="project_card"
                >
                  <div
                    onClick={() => localStorage.setItem("cameFrom", "home")}
                    className="project-card flex flex-col-reverse justify-center items-center md:items-start md:flex-row md:justify-center gap-3 bldngCard"
                  >
                    <div className="flex gap-2 items-center md:flex-col w-full md:w-2/5 justify-end">
                      <div className="flex md:justify-end w-full">
                        <div className="flex justify-left md:justify-center flex-col text-left md:text-right">
                          <div className="text-[1.2rem] text-white font-semibold bldgName md:opacity-1">
                            {buildingName}
                          </div>
                          <div className="text-[0.8rem] hover:text-white text-gray-500">
                            {city}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-center md:justify-start md:w-3/5">
                      <div className="relative w-[350px] h-[350px] overflow-hidden buildingImageContainer border-none">
                        <Image
                          src={buildingImageUrl}
                          className={`w-full ${buildingHoverImage ? " first-building-image" : ""
                            } h-full object-contain transition-opacity duration-300 ease-in-out`}
                          alt={`${buildingName} ${city}`}
                          width={350}
                          height={350}
                        />
                        {buildingHoverImage && (
                          <Image
                            src={buildingHoverImage}
                            className="w-full h-full object-contain opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 absolute top-0 left-0"
                            alt={`${buildingName} ${city}`}
                            width={350}
                            height={350}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
        </div>
        <Footer />
      </main>
    </>
  );
}