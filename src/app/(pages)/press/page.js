"use client";
import Footer from "@/components/footer";
import { Loader2 } from "@/components/loader";
import { useEffect, useState } from "react";
import AnimationPress from "./components/animation";

export default function Test() {
  const [pressReleaseData, setPressReleaseData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPressReleaseData();
  }, []);

  const fetchPressReleaseData = async () => {
    try {
      const response = await fetch("/api/press/read", {
        cache: "no-store",
        next: { revalidate: 10 },
      });
      const data = await response.json();

      setPressReleaseData(
        data.data.map((objectData, index) => ({
          ...objectData,
          uniqueIndex: index,
        }))
      );
      setCurrentIndex(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
    <>
      <main className="dark-theme pt-24 flex flex-col justify-center items-start gap-4 h-full overflow-auto text-white">
        <div className="flex-1 mt-10 relative w-full min-h-screen h-full overflow-auto">
          <div className="flex flex-col relative w-full">
            <AnimationPress
              pressReleaseData={pressReleaseData}
              currentIndex={currentIndex}
            />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
