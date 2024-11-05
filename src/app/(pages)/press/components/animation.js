import { useState, useMemo, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { limitWords } from "@/utils/helpers";

export default function AnimationPressRelease({ pressReleaseData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [pressReleaseIcon, setPressReleaseIcon] = useState(
    pressReleaseData?.[0]?.iconSmallUrl
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


  const memoizedPressReleaseData = useMemo(
    () =>
      pressReleaseData.map((data, index) => ({
        ...data,
        index,
      })),
    [pressReleaseData]
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
      });
      gsap.to(".animate-text", {
        top: "0",
        opacity: "1",
        delay: 0.5,
        duration: 0.5,
      });
      gsap.to(".animate-subtext", {
        bottom: "-250",
        duration: 0.5,
      });
      gsap.to(".animate-subtext", {
        bottom: "0",
        delay: 0.6,
        duration: 0.5,
      });
      gsap.to(".border-animation", {
        rotate: "+=50",
        duration: 0.5,
        onComplete: () => {
          if (prev) {
            setCurrentIndex(
              currentIndex === 0
                ? pressReleaseData.length - 1
                : currentIndex - 1
            );
            setPressReleaseIcon(
              pressReleaseData[
                currentIndex === 0
                  ? pressReleaseData.length - 1
                  : currentIndex - 1
              ]?.iconSmallUrl
            );
          } else if (next) {
            setCurrentIndex((currentIndex + 1) % pressReleaseData.length);
            setPressReleaseIcon(
              pressReleaseData[(currentIndex + 1) % pressReleaseData.length]
                ?.iconSmallUrl
            );
          }
          setAnimation(false);
        },
      });
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
      currentIndex === 0 ? pressReleaseData.length - 1 : currentIndex - 1
    );
    setPressReleaseIcon(
      pressReleaseData[
        currentIndex === 0 ? pressReleaseData.length - 1 : currentIndex - 1
      ]?.iconSmallUrl
    );
    setAnimation(true);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % pressReleaseData.length);
    setPressReleaseIcon(
      pressReleaseData[(currentIndex + 1) % pressReleaseData.length]
        ?.iconSmallUrl
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
    <div className="relative md:mt-0 mt-20 h-full">
      {/* <div className="w-full h-[250px] md:w-[400px] md:h-[400px] absolute hidden md:block">
                <div className="customBorder border-animation z-10"></div>
                <div className="dark-theme relative bg-red-100 w-full h-full">
                    <Image src={pressReleaseIcon} height={80} width={80}
                        className="smallIcon dark-theme" />
                </div>
            </div> */}
      <div className="flex justify-between absolute items-end h-[300px] md:h-full md:items-center w-full z-0 px-2">
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
      <div className="px-8 md:px-20 z-2">
        {memoizedPressReleaseData &&
          memoizedPressReleaseData.map(
            ({ index, imageUrl, content, heading, redirection }) => (
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleSwipe}
                key={index}
                className={`grid grid-cols-1 md:grid-cols-[40%_auto] z-1 justify-center w-full items-center pt-24 pb-4 px-4 ${index === currentIndex ? "content-animation-top" : "hidden"
                  }`}
              >
                {/* Press Release Image */}
                <div className="relative h-[220px] w-full md:h-[450px] md:w-[450px] flex items-center justify-center self-start md:block">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      quality={100}
                      fill
                      className={`object-contain dark-theme className= ${index === currentIndex ? "animate-image" : "hidden"
                        }`}
                      alt=""
                    />
                  )}
                </div>
                {/* Press Release content */}
                <div className="z-20 md:z-0 flex flex-col justify-center items-center">
                  <div
                    className={`flex flex-col gap-5 md:w-[500px] ${index === currentIndex
                      ? "animate-text relative md:left-[10px] "
                      : "hidden "
                      } `}
                  >
                    <h2 className="text-2xl font-bold text-[#fef6ed] break-words max-w-full mt-4 md:mt-0 text-opacity-75">
                      {heading}
                    </h2>
                    <p
                      className="text-balance text-[#fef6ed] break-words max-w-full text-opacity-75"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    <p>
                      <Link
                        href={redirection}
                        className="hover:underline line-clamp-1 text-[#fef6ed] text-opacity-75"
                      >
                        Read More...
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
      </div>

      {/* <div className="hidden md:block relative top-10">
                {memoizedPressReleaseData.map(({ index, content, heading }) => (
                    <div key={index} className={`relative text-[#fef6ed] text-opacity-75 p-2 md:left-[35%] md:w-[60%] h-[155px] overflow-hidden   ${index === ((currentIndex + 1) % pressReleaseData.length) ? 'animate-subtext' : 'hidden'}`}>
                        <h2 className="text-2xl text-[#fef6ed] text-opacity-75 font-bold">{heading}</h2>
                        {content}
                    </div>
                ))}
            </div> */}
    </div>
  );
}