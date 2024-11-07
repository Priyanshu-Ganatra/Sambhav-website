"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const deleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("projectId", projectId);

    try {
      const response = await fetch(`/api/projects/delete`, {
        method: "POST",
        body: formData,
        cache: "no-store",
        next: { revalidate: 30 },
      });
      if (!response.ok) {
        throw new Error("Failed to delete project.");
      }

      const data = await response.json();
      if (data.status === 200) {
        fetchProjects();
        toast.success("Project deleted Successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };

  const fetchProjects = async () => {
    setIsFetchingData(true);
    try {
      const response = await fetch("/api/projects/get/all", {
        cache: "no-store",
        next: { revalidate: 10 },
      });
      const data = await response.json();
      console.log(data);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
    finally {
      setIsFetchingData(false);
    }
  };

  const updatePosition = async (
    projectId,
    newPosition,
    currentPosition,
    projectName
  ) => {
    const confirmed = confirm(
      `Are you sure you want to change position of project '${projectName}' ?`
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch("/api/projects/update/position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: projectId, newPosition, currentPosition }),
        cache: "no-store",
        next: { revalidate: 10 },
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.message)
          throw new Error(data.message);
        else
          throw new Error(data.error);
      }
      if (data.message) {
        toast.success(data.message);
        fetchProjects();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/dashboard/projects/create"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer flex gap-0"
        >
          <Image src="/icons/plus.svg" height={20} width={20} alt="plus" />
          Add Project
        </Link>
      </div>
      {
        isFetchingData && (
          <div className={`flex items-center justify-center gap-2 ${projects.length && 'mb-4'}`}>
            <div
              className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
            >
            </div>
            <p>Fetching data...</p>
          </div>
        )
      }
      {
        !projects.length && !isFetchingData && (
          <p className="text-sm">No data available, add some data and it'll be shown here.</p>
        )
      }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative ">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow-2xl rounded-md overflow-hidden pt-4 dark-theme w-full"
          >
            <Link
              href={`/admin/dashboard/projects/edit/${project.id}`}
              className="w-full"
            >
              <div className="relative overflow-hidden flex flex-col gap-0 w-full">
                <div className="flex-1 relative w-full h-full overflow-hidden m-auto">
                  <Image
                    src={project.logoUrl}
                    alt={project.name}
                    className="w-full max-h-40 object-contain"
                    width={300}
                    height={200}
                    unoptimized
                  />
                </div>
                <div className="p-4 flex-1">
                  <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
                  <p
                    className="text-sm text-gray-100 text-justify line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: project.shortDescription,
                    }}
                  ></p>
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-2">
                <button
                  title="Shift to left"
                  onClick={() =>
                    updatePosition(
                      project.id,
                      project.position - 1,
                      project.position,
                      project.name
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
                {/* {project.position} */}
                <button
                  title="Shift to Right"
                  onClick={() =>
                    updatePosition(
                      project.id,
                      project.position + 1,
                      project.position,
                      project.name
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
              </div>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-sm text-right w-full text-red-500 flex justify-end items-end"
              >
                <Image
                  src="/icons/trash_red.svg"
                  height={20}
                  width={20}
                  alt="trash"
                />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;

export const revalidate = 0;
