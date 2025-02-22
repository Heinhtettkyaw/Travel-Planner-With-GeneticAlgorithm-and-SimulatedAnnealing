import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewTrips = ({ token }) => {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isSearchMode, setIsSearchMode] = useState(false);

    useEffect(() => {
        fetchTrips(0);
    }, [token]);

    // Fetch trips (either all trips or search results) with pagination
    const fetchTrips = (page = 0) => {
        setLoading(true);
        let url = '';
        if (isSearchMode) {
            url = `http://localhost:8081/admin/trips/search?query=${encodeURIComponent(searchTerm)}&page=${page}&size=25`;
        } else {
            url = `http://localhost:8081/admin/trips?page=${page}&size=25`;
        }
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                // Expecting a response with keys: trips, currentPage, totalPages, totalItems
                setTrips(response.data.trips);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setError('');
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    'Error fetching trips:',
                    error.response ? error.response.data : error.message
                );
                setError(
                    error.response ? error.response.data.message : 'An unknown error occurred'
                );
                setLoading(false);
            });
    };

    // Handle search button click: switch to search mode and fetch page 0 of search results
    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        setIsSearchMode(true);
        fetchTrips(0);
    };

    // Handle All Trips button: exit search mode and fetch page 0 of all trips
    const handleAllTrips = () => {
        setSearchTerm('');
        setIsSearchMode(false);
        fetchTrips(0);
    };

    // Pagination navigation: previous and next pages
    const handlePrevPage = () => {
        if (currentPage > 0) {
            fetchTrips(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            fetchTrips(currentPage + 1);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
            {/* Page Title */}
            <h2 className="text-2xl font-bold text-blue-700 mb-4">View All Trips</h2>

            {/* Search Section */}
            <div className="mb-4 flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by username or city"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                >
                    Search
                </button>
                <button
                    onClick={handleAllTrips}
                    className="bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2"
                >
                    All Trips
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-center text-red-500 font-semibold mt-8">
                    {error}
                </div>
            )}

            {/* Loading / No Results / Trips Table */}
            {loading ? (
                <div className="text-center text-gray-600 font-medium mt-8">
                    Loading trips...
                </div>
            ) : trips.length === 0 ? (
                <div className="text-center text-gray-600 font-medium mt-8">
                    No trips found matching your search criteria.
                </div>
            ) : (
                <>
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                Trip ID
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                Trip Name
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                Start Date
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                End Date
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                City
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                Planned By
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {trips.map((trip) => (
                            <tr
                                key={trip.id}
                                className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                            >
                                <td className="py-3 px-4 text-sm text-gray-700">{trip.id}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{trip.tripName}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{trip.startDate}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{trip.endDate}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{trip.cityName}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{trip.username}</td>
                                <td className="py-3 px-4 text-sm">
                                    <Link
                                        to={`/admin/review/trip/${trip.id}`}
                                        className="text-blue-500 hover:text-blue-700 underline"
                                    >
                                        Review
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center mt-4 gap-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewTrips;
