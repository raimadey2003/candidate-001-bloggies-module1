import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw as Refresh, Award, Zap } from 'lucide-react';
import TrendCard from './components/TrendCard';
import RaffleWidget from './components/RaffleWidget';
import StripeCheckout from './components/StripeCheckout';

interface Trend {
  id: string;
  topic: string;
  platform: string;
  volume: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  growth: number;
  category: string;
}

function App() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://candidate-001-bloggies-module1.vercel.app/api/trends');
      const data = await response.json();
      
      if (data.success) {
        setTrends(data.data);
        setCredits(data.totalCredits);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bloggies</h1>
                <p className="text-sm text-gray-600">Viral Engine • Module 1</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-lg">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">{credits} credits</span>
              </div>
              
              <button
                onClick={fetchTrends}
                disabled={loading}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Refresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Trends Section */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  <span>Top 10 Trending Topics</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time trends from Twitter/X, Reddit & Google Trends
                  {lastUpdated && (
                    <span className="ml-2">• Last updated: {lastUpdated}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trends.map((trend, index) => (
                <TrendCard key={trend.id} trend={trend} rank={index + 1} />
              ))}
            </div>

            {trends.length === 0 && !loading && (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No trends available. Click refresh to fetch the latest data.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <RaffleWidget credits={credits} />
            <StripeCheckout />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
