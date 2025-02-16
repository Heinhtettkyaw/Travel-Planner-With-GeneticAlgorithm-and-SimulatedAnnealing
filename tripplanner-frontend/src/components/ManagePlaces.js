import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePlaces = ({ token }) => {
    const [places, setPlaces] = useState([]);
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({ id: null, name: '', category: 'ATTRACTION', cityId: '', latitude: '', longitude: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchPlaces();
        fetchCities();
    }, [token]);

    const fetchPlaces = () => {
        axios.get('http://localhost:8081/admin/places', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setPlaces(res.data))
            .catch(err => console.error(err));
    };

    const fetchCities = () => {
        axios.get('http://localhost:8081/admin/cities', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setCities(res.data))
            .catch(err => console.error(err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            axios.put(`http://localhost:8081/admin/places/${formData.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    fetchPlaces();
                    setFormData({ id: null, name: '', category: 'ATTRACTION', cityId: '', latitude: '', longitude: '' });
                    setEditing(false);
                })
                .catch(err => console.error(err));
        } else {
            axios.post('http://localhost:8081/admin/places', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    fetchPlaces();
                    setFormData({ id: null, name: '', category: 'ATTRACTION', cityId: '', latitude: '', longitude: '' });
                })
                .catch(err => console.error(err));
        }
    };

    const handleEdit = (place) => {
        setEditing(true);
        setFormData({
            id: place.id,
            name: place.name,
            category: place.category,
            cityId: place.city ? place.city.id : '',
            latitude: place.latitude,
            longitude: place.longitude,
        });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8081/admin/places/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(fetchPlaces)
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h3>Manage Places</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Place Name" value={formData.name} onChange={handleChange} required />
                <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="HOTEL">HOTEL</option>
                    <option value="RESTAURANT">RESTAURANT</option>
                    <option value="ATTRACTION">ATTRACTION</option>
                </select>
                <select name="cityId" value={formData.cityId} onChange={handleChange} required>
                    <option value="">Select City</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
                <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required />
                <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required />
                <button type="submit">{editing ? 'Update Place' : 'Add Place'}</button>
                {editing && <button type="button" onClick={() => { setEditing(false); setFormData({ id: null, name: '', category: 'ATTRACTION', cityId: '', latitude: '', longitude: '' }); }}>Cancel</button>}
            </form>
            <ul>
                {places.map(place => (
                    <li key={place.id}>
                        {place.name} - {place.category} in {place.city ? place.city.name : 'Unknown'} ({place.latitude}, {place.longitude})
                        <button onClick={() => handleEdit(place)}>Edit</button>
                        <button onClick={() => handleDelete(place.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManagePlaces;
