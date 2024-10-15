// components/ProjectForm.js
import { useState } from 'react';

const ProjectForm = ({ formData, handleChange }) => {
  return (
    <div>
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
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
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description:</label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none resize-none h-[250px]"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">Long Description:</label>
        <textarea
          id="longDescription"
          name="longDescription"
          value={formData.longDescription}
          onChange={handleChange}
          className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none resize-none h-[250px]"
        />
      </div>
    </div>
  );
};

export default ProjectForm;
