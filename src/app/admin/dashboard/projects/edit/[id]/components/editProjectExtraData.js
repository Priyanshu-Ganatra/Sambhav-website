import JoditEditor from 'jodit-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const EditProjectExtraData = ({ projectExtraDataId, fetchProjects }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageFile: null
    });
    const [buttonClicked, setButtonClicked] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const fetchProjectExtraData = async () => {
        try {
            const response = await fetch(`/api/projects/extraData/get?id=${projectExtraDataId}`, { cache: 'no-store', next: { revalidate: 10 } });
            if (response.ok) {
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data.body);
                }
            } else {
                toast.error('Failed to fetch project data');
            }
        } catch (error) {
            // console.error('Error fetching project:', error);
            toast.error('Failed to fetch project data');
        }
    }

    useEffect(() => {
        fetchProjectExtraData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        setFormData({
            ...formData,
            imageFile: file // Update the imageFile in formData
        });
        // console.log(file)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonClicked(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('id', projectExtraDataId);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('projectId', formData.projectId);
            if (formData.imageFile) {
                formDataToSend.append('imageFile', formData.imageFile);
            }

            const response = await fetch('/api/projects/extraData/update', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {

                toast.success('Project data updated successfully');
                fetchProjectExtraData();
                fetchProjects();
                setEditDialogOpen(false); // Close edit dialog after successful update
            } else {
                toast.error('Failed to update project data');
            }
        } catch (error) {
            // console.error('Error updating project data:', error);
            toast.error('Failed to update project data');
        }
    };

    const renderForm = () => {
        if (!formData) {
            return <p>No data found.</p>;
        }

        return (
            <form className="my-8" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
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
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
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
                        onBlur={(description) => setFormData(prevData => ({ ...prevData, description: description }))}
                    />

                </div>
                <div className="mb-4">
                    <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Image Upload</label>
                    <input
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        onChange={handleImageChange}
                        className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div className="flex justify-between ">
                    <button type="submit" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Update Project Data</button>
                    <button onClick={() => setEditDialogOpen(false)} className="ml-4 inline-block px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-900">Close</button> {/* Close button */}
                </div>
            </form>
        );
    };

    const handleEditButtonClick = () => {
        setEditDialogOpen(true);
    };

    return (
        <div className='w-full'>
            <button onClick={handleEditButtonClick} className="inline-block w-full px-4 py-2 w-full rounded-md bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Edit</button>
            {buttonClicked && !formData && <p>Something went wrong!.</p>}
            {editDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 className= shadow-lg">
                        {renderForm()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProjectExtraData;
