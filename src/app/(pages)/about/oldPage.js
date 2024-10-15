// "use client"
// import Image from "next/image";
// import { useEffect, useState, useRef } from "react";

// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";

// export default function About() {
//     gsap.registerPlugin(useGSAP);
//     const [aboutData, setAboutData] = useState([]);
//     const [aboutDataIcon, setAboutDataIcon] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [loading, setLoading] = useState(true); // Add loading state
//     const animatedContainer = useRef();

//     // Slide Next
//     useGSAP((context) => {
//         console.log("GSAP: ", context)
//         gsap.to('.animation', { rotation: '+=10', duration: 0.5 }); // <-- automatically reverted
//         gsap.from('.iconAnimation',{
//             rotation: -20,
//         })
//         gsap.to('.iconAnimation',{
//             rotation: 0,
//             duration:1,
//             ease: "power2.inOut",
//         })

//     }, [currentIndex]);

//     useEffect(() => {
//         fetchAboutData();
//     }, []);

//     const fetchAboutData = async () => {
//         try {
//             const response = await fetch('/api/about/read');
//             const data = await response.json();
//             setAboutData(data.data);
//             if(data.data[0].iconSmallUrl){
//                 setAboutDataIcon(data.data[0].iconSmallUrl)
//             }
//             setCurrentIndex(0)
//             setLoading(false); // Update loading state when data is fetched
//         } catch (error) {
//             console.error('Error fetching about data:', error);
//             setLoading(false); // Update loading state in case of error
//         }
//     };

//     useEffect(()=>{
//         console.log("useeffect",aboutData, currentIndex)
//         try {
//             console.log(aboutData[currentIndex])
//             setAboutDataIcon(aboutData[currentIndex].iconSmallUrl)
//         } catch (error) {
//             console.log("currentindex",error)
//         }
//     }, [currentIndex])

//     const handleNextSlide = () => {
//         const nextIndex = currentIndex + 1;

//         if (nextIndex < aboutData.length) {
//             setCurrentIndex(nextIndex);
//         } else {
//             setCurrentIndex(0); // Go back to the first set of data
//         }
//     };

//     const handlePrevSlide = () => {
//         const prev = currentIndex - 1;
//         if (prev >= 0) {
//             console.log(prev, aboutData.length, "prev")
//             setCurrentIndex(prev);
//         } else {
//             console.log(prev, aboutData.length, "start")
//             setCurrentIndex(aboutData.length - 1); 
//         }
//     };

//     return (
//         <>
//             <main className="dark-theme overflow-hidden flex flex-col justify-center items-center py-5">
                
//                 <div className="max-page-width relative">
//                     <div className="flex flex-col items-center justify-center w-full py-[10px] gap-10 min-h-[500px] overflow-y-auto relative" >
//                         {loading ? ( // Display loader when loading is true
//                             <div className="flex items-center justify-center h-screen">
//                                 <p>Loading...</p>
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="absolute h-full w-full z-0 overflow-hidden  top-0">
//                                     <div className="relative w-[250px] h-[250px] md:h-[600px] md:w-[600px] right-[-19%] top-[10px] md:left-[calc(-10%-150px)] md:top-[-50px]">
//                                         <div 
//                                             className="absolute h-full w-full animation rounded-full border border-dashed">
//                                         </div>
//                                         <Image
//                                             src={aboutDataIcon}
//                                             height={50}
//                                             width={50}
//                                             className="iconAnimation absolute right-[-30px] md:right-[-40px]  top-0 bottom-0 my-auto dark-theme border h-[65px] w-[65px] md:h-[80px] md:w-[80px] rounded-full p-1 object-contain"
//                                         />
//                                     </div>
//                                 </div>
//                                 {aboutData.map((content, index) => (
//                                     <div
//                                         key={index}
//                                         className={` flex items-center justify-center gap-10 md:flex-row w-full flex-col py-[10px] ${currentIndex !== index && 'hidden'}`}
//                                     >
//                                         <div ref={animatedContainer} className="px-[20px] w-full ">
//                                             <div className="w-full h-full relative ">
//                                                 <Image
//                                                     src={content.iconBigUrl}
//                                                     height={225}
//                                                     width={225}
//                                                     className="dark-theme className= w-[225px] h-[225px] object-contain"
//                                                 />
//                                             </div>
//                                         </div>
                                        
//                                         <div className="w-full text-justify px-5 md:px-0 flex flex-col gap-5 ">
//                                             <div className="about-title text-xl flex flex-col font-semibold">
//                                                 {content.heading}
//                                             </div>
//                                             <div>
//                                                 {content.content}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <div className="flex self-end  justify-between items-center top-5 gap-5 z-[99] text-white  bottom-0 w-full dark-theme px-4 md:w-1/2 md:relative">
//                                     <button onClick={handlePrevSlide} className="cursor-pointer">
//                                         <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1"   strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg> 
//                                     </button> 
//                                     <button onClick={handleNextSlide} className="cursor-pointer">
//                                         <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1"   strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
//                                     </button>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

// import { useState, useMemo, useEffect } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import Image from "next/image";

// export default function AnimationAbout({ aboutData }) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [animation, setAnimation] = useState(false);
//     const [aboutDataIcon, setAboutDataIcon] = useState(aboutData[0].iconSmallUrl);
//     const [prev, setPrev] = useState(false)
//     const [next, setNext] = useState(false)
//     const [touchStart, setTouchStart] = useState(0);
//     const [touchEnd, setTouchEnd] = useState(0);

//     const memoizedAboutData = useMemo(() => aboutData.map((data, index) => ({
//         ...data,
//         index
//     })), [aboutData]);

