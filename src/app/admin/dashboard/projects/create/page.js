"use client"
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    buildingName: '',
    buildingImage: '',
    type: '',
    status: '',
    addressLine1: '',
    addressLine2: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    shortDescription: '',
    longDescription: '',
    logoFile: null,
    imageFiles: [] // Initial state for multiple image files
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [fieldName]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData)
    const payloadData = new FormData();
    payloadData.append('name', formData.name);
    payloadData.append('buildingName', formData.buildingName);
    payloadData.append('buildingImage', formData.buildingImage);

    payloadData.append('type', formData.type);
    payloadData.append('status', formData.status);

    // payloadData.append('addressLine1', formData.addressLine1);
    // payloadData.append('addressLine2', formData.addressLine2);
    // payloadData.append('street', formData.street);
    // payloadData.append('landmark', formData.landmark);
    payloadData.append('city', formData.city);
    payloadData.append('state', formData.state);

    payloadData.append('location', formData.location);
    payloadData.append('shortDescription', formData.shortDescription);
    payloadData.append('longDescription', formData.longDescription);
    payloadData.append('logo', formData.logoFile);
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        body: payloadData
      });
      // console.log(response)
      if (response.ok) {
        const data = await response.json();
        // console.log('Project created:', data);
        toast.success('Project Created')
        window.location.href = "/admin/dashboard/projects"
      } else {
        if (data.error) {
          toast.error(data.error)
        }
        else {
          toast.error("Something went wrong")
        }
        // console.log(data)
      }
    } catch (error) {
      toast.error('Failed to create project')
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto my-16" encType="multipart/form-data">
      <h1 className="text-3xl font-semibold mb-8 text-center">Add New Project</h1>
      {/* Logo Upload */}
      <div className="mb-6">
        <label htmlFor="logoUrl" className="block font-semibold mb-1">Logo</label>
        <input type="file" id="logoUrl" accept=".jpg, .jpeg, .png, .webp, .gif" name="logoUrl" onChange={(e) => handleImageChange(e, 'logoFile')} className="w-full border border-gray-300 rounded-md p-2" />
      </div>
      {/* Building Image Upload */}
      <div className="mb-6">
        <label htmlFor="buildingImage" className="block font-semibold mb-1">Building Image</label>
        <input type="file" id="buildingImage" accept=".jpg, .jpeg, .png, .webp, .gif" name="buildingImage" onChange={(e) => handleImageChange(e, 'buildingImage')} className="w-full border border-gray-300 rounded-md p-2" />
      </div>
      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-6">
          <label htmlFor="name" className="block font-semibold mb-1">Project Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div className="mb-6">
          <label htmlFor="buildingName" className="block font-semibold mb-1">Building Name</label>
          <input id="buildingName" name="buildingName" value={formData.buildingName} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        {/* <div className="mb-6">
          <label htmlFor="addressLine1" className="block font-semibold mb-1">Address Line 1</label>
          <input id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div> */}
        {/* <div className="mb-6">
          <label htmlFor="addressLine2" className="block font-semibold mb-1">Address Line 2</label>
          <input id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div> */}
        {/* <div className="mb-6">
          <label htmlFor="street" className="block font-semibold mb-1">Street</label>
          <input id="street" name="street" value={formData.street} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div> */}
        {/* <div className="mb-6">
          <label htmlFor="landmark" className="block font-semibold mb-1">Landmark</label>
          <input id="landmark" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div> */}
        <div className="mb-6">
          <label htmlFor="city" className="block font-semibold mb-1">City</label>
          <input id="city" name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div className="mb-6">
          <label htmlFor="state" className="block font-semibold mb-1">State</label>
          <input id="state" name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div className="mb-6">
          <label htmlFor="type" className="block font-semibold mb-1">Type</label>
          <input id="type" name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div className="mb-6">
          <label htmlFor="status" className="block font-semibold mb-1">Status</label>
          <input id="status" name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>

      </div>
      {/* Description */}
      <div className="mb-6">
        <label htmlFor="shortDescription" className="block font-semibold mb-1">Short Description</label>
        {/* <input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" rows="3" /> */}
        <JoditEditor
          value={formData.shortDescription}
          tabIndex={1} // tabIndex of textarea
          onBlur={(description) => setFormData(prevData => ({ ...prevData, shortDescription: description }))}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="longDescription" className="block font-semibold mb-1">Long Description</label>
        {/* <textarea id="longDescription" name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" rows="6"></textarea> */}

        <JoditEditor
          value={formData.longDescription}
          tabIndex={1} // tabIndex of textarea
          onBlur={(description) => setFormData(prevData => ({ ...prevData, longDescription: description }))}
        />


      </div>
      {/* Submit Button */}
      <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Project</button>
    </form>
  );
};

export default AddProjectForm;

export const revalidate = 0