
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Slideshow = ({ images }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 784)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Function to move to the next slide
  function nextSlide() {
    setCurrentSlide((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  }

  // Function to move to the previous slide
  function prevSlide() {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  // Function to handle manual slide change
  const handleManualSlideChange = (index) => {
    setCurrentSlide(index);
    clearInterval(timer); // Stop timer when slide changed manually
  };

  useEffect(() => {
    // Start slider timer
    const interval = setInterval(nextSlide, 300000);
    setTimer(interval);

    // Clean up function to clear the interval when component unmounts or when images change
    return () => clearInterval(interval);
  }, [currentSlide]); // Restart timer when currentSlide changes

  // useEffect to handle loading state
  useEffect(() => {
    if (images) {
      setLoading(false); // Set loading to false once images are loaded
    }
  }, [images]);


  return (
    <>
      {loading ? <div>Loading...</div> : ""} {/* Display loader while images are loading */}
      {!loading && images && images.length > 0 && (
        <div>
          <div className="relative h-full inset-0 flex justify-center z-0">
            <div className='relative w-full flex justify-center h-[50vh] md:h-[100vh]'>
              <div></div>
              <img
                src={images[currentSlide]}
                // fill
                // quality={100}
                alt={`Slide ${currentSlide + 1}`}
                className='z-[0] w-auto h-full object-contain'
              />
              <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-90 text-black rounded-full p-2"
                onClick={prevSlide}
              >
                <Image
                  src='/icons/left_chevron.svg'
                  height={30}
                  width={30}
                  alt='Left Chevron icon'
                />
              </button>
              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-90 text-black rounded-full p-2"
                onClick={nextSlide}
              >
                <Image
                  src='/icons/right_chevron.svg'
                  height={30}
                  width={30}
                  alt='Right Chevron icon'
                />
              </button>
            </div>
          </div>
          <div>
            <div className={`flex ${!isMobile && 'justify-center'} items-center flex-wrap gap-2 h-full mt-6 md:mt-3 z-[10] overflow-x-auto ${isMobile && 'max-w-screen h-20 flex-nowrap overflow-auto'}`}>
              {images.map((img, index) => (
                <div className='bg-red-500 relative h-20 w-20 min-w-20 hover:cursor-pointer' key={index}>
                  <Image
                    src={img}
                    fill
                    alt={`Thumbnail ${index + 1}`}
                    className={`object-cover h-full w-full bg-slate-400 border-2 ${currentSlide === index ? 'border-red-500' : 'border-transparent'} `}
                    onClick={() => handleManualSlideChange(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {loading && !images && images.length <= 0 && (
        <>
          <div className='flex justify-center items-center min-h-screen w-full  text-white text-5xl'>
            Coming Soon!
          </div>
        </>
      )}
    </>
  );
};

export default Slideshow;
