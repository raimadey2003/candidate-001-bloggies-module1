import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Clock } from 'lucide-react';

interface RaffleWidgetProps {
  credits: number;
}

const RaffleWidget: React.FC<RaffleWidgetProps> = ({ credits }) => {
  const [raffleResult, setRaffleResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const spinRaffle = async () => {
    setIsSpinning(true);
    setShowResult(false);
    
    try {
      const response = await fetch('https://candidate-001-bloggies-module1.vercel.app//api/raffle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      setTimeout(() => {
        setRaffleResult(data);
        setIsSpinning(false);
        setShowResult(true);
      }, 2000);
    } catch (error) {
      console.error('Raffle error:', error);
      setIsSpinning(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Gift className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Lucky Raffle</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">{credits} credits</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className={`w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white/30 flex items-center justify-center transition-transform duration-2000 ${isSpinning ? 'animate-spin' : ''}`}>
          <Gift className="w-12 h-12" />
        </div>
        
        {showResult && raffleResult && (
          <div className="mb-4">
            {raffleResult.hasWon ? (
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm font-medium">🎉 Congratulations!</p>
                <p className="text-xs opacity-90">{raffleResult.prize}</p>
              </div>
            ) : (
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm">Better luck next time!</p>
                <p className="text-xs opacity-75">Keep earning credits</p>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={spinRaffle}
        disabled={isSpinning || credits < 1}
        className="w-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed border border-white/30 rounded-lg py-3 px-4 font-medium transition-colors duration-200"
      >
        {isSpinning ? 'Spinning...' : 'Spin for Prize!'}
      </button>

      <div className="mt-4 flex items-center justify-center space-x-2 text-xs opacity-75">
        <Clock className="w-3 h-3" />
        <span>Next draw in 24 hours</span>
      </div>
    </div>
  );
};

export default RaffleWidget;
