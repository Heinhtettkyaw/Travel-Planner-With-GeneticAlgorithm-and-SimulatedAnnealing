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
            axios.put(`http://localhost:8081/admin/cities/${formData.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    fetchCities();
                    setFormData({ id: null, name: '', latitude: '', longitude: '' });
                    setEditing(false);
                })
                .catch(err => console.error(err));
        } else {
            axios.post('http://localhost:8081/admin/cities', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    fetchCities();
                    setFormData({ id: null, name: '', latitude: '', longitude: '' });
                })
                .catch(err => console.error(err));
        }
    };

    const handleEdit = (city) => {
        setEditing(true);
        setFormData({ id: city.id, name: city.name, latitude: city.latitude, longitude: city.longitude });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8081/admin/cities/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(fetchCities)
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h3>Manage Cities</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="City Name" value={formData.name} onChange={handleChange} required />
                <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required />
                <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required />
                <button type="submit">{editing ? 'Update City' : 'Add City'}</button>
                {editing && <button type="button" onClick={() => { setEditing(false); setFormData({ id: null, name: '', latitude: '', longitude: '' }); }}>Cancel</button>}
            </form>
            <ul>
                {cities.map(city => (
                    <li key={city.id}>
                        {city.name} - ({city.latitude}, {city.longitude})
                        <button onClick={() => handleEdit(city)}>Edit</button>
                        <button onClick={() => handleDelete(city.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageCities;
