import { limitWords } from "@/utils/helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function AnimationAbout({ aboutData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [aboutDataIcon, setAboutDataIcon] = useState(
    aboutData?.[0]?.iconSmallUrl
  );
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 784) console.log('mobile')
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const memoizedAboutData = useMemo(
    () =>
      aboutData.map((data, index) => ({
        ...data,
        index,
      })),
    [aboutData]
  );

  useGSAP(() => {
    if (animation) {
      gsap.to(".animate-image", {
        transformOrigin: "left",
        rotate: "180",
        opacity: "0",
        duration: 0.5,
      });
      gsap.to(".animate-image", {
        transformOrigin: "left",
        rotate: "0",
        opacity: "1",
        delay: 0.5,
        duration: 0.5,
      });
      gsap.to(".animate-text", {
        top: "-180",
        opacity: "0",
        duration: 0.5,
        onComplete: () => {
          if (prev) {
            setCurrentIndex(
              currentIndex === 0 ? aboutData.length - 1 : currentIndex - 1
            );
            setAboutDataIcon(
              aboutData[
                currentIndex === 0 ? aboutData.length - 1 : currentIndex - 1
              ].iconSmallUrl
            );
          } else if (next) {
            setCurrentIndex((currentIndex + 1) % aboutData.length);
            setAboutDataIcon(
              aboutData[(currentIndex + 1) % aboutData.length].iconSmallUrl
            );
          }
        },
      });
      gsap.to(".animate-text", {
        top: "0",
        opacity: "1",
        delay: 0.5,
        duration: 0.5,
        onComplete: () => {
          setAnimation(false);
        },
      });
      // gsap.to('.animate-subtext', {
      //     bottom: '-250',
      //     duration: 0.5,
      // });
      // gsap.to('.animate-subtext', {
      //     bottom: '0',
      //     delay: 0.6,
      //     duration: 0.5,
      // });
      // gsap.to('.border-animation', {
      //     rotate: '+=50',
      //     duration: 0.5,

      // });
    }
  }, [animation]);

  const handleSwipe = () => {
    if (touchStart - touchEnd > 100) {
      handleNext();
    }

    if (touchEnd - touchStart > 100) {
      handlePrevious();
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? aboutData.length - 1 : currentIndex - 1
    );
    setAboutDataIcon(
      aboutData[currentIndex === 0 ? aboutData.length - 1 : currentIndex - 1]
        .iconSmallUrl
    );
    setAnimation(true);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % aboutData.length);
    setAboutDataIcon(
      aboutData[(currentIndex + 1) % aboutData.length].iconSmallUrl
    );
    setAnimation(true);
  };
  const handlePreviousDesktop = () => {
    setPrev(true);
    setAnimation(true);
  };

  const handleNextDesktop = () => {
    setNext(true);
    setAnimation(true);
  };

  return (
    <div className="relative md:mt-0 h-full">
      <div className="flex justify-between absolute h-[300px] md:h-full md:max-h-[70vh] md:items-center w-full z-[200] px-2">
        <button
          onClick={handlePreviousDesktop}
          className="flex gap-1 items-center"
        >
          <Image src="/icons/left_chevron.svg" width={35} height={35} alt="" />
          {/* Previous */}
        </button>
        <button onClick={handleNextDesktop} className="flex gap-1 items-center">
          {/* Next */}
          <Image src="/icons/right_chevron.svg" width={35} height={35} alt="" />
        </button>
      </div>

      {memoizedAboutData.map(({ index, iconBigUrl, content, heading }) => (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleSwipe}
          key={index}
          className={`grid grid-cols-1 md:grid-cols-[40%_auto] z-1 justify-center items-start w-full  pb-4 px-4 ${index === currentIndex ? "content-animation-top" : "hidden"}`}
        >
          {/* About Image */}
          <div className="relative max-h-[450px] w-full md:h-[450px] md:w-[450px] flex items-center justify-center self-center">
            {iconBigUrl && (
              <Image
                src={iconBigUrl}
                quality={100}
                height={450}
                width={450}
                className={`object-contain dark-theme className= ${index === currentIndex ? "animate-image" : "hidden"
                  }`}
                alt=""
              />
            )}
          </div>
          {/* About content */}
          <div className="z-20 md:z-0 flex">
            <div
              className={`flex flex-col gap-5 md:w-[500px] ${index === currentIndex
                ? "animate-text relative md:left-[10px] "
                : "hidden "
                } `}
            >
              <h2 className="text-2xl font-bold text-center text-[#fef6ed] mt-4 md:mt-0 break-words max-w-full text-opacity-75">
                {heading}
              </h2>
              <p
                className="text-[#fef6ed] break-words max-w-full text-opacity-75"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}