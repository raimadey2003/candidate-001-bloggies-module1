import React from 'react';
import { TrendingUp, TrendingDown, Clock, Users, Tag } from 'lucide-react';

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

interface TrendCardProps {
  trend: Trend;
  rank: number;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend, rank }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Twitter/X': return 'bg-blue-500';
      case 'Reddit': return 'bg-orange-500';
      case 'Google Trends': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
            {rank}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{trend.topic}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {trend.growth > 200 ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-sm font-medium ${trend.growth > 200 ? 'text-green-600' : 'text-red-600'}`}>
            +{trend.growth}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {trend.volume.toLocaleString()} mentions
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date(trend.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getPlatformColor(trend.platform)}`}></div>
          <span className="text-sm font-medium text-gray-700">{trend.platform}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{trend.category}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Sentiment</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSentimentColor(trend.sentiment)}`}>
            {trend.sentiment}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrendCard;