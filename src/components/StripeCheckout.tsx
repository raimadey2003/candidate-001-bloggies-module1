import React, { useState } from 'react';
import { CreditCard, Package, Star } from 'lucide-react';

const StripeCheckout: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handlePurchase = () => {
    setShowForm(true);
  };

  const handleFakePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate network/payment delay
      await new Promise((res) => setTimeout(res, 2000));

      setIsProcessing(false);
      setShowSuccess(true);
      setShowForm(false);

      // Hide success message after 3s
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100">
          <Package className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Trend Scraper AI Pack</h3>
          <p className="text-sm text-gray-600">Unlock powerful insights with AI-based trend analysis</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900">$7.00</span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
            ))}
          </div>
        </div>

        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Real-time trend discovery</li>
          <li>• AI-powered topic generation</li>
          <li>• Sentiment & volume analysis</li>
          <li>• Priority API access & support</li>
        </ul>
      </div>

      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm font-medium">✅ Payment successful!</p>
          <p className="text-green-600 text-xs">Pro Trend Scraper AI Pack is now active</p>
        </div>
      )}

      {showForm ? (
        <div className="space-y-4 mb-4">
          <input
            type="text"
            placeholder="Card Number"
            className="w-full border px-3 py-2 rounded-lg text-sm"
          />
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-1/2 border px-3 py-2 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-1/2 border px-3 py-2 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={handleFakePayment}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
          >
            {isProcessing ? 'Processing...' : 'Pay $7.00'}
          </button>
        </div>
      ) : (
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-5 h-5" />
          <span>{isProcessing ? 'Processing...' : 'Purchase Now'}</span>
        </button>
      )}

      <p className="text-xs text-gray-500 text-center mt-3">
        Test mode – No actual charges will be made
      </p>
    </div>
  );
};

export default StripeCheckout;
