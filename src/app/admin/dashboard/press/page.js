"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import dynamic from 'next/dynamic';
import PressUpdate from './components/update';
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const Press = () => {
  const [pressData, setPressData] = useState([]);
  const [formData, setFormData] = useState({
    heading: '',
    content: '',
    redirection: '',
    imageData: null,
  });

  useEffect(() => {
    fetchPressData();
  }, []);

  const fetchPressData = async () => {
    try {
      const response = await fetch('/api/press/read', { cache: 'no-store', next: { revalidate: 10 } });
      const data = await response.json();
      setPressData(data.data);
    } catch (error) {
      // console.error('Error fetching press data:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageData) {
      toast.warn("Please choose images")
      return
    }
    const formDataToSend = new FormData();
    formDataToSend.append('heading', formData.heading);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('redirection', formData.redirection);
    formDataToSend.append('imageData', formData.imageData);
    // formDataToSend.append('smallIconFile', formData.smallIconFile);

    try {
      const response = await fetch('/api/press/create', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();
      fetchPressData();
      // console.log(data)
      toast.success('Press release added successfully');
    } catch (error) {
      // console.error('Error adding press release:', error);
      toast.error('Failed to add press release');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this press release?");
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch('/api/press/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchPressData();
        toast.success('Press release deleted successfully');
      } else {
        // console.error('Failed to delete press release');
        toast.error('Failed to delete press release');
      }
    } catch (error) {
      // console.error('Error deleting press release:', error);
      toast.error('Error deleting press release');
    }
  };

  const updatePosition = async (
    pressId,
    newPosition,
    currentPosition,
    pressHeading
  ) => {

    const confirmed = confirm(
      `Are you sure you want to change position of press '${pressHeading}' ?`
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch("/api/press/update/position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: pressId, newPosition, currentPosition }),
        cache: "no-store",
        next: { revalidate: 10 },
      });
      if (!response.ok) {
        throw new Error("Failed to update press position.");
      }
      const data = await response.json();
      if (data.message) {
        fetchPressData();
        toast.success(data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to update press position.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Press Release</h1>
      <div className="grid grid-cols-1 gap-4 ">
        <div>
          <h2 className="text-lg font-semibold mb-2">Press Release Content</h2>
          <div className='grid grid-cols-3 gap-5'>
            {pressData.map((press, idx) => (
              <div key={press.id} className='shadow-md p-4 className= bg-gray-50 dark-theme'>
                <h3 className='text-lg font-semibold line-clamp-1'>{press.heading}</h3>
                <div className='my-5 w-full h-[150px]'>
                  <Image
                    src={press.imageUrl}
                    height={150}
                    width={150}
                    quality={100}
                    className='w-fill object-cover h-full w-full className='
                    alt={`Press Image ${idx}`}
                  />
                </div>
                <p className='line-clamp-2' dangerouslySetInnerHTML={{ __html: press.content }} />
                <Link href={press.redirection} className='text-xs text-blue-500 underline line-clamp-1' target='_blank'>{press.redirection}</Link>
                <div className="flex gap-2 justify-evenly mt-4 items-center">
                  <PressUpdate id={press.id} fetchPressData={fetchPressData} />
                  <span className='flex'>
                    <button
                      title="Shift to left"
                      onClick={() =>
                        updatePosition(
                          press.id,
                          press.position - 1,
                          press.position,
                          press.heading
                        )
                      }
                    >
                      <svg
                        className="rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 4v16l13 -8z" />
                      </svg>
                    </button>
                    {/* {press.position} */}
                    <button
                      title="Shift to Right"
                      onClick={() =>
                        updatePosition(
                          press.id,
                          press.position + 1,
                          press.position,
                          press.heading
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 4v16l13 -8z" />
                      </svg>
                    </button>
                  </span>
                  <button onClick={() => handleDelete(press.id)} className="text-red-500 text-right w-full flex justify-end text-xs">
                    <Image
                      src='/icons/trash_red.svg'
                      height={15}
                      width={15}
                      alt='Delete'
                    />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Add New Press Release</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="heading" className="block text-sm font-semibold mb-1">Heading:</label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Enter heading"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-semibold mb-1">Content:</label>
              {/* <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="3"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Enter content"
              ></textarea> */}
              <JoditEditor
                value={formData.content}
                tabIndex={1}
                onBlur={(description) => setFormData((prevData) => ({ ...prevData, content: description }))}
              />
            </div>
            <div>
              <label htmlFor="redirection" className="block text-sm font-semibold mb-1">Redirection Link:</label>
              <input
                id="redirection"
                name="redirection"
                value={formData.redirection}
                onChange={handleInputChange}
                rows="3"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Redirection Link"
              />
            </div>
            <div>
              <label htmlFor="imageData" className="block text-sm font-semibold mb-1">Image:</label>
              <input
                type="file"
                id="imageData"
                name="imageData"
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png, .webp, .gif"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            {/* <div>
              <label htmlFor="smallIconFile" className="block text-sm font-semibold mb-1">Small Icon Image:</label>
              <input
                type="file"
                id="smallIconFile"
                name="smallIconFile"
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png, .webp, .gif"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div> */}
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer">Add Press Release</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Press;