import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-20">
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">BeyondChats Articles</h1>
                    <p className="text-xl text-gray-600 mb-8">Explore our collection of articles in different formats</p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <Link
                            to="/original"
                            className="bg-white rounded-lg shadow-md p-8 border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="text-6xl mb-4">📄</div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Original Articles</h2>
                            <p className="text-gray-600 mb-4">Raw scraped content from BeyondChats blog in HTML format</p>
                            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                                View Original →
                            </span>
                        </Link>

                        <Link
                            to="/enhanced"
                            className="bg-white rounded-lg shadow-md p-8 border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="text-6xl mb-4">✨</div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Enhanced Articles</h2>
                            <p className="text-gray-600 mb-4">AI-improved content with better structure and formatting</p>
                            <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors">
                                View Enhanced →
                            </span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;