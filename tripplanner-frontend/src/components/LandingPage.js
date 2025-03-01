// src/pages/LandingPage.js
import { useState, useEffect } from 'react';
import { BsPeople,BsCalendarEvent,BsStarFill,BsX} from 'react-icons/bs';
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
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const trips = [
        {
            id: 1,
            name: "48 Hours in Bagan",
            description: "Discover the best of Bagan in just two days!",
            itinerary: ["In first day, start the tour at 08:30 am from the hotel and meet the Bagan tour guide. At 09:00 am, begin to explore the archaeological sites and the ancient city of Bagan which recently got recognized as a World Heritage Site by UNESCO.",
                "Visit Bagan's most sacred pagodas and temples, including Archaeological Museum and King Palace. In the afternoon, visit Minnanthu village, an agricultural village in the middle of the archaeological zone.",
                " In the evening, embark on a pleasant boat ride on the Irrawaddy River. Enjoy the sunset and beautiful scenery. Drop off at the hotel at 06:00 pm.",
                "In second day, at 8:30 am, you will be picked up by the experienced Bagan tour guide from your hotel and drive 48 km from Bagan.",
                "On the way, stop to see the palm juice and oil factories and peanut oil factories. After arrival, climb up 777 steps to Mount Popa, home to Myanmar's Nats (Spirits) Kingdom.",
                " After enjoying some spectacular views from the top and taking a snapshot for memories, head back to the hotel. Drop off at the hotel at 05:30 pm and stay overnight at the hotel in Bagan."],

            image: "/photos/bagan-section-photo.jpg"
        },
        {
            id: 2,
            name: "TOP 7 BEST PLACES TO VISIT",
            description: "Must visit places in Bagan to explore!",
            itinerary: ["Ananda Pahto", "Shwesandaw Paya", "Thatbyinnyu Pahto", "Sulamani Pahto", "Dhammayangyi Pahto", " Shwezigon Paya", " Bagan Archaeological Museum"],
            image: "/photos/bagan.jpeg"
        },
        {
            id: 3,
            name: "What to do in Bagan?",
            description: "Bagan's ancient wonders are best discovered by renting a bicycle and exploring its numerous pagodas and temples. A quintessential experience is watching the sunset from Shwesandaw Pagoda, followed by waking up early to witness a breathtaking sunrise. For an unforgettable perspective, consider a hot air balloon ride at dawn. Lastly, a half-day excursion to Mount Popa provides a captivating glimpse into the region's spiritual heart." ,
            itinerary: ["Shwesandaw Pagoda", "Mount Popa", "Bulethi Pagoda", "Shwegugyi Pagoda"],
            image: "/photos/hot air ballon.jpeg"
        },
        // Add more trips here
    ];

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


                <section id="recommendations" className="mt-24 pb-12">
                    <h2 className="text-3xl font-bold text-center text-[var(--text-color)] mb-16">
                        Trip Recommendations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map(trip => (
                            <div
                                key={trip.id}
                                className="bg-[var(--secondary-bg)] rounded-2xl shadow-lg overflow-hidden group transition-transform hover:translate-y-[-4px]"
                            >
                                <div className="relative">
                                    <img
                                        src={trip.image}
                                        alt={trip.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-30"></div>
                                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                                        <h3 className="text-2xl mb-2">{trip.name}</h3>
                                        <p className="text-lg">Adventure is calling. Will you go?</p>
                                    </div>
                                </div>
                                <div className="p-6">

                                    <p className="text-[var(--text-color)] mb-4">
                                        Itineraries with iconic landmarks and hidden gems
                                    </p>
                                    <button
                                        className="w-full bg-[var(--accent-color)] text-white py-3 rounded-lg transition hover:bg-[var(--accent-color)]/90"
                                        onClick={() => {
                                            setSelectedTrip(trip);
                                            setShowModal(true);
                                        }}
                                    >
                                        Explore This Trip
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Modal */}
                {showModal && (
                    <div
                        className="fixed inset-0 bg-[var(--primary-bg)]/50 backdrop-blur-sm flex justify-center items-center"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="relative max-w-xl w-full bg-[var(--secondary-bg)] rounded-2xl p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-4 right-4 text-[var(--text-color)] hover:text-[var(--accent-color)]"
                                onClick={() => setShowModal(false)}
                            >
                                <BsX size={24} />
                            </button>
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-[var(--text-color)]">{selectedTrip?.name}</h3>
                                <div className="flex items-center mb-2">
                                    <BsStarFill className="text-[var(--accent-color)] mr-1" />
                                    <span className="text-[var(--accent-color)]">4.9</span>
                                </div>
                                <p className="text-[var(--text-color)]">{selectedTrip?.description}</p>
                                <div>
                                    <ul className="list-disc list-inside space-y-1">
                                        {selectedTrip?.itinerary?.map((item, index) => (
                                            <li key={index} className="text-[var(--text-color)]">{item}</li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Testimonials Section */}
                <section id="testimonials" className="mt-20 pb-12">
                    <h2 className="text-3xl font-bold text-center text-[var(--text-color)] mb-16">
                        Testimonials
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="max-w-md mx-auto md:max-w-lg">
                        <div className="bg-[var(--secondary-bg)] rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center mb-6">
                                {/*<img*/}
                                {/*    src="/traveler-avatar.jpg"*/}
                                {/*    alt="Avatar"*/}
                                {/*    className="w-12 h-12 rounded-full mr-4"*/}
                                {/*/>*/}
                                <div>
                                    <h4 className="text-lg font-medium text-[var(--text-color)]">Thiri Shwe Sin</h4>
                                    <p className="text-sm text-[var(--text-color)]">Frequent Traveler</p>
                                </div>
                            </div>
                            <p className="text-[var(--text-color)] italic">
                                "Finally a planner that understands my love for hidden gems!"
                            </p>
                        </div>
                    </div>
                        {/*end of testimonial*/}
                        <div className="max-w-md mx-auto md:max-w-lg mt-3">
                            <div className="bg-[var(--secondary-bg)] rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center mb-6">

                                    <div>
                                        <h4 className="text-lg font-medium text-[var(--text-color)]">Hsu Thar</h4>
                                        <p className="text-sm text-[var(--text-color)]">Frequent Traveler</p>
                                    </div>
                                </div>
                                <p className="text-[var(--text-color)] italic">
                                    "Finally a planner that understands my love for hidden gems!"
                                </p>
                            </div>

                        </div>
                        <div className="max-w-md mx-auto md:max-w-lg mt-3">
                            <div className="bg-[var(--secondary-bg)] rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center mb-6">

                                    <div>
                                        <h4 className="text-lg font-medium text-[var(--text-color)]">Lin Leck</h4>
                                        <p className="text-sm text-[var(--text-color)]">Frequent Traveler</p>
                                    </div>
                                </div>
                                <p className="text-[var(--text-color)] italic">
                                    "Finally a planner that understands my love for hidden gems!"
                                </p>
                            </div>

                        </div>
                    </div>

                </section>
            </main>

            <footer className="bg-[var(--primary-bg)] py-8 mt-12">
                <div className="max-w-7xl mx-auto text-center text-[var(--text-color)]">
                    <p>© 2025 GeoQuery. All rights reserved.</p>
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