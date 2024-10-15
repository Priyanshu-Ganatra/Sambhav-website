"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Socials = () => {
  const [socialMediaList, setSocialMediaList] = useState([]);
  const [formData, setFormData] = useState({
    socialMedia: '',
    link: '',
  });
  const socialMediaOptions = [
    "Discord",
    "Facebook",
    "Flickr",
    "Instagram",
    "LinkedIn",
    "Medium",
    "Pinterest",
    "Reddit",
    "Skype",
    "TikTok",
    "Tumblr",
    "Telegram",
    "WeChat",
    "Snapchat",
    "WhatsApp",
    "X",
    "YouTube",
    "Twitch",
  ].filter(option => !socialMediaList.some(item => item.socialMedia=== option));

  useEffect(() => {
    fetchSocialMediaList();
  }, []);

  const fetchSocialMediaList = async () => {
    try {
      const response = await fetch('/api/social/get',{ cache: 'no-store', next: { revalidate: 10 } });
      const data = await response.json();
      if (response.ok) {
        setSocialMediaList(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch social media list');
      }
    } catch (error) {
      // console.error('Error fetching social media list:', error);
      toast.error('Failed to fetch social media list');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSocialMedia = async () => {
    try {
      const response = await fetch('/api/social/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socialMedia: formData.socialMedia, // Ensure case sensitivity here
          link: formData.link, // Ensure case sensitivity here
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({ socialMedia: '', link: '' });
        fetchSocialMediaList();
        toast.success('Social media link added successfully');
      } else {
        toast.error(data.error || 'Failed to add social media link');
      }
    } catch (error) {
      // console.error('Error adding social media link:', error);
      toast.error('Failed to add social media link');
    }
  };

  const handleDeleteSocialMedia = async (id) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm("Are you sure you want to delete this social media link?");
    if (!confirmed) {
      return;
    }
  
    try {
      const response = await fetch(`/api/social/delete?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setSocialMediaList(socialMediaList.filter((item) => item.id !== id));
        toast.success('Social media link deleted successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete social media link');
      }
    } catch (error) {
      // console.error('Error deleting social media link:', error);
      toast.error('Failed to delete social media link');
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="px-5 md:px-40 mx-auto my-8">
        <h2 className="text-lg font-semibold mb-4">Add New Social Media Link</h2>
        <div className="flex items-center">
          <select
            name="socialMedia"
            value={formData.socialMedia}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 mr-2 flex-1"
          >
            <option value="">Select Social Media Type</option>
            {socialMediaOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            placeholder="Social Media Link"
            className="border border-gray-300 rounded-md px-3 py-2 mr-2 flex-1"
          />
          <button onClick={handleAddSocialMedia} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add</button>
        </div>
      </div>
      <div className="px-5 md:px-40 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Social Media Links</h1>
        <ul>
          {socialMediaList.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 border-b">
              <Link href={item.link} target="_blank" rel="noopener noreferrer">{item.socialMedia}</Link>
              <Link href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{item.link}</Link>
              <button onClick={() => handleDeleteSocialMedia(item.id)} className="text-red-500 ml-2">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Socials;
