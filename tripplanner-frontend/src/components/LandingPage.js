// src/pages/LandingPage.js
import { useState, useEffect } from 'react';
import { BsPeople,BsCalendarEvent } from 'react-icons/bs';
import { BsSun, BsMoon } from 'react-icons/bs';

const LandingPage = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-bg', theme === 'light' ? '#f8f9fa' : '#1a1a1a');
        root.style.setProperty('--secondary-bg', theme === 'light' ? '#ffffff' : '#2d2d2d');
        root.style.setProperty('--text-color', theme === 'light' ? '#212529' : '#e9ecef');
        root.style.setProperty('--accent-color', '#3B82F6');
        root.style.setProperty('--error-color', '#EF4444');
        root.style.setProperty('--success-color', '#16A34A');

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <div
            className="min-h-screen transition duration-300 bg-[var(--primary-bg)]"
            style={{
                '--primary-bg': theme === 'light' ? '#f8f9fa' : '#1a1a1a',
                '--secondary-bg': theme === 'light' ? '#ffffff' : '#2d2d2d',
                '--text-color': theme === 'light' ? '#212529' : '#e9ecef'
            }}
        >
            <header className="bg-[var(--primary-bg)] shadow-md py-6 px-4">
                <div className="max-w-8xl mx-auto mr-10 ml-7 flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold  text-[var(--text-color)]">
                        <BsSun className="inline-block mr-2 text-4xl text-[var(--accent-color)]" />
                        GeoQuery
                    </h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full  text-[var(--text-color)]">
                            {theme === 'light' ? <BsSun /> : <BsMoon />}
                        </button>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-full"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main className="bg-[var(--primary-bg)] max-w-8xl mx-auto px-4 py-12">
                <section className="grid grid-cols-1 ml-10 md:grid-cols-2 gap-8 mt-12">
                    {/* Hero Section */}
                    <div>
                        <h1 className="text-5xl font-extrabold text-[var(--text-color)]">
                            Plan Your Journey <br /> With Smart Insights
                        </h1>
                        <p className="text-[var(--text-color)] 0 mt-8  max-w-md">
                            Discover personalized travel routes using real-time data and AI-powered recommendations.
                        </p>
                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="bg-[var(--accent-color)] text-white px-8 py-3 rounded-full  transition"
                            >
                                Start Planning
                            </button>
                            {/*<button*/}
                            {/*    onClick={() => window.location.href = '/'}*/}
                            {/*    className="bg-[var(--secondary-bg)] text-[var(--text-color)] border border-[var(--text-color)] px-6 py-3 rounded-full hover:bg-[var(--accent-color)] hover:text-white transition"*/}
                            {/*>*/}
                            {/*    Explore Features*/}
                            {/*</button>*/}
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div
                            className="bg-cover bg-center rounded-2xl shadow-2xl"
                            style={{
                                backgroundImage: `url('/photos/bsr-travel-hero.jpg')` ,
                                width: '100%',
                                height: '350px',
                            }}
                        >
                            <div className="absolute inset-0 bg-black opacity-20"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                <div className="max-w-md space-y-4">
                                    <h2 className="text-3xl font-bold">Travel Smarter</h2>
                                    <p className="text-lg">AI-powered trip planning at your fingertips</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="mt-20 pb-12">
                    <h2 className="text-3xl font-bold text-center text-[var(--text-color)] mb-12">
                        Why Choose GeoQuery?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-[var(--secondary-bg)] rounded-lg shadow-lg">
                            <BsSun className="text-[var(--accent-color)] text-3xl mb-4" />
                            <h3 className="font-semibold mb-2 text-[var(--accent-color)]">Smart Route Optimization</h3>
                            <p className="text-[var(--text-color)]">Get the most efficient travel routes with real-time traffic updates</p>
                        </div>
                        <div className="p-6 bg-[var(--secondary-bg)] rounded-lg shadow-lg">
                            <BsCalendarEvent className="text-[var(--accent-color)] text-3xl mb-4" />
                            <h3 className="font-semibold mb-2 text-[var(--accent-color)]">AI-Powered Itineraries</h3>
                            <p className="text-[var(--text-color)]">Custom schedules based on your preferences and travel history</p>
                        </div>
                        <div className="p-6 bg-[var(--secondary-bg)] rounded-lg shadow-lg">
                            <BsPeople className="text-[var(--accent-color)] text-3xl mb-4" />
                            <h3 className="font-semibold mb-2 text-[var(--accent-color)]">Community Insights</h3>
                            <p className="text-[var(--text-color)]">See recommendations from fellow travelers</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="mt-20 pb-12">
                    <div className="max-w-md mx-auto md:max-w-lg">
                        <div className="bg-[var(--secondary-bg)] rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center mb-6">
                                {/*<img*/}
                                {/*    src="/traveler-avatar.jpg"*/}
                                {/*    alt="Avatar"*/}
                                {/*    className="w-12 h-12 rounded-full mr-4"*/}
                                {/*/>*/}
                                <div>
                                    <h4 className="text-lg font-medium text-[var(--text-color)]">Emily T.</h4>
                                    <p className="text-sm text-[var(--text-color)]">Frequent Traveler</p>
                                </div>
                            </div>
                            <p className="text-[var(--text-color)] italic">
                                "Finally a planner that understands my love for hidden gems!"
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-[var(--primary-bg)] py-8 mt-12">
                <div className="max-w-7xl mx-auto text-center text-[var(--text-color)]">
                    <p>© 2023 GeoQuery. All rights reserved.</p>
                    <div className="flex justify-center space-x-4 mt-6">
                        <a href="#" className="text-[var(--text-color)-500] hover:text-[var(--accent-color)] transition">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-[var(--text-color)-500] hover:text-[var(--accent-color)] transition">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;