//     useGSAP(() => {
//         if (animation) {
//             gsap.to('.animate-image', {
//                 transformOrigin: 'left',
//                 rotate: '180',
//                 opacity: '0',
//                 duration: 0.5,
//             });
//             gsap.to('.animate-image', {
//                 transformOrigin: 'left',
//                 rotate: '0',
//                 opacity: '1',
//                 delay: 0.5,
//                 duration: 0.5,
//             });
//             gsap.to('.animate-text', {
//                 top: '-180',
//                 opacity: '0',
//                 duration: 0.5,
//             });
//             gsap.to('.animate-text', {
//                 top: '0',
//                 opacity: '1',
//                 delay: 0.5,
//                 duration: 0.5,
//             });
//             gsap.to('.animate-subtext', {
//                 bottom: '-250',
//                 duration: 0.5,
//             });
//             gsap.to('.animate-subtext', {
//                 bottom: '0',
//                 delay: 0.6,
//                 duration: 0.5,
//             });
//             gsap.to('.border-animation', {
//                 rotate: '+=50',
//                 duration: 0.5,
//                 onComplete: () => {
//                     if (prev) {
//                         setCurrentIndex(currentIndex === 0 ? aboutData.length - 1 : currentIndex - 1);
//                         setAboutDataIcon(aboutData[currentIndex === 0 ? aboutData.length - 1 : currentIndex - 1].iconSmallUrl);
//                     }
//                     else if (next) {
//                         setCurrentIndex((currentIndex + 1) % aboutData.length);
//                         setAboutDataIcon(aboutData[(currentIndex + 1) % aboutData.length].iconSmallUrl);
//                     }
//                     setAnimation(false);
//                 }
//             });
//         }
//     }, [animation]);

//     const handleSwipe = () => {
//         if (touchStart - touchEnd > 100) {
//             handleNext();
//         }

//         if (touchEnd - touchStart > 100) {
//             handlePrevious();
//         }
//     };

//     const handleTouchStart = (e) => {
//         setTouchStart(e.targetTouches[0].clientX);
//     };

//     const handleTouchMove = (e) => {
//         setTouchEnd(e.targetTouches[0].clientX);
//     };


//     const handlePrevious = () => {
//         setCurrentIndex(currentIndex === 0 ? aboutData.length - 1 : currentIndex - 1);
//         setAboutDataIcon(aboutData[currentIndex === 0 ? aboutData.length - 1 : currentIndex - 1].iconSmallUrl);
//         setAnimation(true);
//     };

//     const handleNext = () => {
//         setCurrentIndex((currentIndex + 1) % aboutData.length);
//         setAboutDataIcon(aboutData[(currentIndex + 1) % aboutData.length].iconSmallUrl);
//         setAnimation(true);
//     };
//     const handlePreviousDesktop = () => {
//         setPrev(true);
//         setAnimation(true);
//     };

//     const handleNextDesktop = () => {
//         setNext(true)
//         setAnimation(true);
//     };

//     return (
//         <div className="relative">
//             {/* <div className="w-full h-[250px] md:w-[400px] md:h-[400px] absolute hidden md:block">
//                 <div className="customBorder border-animation z-10"></div>
//                 <div className="dark-theme relative bg-red-100 w-full h-full">
//                     <Image src={aboutDataIcon} height={80} width={80}
//                         className="smallIcon dark-theme" />
//                 </div>
//             </div> */}
//             {memoizedAboutData.map(({ index, iconBigUrl, content, heading }) => (
//                 <div
//                     onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleSwipe} 
//                     key={index} className={`grid grid-cols-1 md:grid-cols-[40%_auto] gap-10 justify-stretch w-full items-center py-24 px-4 ${index === currentIndex ? 'content-animation-top' : 'hidden'}`}>
//                     {/* About Image */}
//                     <div className="relative h-[220px] w-full md:h-[300px] md:w-[300px] flex items-center justify-center self-start md:block">
//                         {iconBigUrl && (
//                             <Image src={iconBigUrl} quality={100} fill className={`object-contain dark-theme className= ${index === currentIndex ? 'animate-image' : 'hidden'}`} />
//                         )}
//                     </div>
//                     {/* About content */}
//                     <div className="z-20 md:z-0 flex flex-col justify-center items-center w-full ">
//                         <div className={`${index === currentIndex ? 'animate-text relative md:left-[10px] ' : 'hidden '} `}>
//                             <h2 className="text-2xl font-semibold text-[#fef6ed] text-opacity-75 pb-3">{heading}</h2>
//                             <p className="text-justify text-[#fef6ed] text-opacity-75 w-full">{content}</p>
//                         </div>
//                     </div>
//                 </div>
//             ))}

//             {/* <div className="hidden md:block relative top-16">
//                 {memoizedAboutData.map(({ index, content, heading }) => (
//                     <div key={index} className={`relative p-2 md:left-[35%] md:w-[60%] h-[155px] overflow-hidden   ${index === ((currentIndex + 1) % aboutData.length) ? 'animate-subtext' : 'hidden'}`}>
//                         <h2 className="text-2xl text-[#fef6ed] text-opacity-75 font-bold">{heading}</h2>
//                         <p className="text-[#fef6ed] text-opacity-75">{content}</p>
//                     </div>
//                 ))}
//             </div> */}
//             <div className="px-5  flex justify-between absolute  -bottom-[20px] w-full z-20">
//                 <button onClick={handlePreviousDesktop} className="flex gap-1 items-center">
//                     <Image src='/icons/left_chevron.svg' width={22} height={22} />
//                     Previous
//                 </button>
//                 <button onClick={handleNextDesktop} className="flex gap-1 items-center">
//                     Next
//                     <Image src='/icons/right_chevron.svg' width={22} height={22} />
//                 </button>
//             </div>

//         </div>
//     );
// }
