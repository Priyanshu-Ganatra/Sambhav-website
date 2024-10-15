"use client"
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';

const Socials = ({iconsColor = 'black'}) => {
  const [socialMediaList, setSocialMediaList] = useState([]);

  useEffect(() => {
    fetchSocialMediaList();
  }, []);

  const fetchSocialMediaList = async () => {
    try {
      const response = await fetch('/api/social/get',{ cache: 'no-store' , next: { revalidate: 10 }});
      const data = await response.json();
      if (response.ok) {
        setSocialMediaList(data.data);
        console.log(data)
      } else {
        toast.error(data.error || 'Failed to fetch social media list');
      }
    } catch (error) {
      console.error('Error fetching social media list:', error);
      toast.error('Failed to fetch social media list');
    }
  };

  return (
    <>
    {socialMediaList.map((item,index) => (
        <Link key={index} href={item.link} target="_blank" rel="noopener noreferrer" className=''>
          <Image
            src={iconsColor == 'black' ? `/icons/social/black/${item.socialMedia}.svg` : `/icons/social/white/${item.socialMedia}.svg`}
            alt={item.socialMedia}
            height={20}
            width={20}
            quality={100}
            className="w-[25px] h-[25px]"
          />
        </Link>
    ))}
    </>
  );
};

export default Socials;
