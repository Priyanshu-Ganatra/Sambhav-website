"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditProjectExtraData from "./editProjectExtraData";
import JoditEditor from "jodit-react";

const AddProjectData = ({ projectId, fetchProjectData, projectData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null, // Updated state key for image file
  });

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData, projectId]);

  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setFormData({ ...formData, imageFile: e.target.files[0] });
      // console.log(e.target.files[0])
      // console.log(formData)
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("imageFile", formData.imageFile); // Append the image file
    formDataToSend.append("projectId", projectId);

    try {
      const response = await fetch("/api/projects/extraData/create", {
        method: "POST",
        body: formDataToSend,
        cache: "no-store",
        next: { revalidate: 30 },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Project data added:', data);
        toast.success("Project Data Added");
        setFormData({ title: "", description: "", imageFile: null }); // Reset the form
        fetchProjectData();
      } else {
        toast.error("Failed to add project data");
      }
    } catch (error) {
      // console.error('Error adding project data:', error);
      toast.error("Failed to add project data");
    }
  };

  const handleDeleteData = async (dataId) => {
    // console.log("deleting...", dataId);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project data?"
    );

    if (confirmDelete) {
      try {
        const deleteResponse = await fetch(`/api/projects/extraData/delete`, {
          method: "POST",
          body: JSON.stringify({ dataId }),
        });

        if (deleteResponse.status === 200) {
          toast.success("Project data deleted");
          fetchProjectData();
        } else {
          fetchProjectData();
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error("Failed to delete project data");
      }
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Add more project details</h2>
      <form className="my-8">
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          {/* <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
            rows="4"
            required
          /> */}

          <JoditEditor
            value={formData.description}
            tabIndex={1} // tabIndex of textarea
            onBlur={(description) =>
              setFormData((prevData) => ({
                ...prevData,
                description: description,
              }))
            }
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-gray-700"
          >
            Image Upload
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleChange}
            className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bottom-10 right-10 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Add Project Data
        </button>
      </form>
      <div>
        <div className="grid grid-cols-3 justify-start items-start gap-5">
          {projectData &&
            projectData.map((data) => (
              <div
                className="border p-4 mb-4 flex flex-col justify-center items-center"
                key={data.id}
              >
                <Image
                  src={data.imageUrl}
                  height={100}
                  width={200}
                  quality={100}
                  className="h-[150px] w-auto object-cover className="
                  alt=""
                />
                <h3 className="text-lg font-semibold mt-2 ">{data.title}</h3>
                <p
                  className="text-sm text-gray-600 mb-2 line-clamp-1"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
                <div className="flex gap-2 justify-between items-center w-full">
                  <EditProjectExtraData
                    projectExtraDataId={data.id}
                    fetchProjects={fetchProjectData}
                  />
                  <button
                    onClick={(e) => handleDeleteData(data.id)}
                    className="bg-red-500 text-white px-4 py-2 w-full rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AddProjectData;
