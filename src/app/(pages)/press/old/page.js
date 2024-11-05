"use client";
import { Loader2 } from "@/components/loader";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function About() {
  gsap.registerPlugin(useGSAP);
  const [aboutData, setAboutData] = useState([]);
  const [aboutDataIcon, setAboutDataIcon] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const animatedContainer = useRef();

  // Slide Next
  useGSAP(
    (context) => {
      console.log("GSAP: ", context);
      gsap.to(".animation", { rotation: "+=10", duration: 0.5 }); // <-- automatically reverted
      gsap.from(".iconAnimation", {
        rotation: -20,
      });
      gsap.to(".iconAnimation", {
        rotation: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    },
    [currentIndex]
  );

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/press/read", {
        cache: "no-store",
        next: { revalidate: 10 },
      });
      const data = await response.json();
      setAboutData(data.data);
      if (data.data[0].iconSmallUrl) {
        setAboutDataIcon(data.data[0].iconSmallUrl);
      }
      setCurrentIndex(0);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching about data:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  useEffect(() => {
    console.log("useeffect", aboutData, currentIndex);
    try {
      console.log(aboutData[currentIndex]);
      setAboutDataIcon(aboutData[currentIndex].iconSmallUrl);
    } catch (error) {
      console.log("currentindex", error);
    }
  }, [currentIndex]);

  const handleNextSlide = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < aboutData.length) {
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex(0); // Go back to the first set of data
    }
  };
  const handlePrevSlide = () => {
    const prev = currentIndex - 1;
    if (prev >= 0) {
      console.log(prev, aboutData.length, "prev");
      setCurrentIndex(prev);
    } else {
      console.log(prev, aboutData.length, "start");
      setCurrentIndex(aboutData.length - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 />
      </div>
    );
  }

  return (
    <main className="dark-theme overflow-hidden flex flex-col justify-center items-center py-5">
      <div className="max-page-width relative">
        <div className="flex flex-col items-center justify-center w-full py-[10px] gap-10 min-h-[500px] overflow-y-auto relative">
          <div className="absolute h-full w-full z-0 overflow-hidden  top-0">
            <div className="relative w-[250px] h-[250px] md:h-[600px] md:w-[600px] right-[-19%] top-[10px] md:left-[calc(-10%-150px)] md:top-[-50px]">
              <div className="absolute h-full w-full animation rounded-full border border-dashed"></div>
              <Image
                src={aboutDataIcon}
                height={50}
                width={50}
                className="iconAnimation absolute right-[-30px] md:right-[-40px]  top-0 bottom-0 my-auto dark-theme border h-[65px] w-[65px] md:h-[80px] md:w-[80px] rounded-full p-1 object-contain"
                alt=""
              />
            </div>
          </div>
          {aboutData.map((content, index) => (
            <div
              key={index}
              className={` flex items-center justify-center gap-10 md:flex-row w-full flex-col py-[10px] ${currentIndex !== index && "hidden"
                }`}
            >
              <div ref={animatedContainer} className="px-[20px] w-full ">
                <div className="w-full h-full relative ">
                  <Link
                    href={content.redirection}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={content.imageUrl}
                      height={225}
                      width={225}
                      quality={100}
                      className="dark-theme className= w-[225px] h-[225px] object-cover"
                      alt=""
                    />
                  </Link>
                </div>
              </div>

              <div className="w-full text-justify px-5 md:px-0 flex flex-col gap-5 z-20">
                <div className="about-title text-xl ">
                  <Link
                    href={content.redirection}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    <span>{content.heading}</span>
                  </Link>
                </div>
                <div>{content.content}</div>
                <div>
                  <Link
                    href={content.redirection}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <button className="text-white hover:underline text-sm font-light">
                      Read more
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="flex self-end  justify-between items-center top-5 gap-5 z-[99] text-white  bottom-0 w-full dark-theme px-4 md:w-1/2 md:relative">
            <button onClick={handlePrevSlide} className="cursor-pointe">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 6l-6 6l6 6" />
              </svg>
            </button>
            <button onClick={handleNextSlide}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
              >
                <path
                  stroke="none"
                  d="M0 0h24
                            <24v24H0z"
                  fill="none"
                />
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
