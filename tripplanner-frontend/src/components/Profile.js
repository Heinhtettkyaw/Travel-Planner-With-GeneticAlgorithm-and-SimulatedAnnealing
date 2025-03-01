import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [tab, setTab] = useState('edit');
    const [userData, setUserData] = useState(null);
    const [editData, setEditData] = useState({});
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8081/auth/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = response.data;
            setUserData(data);
            setEditData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:8081/auth/profile/update', editData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Profile updated successfully');
            fetchUserProfile();
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validate new password: at least 6 characters, 1 capital letter, and 1 number
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(passwordData.newPassword)) {
            alert("Password must be at least 6 characters long, contain at least one capital letter and one number.");
            return;
        }

        // Ensure new password and confirm password match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        try {
            await axios.post('http://localhost:8081/auth/profile/change-password', passwordData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Password changed successfully');
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-200 flex flex-col justify-between py-4 border-r border-gray-300">
                <div className="space-y-2 px-4">
                    <h3 className="text-lg font-bold mb-4">Profile</h3>
                    <button
                        onClick={() => setTab('edit')}
                        className={`py-2 px-4 rounded-md text-left w-full ${
                            tab === 'edit' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                        }`}
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setTab('password')}
                        className={`py-2 px-4 rounded-md text-left w-full ${
                            tab === 'password' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                        }`}
                    >
                        Change Password
                    </button>
                </div>
                <div className="mt-auto px-4">
                    <p className="text-sm text-gray-600 text-center">&copy; 2023 Your App Name</p>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {tab === 'edit' && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={editData.fullName || ''}
                            onChange={(e) =>
                                setEditData({ ...editData, fullName: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editData.email || ''}
                            onChange={(e) =>
                                setEditData({ ...editData, email: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={editData.phone || ''}
                            onChange={(e) =>
                                setEditData({ ...editData, phone: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <select
                            value={editData.gender || ''}
                            onChange={(e) =>
                                setEditData({ ...editData, gender: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled hidden>
                                Select Gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
                {tab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold">Change Password</h2>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={passwordData.oldPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, oldPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Change Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
