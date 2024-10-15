"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' instead of 'next/router'
import { toast } from 'react-toastify';

const CreateBlogPage = () => {
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Blog created successfully');
        router.push('/admin/dashboard/blogs');
      } else {
        toast.error('Failed to create blog');
      }
    } catch (error) {
      toast.error('Failed to create blog');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Create Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-1">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            placeholder="Enter blog title"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-semibold mb-1">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            placeholder="Enter blog content"
          ></textarea>
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-semibold mb-1">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            placeholder="Enter author name"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Create Blog</button>
      </form>
    </div>
  );
};

export default CreateBlogPage;