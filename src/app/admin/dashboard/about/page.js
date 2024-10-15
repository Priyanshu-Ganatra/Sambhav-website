"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AboutUpdate from "./components/update";

import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const About = () => {
  const [aboutData, setAboutData] = useState([]);
  const [formData, setFormData] = useState({
    heading: "",
    content: "",
    imageData: null,
    // smallIconFile: null,
  });

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
      setAboutData(data.data);
    } catch (error) {
      console.error("Error fetching about data:", error);
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

    const formDataToSend = new FormData();
    formDataToSend.append("heading", formData.heading);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("redirection", formData.redirection);
    formDataToSend.append("imageData", formData.imageData);
    // formDataToSend.append('smallIconFile', formData.smallIconFile);

    try {
      const response = await fetch("/api/about/create", {
        method: "POST",
        body: formDataToSend,
      });
      if (response.ok) {
        fetchAboutData();
        toast.success("About release added successfully");
      } else {
        // console.error('Failed to add about release');
        toast.error("Failed to add about release");
      }
    } catch (error) {
      // console.error('Error adding about release:', error);
      toast.error("Failed to add about release");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this about release?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(`/api/about/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchAboutData();
        toast.success("About us data deleted successfully");
      } else {
        // console.error('Failed to delete about');
        toast.error("Failed to delete about");
      }
    } catch (error) {
      // console.error('Error deleting about:', error);
      toast.error("Error deleting about");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">About us</h1>
      </div>
      <div className="bg-gray-100 className= p-4">
        <h2 className="text-sm font-semibold mb-2">Important Notes:</h2>

        <ul className="list-disc pl-5 mb-2 text-xs">
          <li>Keep file sizes optimized to improve page load times.</li>
          <li>Double-check the accuracy and completeness of the content.</li>
          <li>Review all details before submission to avoid errors.</li>
          <li>
            Consider keeping backups of original files for future reference.
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-4 ">
        <div>
          <h2 className="text-lg font-semibold mb-2">About us Content</h2>
          <div className="grid grid-cols-3 gap-5">
            {aboutData.map((about) => (
              <div
                key={about.id}
                className="shadow-md p-4 className= dark-theme"
              >
                <h3 className="text-lg font-semibold line-clamp-1">
                  {about.heading}
                </h3>
                <div className="relative my-5 w-full h-[200px]  ">
                  <Image
                    src={about.iconBigUrl}
                    height={150}
                    width={150}
                    quality={100}
                    className="w-fill object-cover h-full w-full className="
                    alt=""
                  />
                  {/* <Image
                    src={about.iconSmallUrl}
                    height={50}
                    width={50}
                    quality={100}
                    className='absolute top-0 left-0 h-[50px] w-[50px] object-contain bg-gray-50 opacity-70 p-1 rounded-md'
                  /> */}
                </div>
                <p
                  className="line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: about.content }}
                />
                <div className="flex gap-2 items-center justify-start mt-5">
                  <AboutUpdate id={about.id} fetchAboutData={fetchAboutData} />
                  <button
                    onClick={() => handleDelete(about.id)}
                    className="text-red-500 text-right w-full flex justify-end text-xs"
                  >
                    <Image src="/icons/trash_red.svg" height={15} width={15} alt=""/>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Add New About us data</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="heading"
                className="block text-sm font-semibold mb-1"
              >
                Heading:
              </label>
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
              <label
                htmlFor="content"
                className="block text-sm font-semibold mb-1"
              >
                Content:
              </label>
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
                onBlur={(description) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    content: description,
                  }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="imageData"
                className="block text-sm font-semibold mb-1"
              >
                Image:
              </label>
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
                accept=".jpg, .jpeg, .png, .webp, .gif"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div> */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            >
              Add About Section
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;