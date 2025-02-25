import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePlaces = ({ token }) => {
    const [places, setPlaces] = useState([]);
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        category: 'ATTRACTION',
        city: { id: '' },
        latitude: '',
        longitude: '',
    });
    const [editing, setEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPlaces();
        fetchCities();
    }, [token]);

    const fetchPlaces = () => {
        axios
            .get('http://localhost:8081/admin/places', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setPlaces(res.data))
            .catch((err) => console.error(err));
    };

    const fetchCities = () => {
        axios
            .get('http://localhost:8081/admin/cities', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCities(res.data))
            .catch((err) => console.error(err));
    };

    const handleChange = (e) => {
        if (e.target.name === 'cityId') {
            setFormData({ ...formData, city: { id: e.target.value } });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            axios
                .put(`http://localhost:8081/admin/places/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    fetchPlaces();
                    setFormData({
                        id: null,
                        name: '',
                        category: 'ATTRACTION',
                        city: { id: '' },
                        latitude: '',
                        longitude: '',
                    });
                    setEditing(false);
                    setShowForm(false);
                })
                .catch((err) => console.error(err));
        } else {
            axios
                .post('http://localhost:8081/admin/places', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    fetchPlaces();
                    setFormData({
                        id: null,
                        name: '',
                        category: 'ATTRACTION',
                        city: { id: '' },
                        latitude: '',
                        longitude: '',
                    });
                    setShowForm(false);
                })
                .catch((err) => console.error(err));
        }
    };

    const handleEdit = (place) => {
        setEditing(true);
        setFormData({
            id: place.id,
            name: place.name,
            category: place.category,
            city: { id: place.city ? place.city.id : '' },
            latitude: place.latitude,
            longitude: place.longitude,
        });
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this place?')) {
            axios
                .delete(`http://localhost:8081/admin/places/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(fetchPlaces)
                .catch((err) => console.error(err));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-4xl">
                <h3 className="text-2xl font-bold mb-6">Manage Places</h3>

                {/* Add Place Button */}
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition duration-300 mb-6"
                    >
                        Add Place
                    </button>
                )}

                {/* Place Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Place Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter place name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Category:
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="ATTRACTION">Attraction</option>
                                <option value="HOTEL">Hotel</option>
                                <option value="RESTAURANT">Restaurant</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                City:
                            </label>
                            <select
                                name="cityId"
                                value={formData.city.id}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Latitude:
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                placeholder="Enter latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Longitude:
                            </label>
                            <input
                                type="number"
                                step="any"
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
                                {editing ? 'Update Place' : 'Add Place'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setFormData({
                                        id: null,
                                        name: '',
                                        category: 'ATTRACTION',
                                        city: { id: '' },
                                        latitude: '',
                                        longitude: '',
                                    });
                                    setShowForm(false);
                                }}
                                className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-4 py-2 rounded-md shadow-sm transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Place List */}
                <ul className="space-y-2">
                    {places.map((place) => (
                        <li
                            key={place.id}
                            className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
                        >
              <span className="text-gray-700">
                {place.name} - {place.category} in{' '}
                  {place.city ? place.city.name : 'Unknown'} (
                  {place.latitude}, {place.longitude})
              </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(place)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1 rounded-md shadow-sm transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(place.id)}
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

export default ManagePlaces;
