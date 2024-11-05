"use client";
import Footer from "@/components/footer";
import { Loader2 } from "@/components/loader";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState } from "react";
import AnimationAbout from "./components/animation";

export default function Test() {
  gsap.registerPlugin(useGSAP);
  const [aboutData, setAboutData] = useState([]);
  const [aboutDataIcon, setAboutDataIcon] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/about/read", {
        cache: "no-store",
        next: { revalidate: 10 },
      });
      const data = await response.json();

      setAboutData(
        data?.data?.map((objectData, index) => ({
          ...objectData,
          uniqueIndex: index,
        }))
      );

      if (data.data[0].iconSmallUrl) {
        setAboutDataIcon(data.data[0].iconSmallUrl);
      }
      setCurrentIndex(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      setAboutDataIcon(aboutData[currentIndex].iconSmallUrl);
    } catch (error) {
      console.log("currentindex", error);
    }
  }, [currentIndex, aboutData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 />
      </div>
    );
  }

  return (
    <>
      <main className="dark-theme pt-24 flex flex-col justify-center items-start gap-4 h-[90%] overflow-auto text-white root">
        <div className="flex md:items-center mt-10 relative w-full min-h-screen h-full overflow-auto justify-center">
          <div className="flex flex-col justify-center relative w-full">
            <AnimationAbout aboutData={aboutData} currentIndex={currentIndex} />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
