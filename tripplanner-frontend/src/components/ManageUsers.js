import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    // Fetch all users when the component is mounted
    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = () => {
        axios.get('http://localhost:8081/admin/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
            });
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`http://localhost:8081/admin/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                alert('User deleted successfully');
                fetchUsers(); // Re-fetch users after deletion
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
                setError('Failed to delete user');
            });
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">View Users</h2>
            {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
            <table className="min-w-full table-auto">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2">ID</th>
                    <th className="py-2">Username</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    {/*<th className="px-4 py-2">Action</th>*/}
                </tr>
                </thead>
                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="text-center p-4">No users found</td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="px-6 py-2">{user.id}</td>
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.role}</td>
                            {/*<td className="px-4 py-2">*/}
                            {/*    <button*/}
                            {/*        className="bg-red-500 text-white px-4 py-2 rounded-md"*/}
                            {/*        onClick={() => handleDeleteUser(user.id)}*/}
                            {/*    >*/}
                            {/*        Delete*/}
                            {/*    </button>*/}
                            {/*</td>*/}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
