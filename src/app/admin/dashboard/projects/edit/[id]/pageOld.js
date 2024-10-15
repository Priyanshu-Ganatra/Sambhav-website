"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ProjectLogoUpload from "./components/logoUpload";
import ImageUpload from "./components/imageUpload";
import ProjectImage from "./components/projectImage";
import AddProjectDataForm from "./components/addProjectExtraData";
import ProjectBldgImageUpload from "./components/buildingImageUpdate";
import ResidentialAmenities from "./components/amenities";
import CenterImageUpload from "./components/centerImage";
import AmenityImage from "./components/amenityImage";

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

    type: "",
    status: "",
    addressLine1: "",
    addressLine2: "",
    street: "",
    landmark: "",
    city: "",
    state: "",

    shortDescription: "",
    longDescription: "",
    logoChanged: false,
    projectImages: {},
    amenityImage: [],
  });
  const [projectImages, setProjectImages] = useState([]);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/get?id=${id}`);
      const data = await response.json();
      setProject(data);
      console.log({ data });
      setFormData({
        ...data,
      });
      setProjectImages(data.projectImages);
    } catch (error) {
      console.error("Error fetching project:", error);
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
      console.error("Error updating project:", error);
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
      console.error("Error updating project:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];
    const imageData = new FormData();
    imageData.append("projectId", id);
    imageData.append("imageFile", imageFile);
    imageData.append("imageUrl", URL.createObjectURL(imageFile));
    console.log(imageFile);
    try {
      const response = await fetch("/api/projects/images/add", {
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
          if (data) {
            setProjectImages((prevImages) => [
              ...prevImages,
              {
                id: data.addedImageData.id,
                imageUrl: data.addedImageData.imageUrl,
                projectId: data.addedImageData.projectId,
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
      console.error("Error deleting image:", error);
    }
  };

  const handleAmenityImageChange = async (e) => {
    const amenityImage = e.target.files[0];
    const imageData = new FormData();
    imageData.append("projectId", id);
    imageData.append("amenityImage", amenityImage);
    imageData.append("imageUrl", URL.createObjectURL(amenityImage));
    try {
      const response = await fetch("/api/projects/amenityImage/add", {
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
          if (data) {
            fetchProject();
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
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="flex justify-center items-center gap-5 ">
              <ProjectLogoUpload
                logoUrl={formData.logoUrl}
                handleLogoChange={handleLogoChange}
              />
              <ProjectBldgImageUpload
                buildingImageUrl={formData.buildingImageUrl}
                handleBuildingImageChange={handleBuildingImageChange}
              />
              <CenterImageUpload
                imageUrl={formData.centerImage}
                imageChange={handleCenterImageChange}
                imageDelete={handleCenterImageDelete}
              />
            </div>
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
                htmlFor="name"
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
                htmlFor="name"
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
                htmlFor="name"
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

            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 1:
              </label>
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
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 2:
              </label>
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
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Street:
              </label>
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
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Landmark:
              </label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="name"
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

            <div className="mb-6">
              <label
                htmlFor="name"
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

            <div className="mb-6">
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Short Description:
              </label>
              <input
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="longDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Long Description:
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none resize-none h-[250px]"
              />
            </div>
            <button
              type="submit"
              className={`bottom-10 right-10 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
      <div>
        <ImageUpload handleImageChange={handleImageChange} />
        <div className="grid grid-cols-6 items-center justify-center gap-5 my-10">
          {projectImages.map((image, index) => (
            <ProjectImage
              key={image.id}
              image={image}
              handleDeleteImage={handleDeleteImage}
            />
          ))}
        </div>
      </div>
      <AddProjectDataForm
        fetchProjectData={fetchProject}
        projectData={project.projectData}
        projectId={id}
      />
      {/* <ResidentialAmenities projectId={id} data={project.amenities} /> */}
      <AmenityImage
        handleAmenityImageChange={handleAmenityImageChange}
        images={project.amenityImage}
        handleDeleteAmenityImage={handleDeleteAmenityImage}
      />
    </div>
  );
};

export default EditProjectPage;
