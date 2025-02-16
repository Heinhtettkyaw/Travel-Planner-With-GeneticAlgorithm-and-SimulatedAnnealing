import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCities = ({ token }) => {
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({ id: null, name: '', latitude: '', longitude: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchCities();
    }, [token]);

    const fetchCities = () => {
        axios
            .get('http://localhost:8081/admin/cities', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCities(res.data))
            .catch((err) => console.error(err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            axios
                .put(`http://localhost:8081/admin/cities/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    fetchCities();
                    setFormData({ id: null, name: '', latitude: '', longitude: '' });
                    setEditing(false);
                })
                .catch((err) => console.error(err));
        } else {
            axios
                .post('http://localhost:8081/admin/cities', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    fetchCities();
                    setFormData({ id: null, name: '', latitude: '', longitude: '' });
                })
                .catch((err) => console.error(err));
        }
    };

    const handleEdit = (city) => {
        setEditing(true);
        setFormData({ id: city.id, name: city.name, latitude: city.latitude, longitude: city.longitude });
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8081/admin/cities/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(fetchCities)
            .catch((err) => console.error(err));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-4xl">
                <h3 className="text-2xl font-bold mb-6">Manage Cities</h3>

                {/* City Form */}
                <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter city name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Latitude:</label>
                        <input
                            type="number"
                            name="latitude"
                            placeholder="Enter latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Longitude:</label>
                        <input
                            type="number"
                            name="longitude"
                            placeholder="Enter longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                        >
                            {editing ? 'Update City' : 'Add City'}
                        </button>
                        {editing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setFormData({ id: null, name: '', latitude: '', longitude: '' });
                                }}
                                className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* City List */}
                <ul className="space-y-2">
                    {cities.map((city) => (
                        <li key={city.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm">
                            <span className="text-gray-700">
                                {city.name} - ({city.latitude}, {city.longitude})
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(city)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1 rounded-md shadow-sm transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(city.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-md shadow-sm transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageCities;