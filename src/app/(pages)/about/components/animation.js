import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useMemo, useState } from "react";

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
    <div className="relative h-full">
      {/* <div className="w-full h-[250px] md:w-[400px] md:h-[400px] absolute hidden md:block">
                <div className="customBorder border-animation z-10"></div>
                <div className="dark-theme relative bg-red-100 w-full h-full">
                    <Image src={aboutDataIcon} height={80} width={80}
                        className="smallIcon dark-theme" />
                </div>
            </div> */}
      <div className="flex justify-between absolute items-end  h-[300px] md:h-full md:items-center  w-full z-20 px-2">
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
      <div className="px-5 md:px-20">
        {memoizedAboutData.map(({ index, iconBigUrl, content, heading }) => (
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleSwipe}
            key={index}
            className={`grid grid-cols-1 md:grid-cols-[40%_auto] gap-10 justify-stretch w-full items-center py-24 px-4 ${
              index === currentIndex ? "content-animation-top" : "hidden"
            }`}
          >
            {/* About Image */}
            <div className="relative h-[220px] w-full md:h-[300px] md:w-[300px] flex items-center justify-center self-start md:block">
              {iconBigUrl && (
                <Image
                  src={iconBigUrl}
                  quality={100}
                  fill
                  className={`object-contain dark-theme className= ${
                    index === currentIndex ? "animate-image" : "hidden"
                  }`}
                  alt=""
                />
              )}
            </div>
            {/* About content */}
            <div className="z-20 md:z-0 flex flex-col justify-center items-center w-full ">
              <div
                className={`${
                  index === currentIndex
                    ? "animate-text relative md:left-[10px] "
                    : "hidden "
                } `}
              >
                <h2 className="text-2xl font-semibold text-[#fef6ed] text-opacity-75 pb-3">
                  {heading}
                </h2>
                <p
                  className="text-justify text-[#fef6ed] text-opacity-75 w-full"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="hidden md:block relative top-16">
                {memoizedAboutData.map(({ index, content, heading }) => (
                    <div key={index} className={`relative p-2 md:left-[35%] md:w-[60%] h-[155px] overflow-hidden   ${index === ((currentIndex + 1) % aboutData.length) ? 'animate-subtext' : 'hidden'}`}>
                        <h2 className="text-2xl text-[#fef6ed] text-opacity-75 font-bold">{heading}</h2>
                        <p className="text-[#fef6ed] text-opacity-75">{content}</p>
                    </div>
                ))}
            </div> */}
    </div>
  );
}
