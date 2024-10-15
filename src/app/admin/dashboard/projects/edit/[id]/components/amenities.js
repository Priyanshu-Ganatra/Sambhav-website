"use client"
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ResidentialAmenities = ({projectId , data}) => {
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [formData, setFormData] = useState({
        amenity: '',
    });
    const amenityOptions = [
        "Swimming Pool",
        "Gym",
        "Playground",
        "Clubhouse",
        "Tennis Court",
        "Basketball Court",
        "BBQ Area",
        "Garden",
        "Spa",
        "Sauna",
        "Movie Theater",
        "Dog Park",
        "Yoga Studio",
        "Library",
        "Business Center",
        "Fitness Center",
        "Game Room",
        "Roof Deck",
        "Concierge Service",
        "Valet Parking",
    ].filter(option => !amenitiesList.some(item => item.amenity === option));

    useEffect(() => {
        fetchAmenitiesList();
    }, []);

    const fetchAmenitiesList = async () => {
        setAmenitiesList(data)
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddAmenity = async () => {
        try {
            const response = await fetch('/api/projects/amenity/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amenity: formData.amenity,
                    projectId
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setFormData({ amenity: '' });
                fetchAmenitiesList();
                toast.success('Amenity added successfully');
            } else {
                toast.error(data.error || 'Failed to add amenity');
            }
        } catch (error) {
            // console.error('Error adding amenity:', error);
            toast.error('Failed to add amenity');
        }
    };

    const handleDeleteAmenity = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this amenity?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/projects/amenity/delete?id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                setAmenitiesList(amenitiesList.filter((item) => item.id !== id));
                toast.success('Amenity deleted successfully');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete amenity');
            }
        } catch (error) {
            // console.error('Error deleting amenity:', error);
            toast.error('Failed to delete amenity');
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="px-5 md:px-40 mx-auto">
                <h1 className="text-2xl font-bold mb-4">Residential Building Amenities</h1>
                <ul>
                    {amenitiesList.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-2 border-b">
                            <div>
                                <h2 className="font-semibold">{item.amenity}</h2>
                                <p>{item.description}</p>
                            </div>
                            <button onClick={() => handleDeleteAmenity(item.id)} className="text-red-500 ml-2">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="px-5 md:px-40 mx-auto mt-8">
                <h2 className="text-lg font-semibold mb-4">Add New Amenity</h2>
                <div className="flex items-center">
                    <select
                        name="amenity"
                        value={formData.amenity}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-2 mr-2 flex-1"
                    >
                        <option value="">Select Amenity</option>
                        {amenityOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddAmenity} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add</button>
                </div>
            </div>
        </div>
    );
};

export default ResidentialAmenities;
