"use client";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blog/read', { cache: 'no-store', next: { revalidate: 10 } });
      const data = await response.json();
      setBlogs(data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const deleteBlog = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmed) return;

    try {
      const response = await fetch('/api/blog/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        cache: 'no-store', next: { revalidate: 10 }
      });
      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog.id !== id));
        toast.success('Blog deleted successfully');
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/dashboard/blogs/create" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Add Blog
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
            <p className="text-sm text-gray-700 mb-4">{blog.content.substring(0, 100)}...</p>
            <div className="flex justify-between items-center">
              <Link href={`/admin/dashboard/blogs/edit/${blog.id}`} className="text-blue-500">Edit</Link>
              <button onClick={() => deleteBlog(blog.id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
