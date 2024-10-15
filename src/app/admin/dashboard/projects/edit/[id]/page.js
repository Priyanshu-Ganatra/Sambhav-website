"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ProjectLogoUpload from "./components/logoUpload";
import ImageUpload from "./components/imageUpload";
import ProjectImage from "./components/projectImage";
import AddProjectData from "./components/addProjectExtraData";
import ProjectBldgImageUpload from "./components/buildingImageUpdate";
import CenterImageUpload from "./components/centerImage";
import BuildingHover from "./components/buildingHover";
import AmenityImage from "./components/amenityImage";
import JoditEditor from "jodit-react";

const EditProjectPage = ({ params }) => {
  const id = params.id;
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    logo: null,
    logoUrl: "",
    name: "",

    buildingName: "",
    buildingImageUrl: "",
    centerImage: "",
    buildingHoverImage: "",

    type: "",
    status: "",
    addressLine1: "",
    addressLine2: "",
    street: "",
    landmark: "",
    city: "",
    state: "",

    tagLine: "",
    shortDescription: "",
    longDescription: "",
    logoChanged: false,
    projectImages: {},
    amenityImage: [],
  });
  const [projectImages, setProjectImages] = useState([]);

  const fetchProject = useCallback(async () => {
    try {
      console.log('fetchProject')

      const response = await fetch(`/api/projects/get?id=${id}`, {
        cache: "no-store",
        next: { revalidate: 10 },
      });
      const data = await response.json();
      setProject(data);
      // console.log(data)
      setFormData({
        ...data,
      });
      setProjectImages(data.projectImages);
    } catch (error) {
      // console.error('Error fetching project:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [fetchProject, id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      logo: e.target.files[0],
      logoUrl: URL.createObjectURL(file),
      logoChanged: true,
    });
    const payloadData = new FormData();
    payloadData.append("id", id);
    payloadData.append("logo", file);
    try {
      const response = await fetch(`/api/projects/update/logo`, {
        method: "POST",
        body: payloadData,
      });
      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
        }));
        toast.success("Project logo Updated");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      // console.error('Error updating project:', error);
      toast.error("Something went wrong!");
    }
  };

  const handleBuildingImageChange = async (e) => {
    const file = e.target.files[0];
    const payloadData = new FormData();
    payloadData.append("id", id);
    payloadData.append("buildingImage", file);
    try {
      const response = await fetch(`/api/projects/update/buildingImage`, {
        method: "POST",
        body: payloadData,
      });
      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
          buildingImageUrl: URL.createObjectURL(file),
        }));
        toast.success("Project logo Updated");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      // console.error('Error updating project:', error);
      toast.error("Something went wrong!");
    }
  };

  const handleImageChange = async (e) => {
    const images = e.target.files; // Get all selected files

    const imageData = new FormData();
    imageData.append("projectId", id);
    if (images.length > 15) {
      toast.error("You can only select upto 15 images at a time.");
      return;
    }
    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i];
      imageData.append(`imageFile${i}`, imageFile);
      imageData.append(`imageUrl${i}`, URL.createObjectURL(imageFile));
    }

    try {
      const response = await fetch("/api/projects/images/add", {
        method: "POST",
        body: imageData,
      });

      if (!response.ok) {
        toast.error("Failed to upload image.");
      } else {
        const data = await response.json();
        if (data.status === 200) {
          toast.success("Images Uploaded Successfully.");
          if (data.addedImageData) {
            const newImages = data.addedImageData.map((image) => ({
              id: image.id,
              imageUrl: image.imageUrl,
              projectId: image.projectId,
            }));
            setProjectImages((prevImages) => [...prevImages, ...newImages]);
          } else {
            toast.error("Something went wrong!");
          }
        } else {
          if (data.error) {
            toast.error("Error:", data.error);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    } catch (error) {
      toast.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = async (imageIdStr) => {
    const imageId = parseInt(imageIdStr);
    try {
      const response = await fetch(`/api/projects/images/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId }),
      });

      if (response.ok) {
        setProjectImages(projectImages.filter((image) => image.id !== imageId));
        toast.success("Image deleted successfully");
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Error deleting image");
      // console.error('Error deleting image:', error);
    }
  };

  const handleAmenityImageChange = async (e) => {
    const images = e.target.files; // Get all selected files

    const imageData = new FormData();

    if (images.length > 6) {
      toast.error("Please select up to 6 images.");
      return;
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      imageData.append(`amenityImage${i}`, image); // Append each image with a unique key
    }

    imageData.append("projectId", id);

    try {
      const response = await fetch("/api/projects/amenityImage/add", {
        method: "POST",
        body: imageData,
      });

      if (!response.ok) {
        toast.error("Failed to upload image.");
      } else {
        const data = await response.json();
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Image Uploaded Successfully.");
          fetchProject();
        }
      }
    } catch (error) {
      toast.error("Error uploading image:", error);
    }
  };

  const handleDeleteAmenityImage = async (imageIdStr) => {
    const imageId = parseInt(imageIdStr);
    try {
      const response = await fetch(`/api/projects/amenityImage/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId }),
      });

      if (response.ok) {
        console.log(response);
        setProjectImages(projectImages.filter((image) => image.id !== imageId));
        toast.success("Image deleted successfully");
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Error deleting image");
      console.error("Error deleting image:", error);
    }
  };

  const handleCenterImageChange = async (e) => {
    const imageFile = e.target.files[0];
    const imageData = new FormData();
    imageData.append("id", id);
    imageData.append("centerImage", imageFile);
    imageData.append("imageUrl", URL.createObjectURL(imageFile));
    console.log(imageFile);
    try {
      const response = await fetch("/api/projects/images/centerImage/add", {
        method: "POST",
        body: imageData,
      });
      console.log(response);
      if (!response.ok) {
        toast.error("Failed to upload image.");
      } else {
        const data = await response.json();
        console.log(data);
        if ((data.status = "200")) {
          toast.success("Image Uploaded Successfully.");
          fetchProject();
          if (data) {
            setProjectImages((prevImages) => [
              ...prevImages,
              {
                id: data.body.id,
                centerImage: data.body.centerImage,
              },
            ]);
          } else {
            toast.error("Something went wrong!");
          }
        } else {
          if (data.error) {
            toast.error("Error:", data.error);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    } catch (error) {
      toast.error("Error uploading image:", error);
    }
  };

  const handleCenterImageDelete = async (e) => {
    try {
      const response = await fetch("/api/projects/images/centerImage/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      console.log(response);
      if (!response.ok) {
        toast.error("Failed to delete image.");
      } else {
        const data = await response.json();
        console.log(data);
        if ((data.status = "200")) {
          toast.success("Image deleted Successfully.");
          fetchProject();
          if (data) {
            setProjectImages((prevImages) => [
              ...prevImages,
              {
                centerImage: "",
              },
            ]);
          } else {
            toast.error("Something went wrong!");
          }
        } else {
          if (data.error) {
            toast.error("Error:", data.error);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    } catch (error) {
      toast.error("Error uploading image:", error);
    }
  };

  const handleBuildingHoverImageChange = async (e) => {
    const imageFile = e.target.files[0];
    const imageData = new FormData();
    imageData.append("id", id);
    imageData.append("buildingHoverImage", imageFile);
    console.log(imageFile);
    try {
      const response = await fetch(
        "/api/projects/images/buildingHoverImage/add",
        {
          method: "POST",
          body: imageData,
        }
      );
      console.log(response);
      if (!response.ok) {
        toast.error("Failed to upload image.");
      } else {
        const data = await response.json();
        console.log(data);
        if ((data.status = "200")) {
          fetchProject();
          if (data) {
            toast.success("Image Uploaded Successfully.");
            setFormData((prevData) => ({
              ...prevData,
              buildingHoverImage: data.body.buildingHoverImage,
            }));
          } else {
            toast.error("Something went wrong!");
          }
        } else {
          if (data.error) {
            toast.error("Error:", data.error);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    } catch (error) {
      toast.error("Error uploading image:", error);
    }
  };

  const handleBuildingHoverImageDelete = async (e) => {
    try {
      const response = await fetch(
        "/api/projects/images/buildingHoverImage/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      console.log(response);
      if (!response.ok) {
        toast.error("Failed to delete image.");
      } else {
        const data = await response.json();
        console.log(data);
        if ((data.status = "200")) {
          toast.success("Image deleted Successfully.");
          fetchProject();
          if (data) {
            setFormData((prevData) => ({
              ...prevData,
              buildingHoverImage: "",
            }));
          } else {
            toast.error("Something went wrong!");
          }
        } else {
          if (data.error) {
            toast.error("Error:", data.error);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    } catch (error) {
      toast.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payloadData = new FormData();
    payloadData.append("id", id);
    payloadData.append("name", formData.name);

    payloadData.append("buildingName", formData.buildingName);
    payloadData.append("type", formData.type);
    payloadData.append("status", formData.status);

    payloadData.append("addressLine1", formData.addressLine1);
    payloadData.append("addressLine2", formData.addressLine2);
    payloadData.append("street", formData.street);
    payloadData.append("landmark", formData.landmark);
    payloadData.append("city", formData.city);
    payloadData.append("state", formData.state);

    payloadData.append("tagLine", formData.tagLine);
    payloadData.append("shortDescription", formData.shortDescription);
    payloadData.append("longDescription", formData.longDescription);

    try {
      const response = await fetch(`/api/projects/update`, {
        method: "POST",
        body: payloadData,
      });
      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
          logoChanged: false,
        }));
        toast.success("Project updated");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Something went wrong!");
    }
  };

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Edit Project</h1>

      <div className="bg-gray-100 className= p-4">
        <h2 className="text-sm font-semibold mb-2">Important Notes:</h2>

        <ul className="list-disc pl-5 mb-2 text-xs">
          <li className="mb-1">
            Logo image and central building image are mandatory elements.
          </li>
          <li className="mb-1">
            The building image is displayed prominently on the homepage. A hover
            effect showcasing an image or GIF is optionally triggered upon mouse
            hover.
          </li>
          <li className="mb-1">
            The central image is showcased on the project page preceding the
            project description.
          </li>
          <li className="mb-1">
            Banner images are positioned at the top of the project page.
          </li>
          <li className="mb-1">
            Ensure that the banner images are positioned such that the main
            content is centered, as only that portion will be visible in the
            mobile view.
          </li>
          <li className="mb-1">
            Additional project details are conveyed through paragraphs.
          </li>
          <li className="mb-1">
            Amenity icons are displayed at the conclusion of the project
            presentation.
          </li>
          <li className="mb-1">
            Do not delete any images from the public folder.
          </li>
        </ul>
      </div>

      <hr className="my-10 border-t-2 border-gray-600" />

      <div className="grid grid-cols-2 gap-1">
        <ProjectLogoUpload
          logoUrl={formData.logoUrl}
          handleLogoChange={handleLogoChange}
        />
        <CenterImageUpload
          imageUrl={formData.centerImage}
          imageChange={handleCenterImageChange}
          imageDelete={handleCenterImageDelete}
        />
        <ProjectBldgImageUpload
          buildingImageUrl={formData.buildingImageUrl}
          handleBuildingImageChange={handleBuildingImageChange}
        />
        <BuildingHover
          imageUrl={formData.buildingHoverImage}
          hoverImageChange={handleBuildingHoverImageChange}
          imageDelete={handleBuildingHoverImageDelete}
        />
      </div>
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <hr className="my-10 border-t-2 border-gray-600" />
            <div className="space-y-6 ">
              <div className="w-full grid grid-cols-2 gap-6">
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="buildingName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Building Name:
                  </label>
                  <input
                    type="text"
                    id="buildingName"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type:
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status:
                  </label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="w-full">
                  <div className="mb-6">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City:
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="mb-6">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State:
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* <div className="w-full md:w-1/2">
                 <div className="mb-6">
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address Line 1:</label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">Address Line 2:</label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street:</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark:</label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div> */}
              {/* <div className="mb-6">
                <label htmlFor="tagLine" className="block text-sm font-medium text-gray-700">Tag Line:</label>
                <input
                id="tagLine"
                name="tagLine"
                value={formData.tagLine}
                onChange={handleChange}
                className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div> */}
              <div className="mb-6">
                <label
                  htmlFor="shortDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Short Description:
                </label>
                {/* <input
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                /> */}
                <JoditEditor
                  value={formData.shortDescription}
                  tabIndex={1}
                  onBlur={(description) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      shortDescription: description,
                    }))
                  }
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="longDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Long Description:
                </label>
                {/* <textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none resize-none h-[250px]"
                /> */}

                <JoditEditor
                  value={formData.longDescription}
                  tabIndex={1}
                  onBlur={(description) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      longDescription: description,
                    }))
                  }
                />
              </div>
              <button
                type="submit"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
      <hr className="my-10 border-t-2 border-gray-600" />

      <div>
        <ImageUpload handleImageChange={handleImageChange} />
        <div className="grid grid-cols-6 items-center justify-center gap-5">
          {projectImages &&
            projectImages.map((image, index) => (
              <ProjectImage
                key={image.id}
                image={image}
                handleDeleteImage={handleDeleteImage}
              />
            ))}
        </div>
      </div>

      <hr className="my-10 border-t-2 border-gray-600" />

      <AddProjectData
        fetchProjectData={fetchProject}
        projectData={project.projectData}
        projectId={id}
      />

      <hr className="my-10 border-t-2 border-gray-600" />

      <AmenityImage
        handleAmenityImageChange={handleAmenityImageChange}
        images={project.amenityImage}
        handleDeleteAmenityImage={handleDeleteAmenityImage}
      />
    </div>
  );
};

export default EditProjectPage;

export const dynamic = "force-dynamic";
export const revalidate = 0;
