import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc', {
  apiVersion: '2024-06-20',
});

app.use(cors());
app.use(express.json());

let userCredits = 0;
let trendsCache = null;
let cacheTimestamp = 0;

const generateMockTrends = () => {
  const platforms = ['Twitter/X', 'Reddit', 'Google Trends'];
  const sampleTopics = [
    'AI Revolution', 'Climate Change', 'Space Exploration', 'Cryptocurrency',
    'Mental Health', 'Remote Work', 'Electric Vehicles', 'Quantum Computing',
    'Sustainable Living', 'Virtual Reality', 'Blockchain Technology', 'Renewable Energy',
    'Machine Learning', 'Social Media Trends', 'Tech Innovation', 'Digital Privacy',
    'Cybersecurity', 'Smart Cities', 'Biotechnology', 'Automation'
  ];

  const trends = [];

  for (let i = 0; i < 10; i++) {
    const topic = sampleTopics[Math.floor(Math.random() * sampleTopics.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const volume = Math.floor(Math.random() * 100000) + 1000;
    const sentiment = Math.random() > 0.5 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral';

    trends.push({
      id: uuidv4(),
      topic,
      platform,
      volume,
      sentiment,
      timestamp: new Date().toISOString(),
      growth: Math.floor(Math.random() * 500) + 50,
      category: ['Technology', 'Entertainment', 'Sports', 'Politics', 'Business'][Math.floor(Math.random() * 5)]
    });
  }

  return trends.sort((a, b) => b.volume - a.volume);
};

const awardCredit = async (amount = 1) => {
  try {
    const response = await axios.post('https://api.bloggies.com/api/award-credit', {
      userId: 'user_123',
      amount,
      timestamp: new Date().toISOString()
    }).catch(() => {
      return { data: { success: true, newBalance: userCredits + amount } };
    });

    userCredits += amount;
    return response.data;
  } catch (error) {
    console.error('Error awarding credit:', error);
    userCredits += amount;
    return { success: true, newBalance: userCredits };
  }
};

// Routes
app.get('/api/trends', async (_req, res) => {
  try {
    await awardCredit(1);
    const now = Date.now();

    if (trendsCache && (now - cacheTimestamp) < 21600000) {
      return res.json({
        success: true,
        data: trendsCache,
        cached: true,
        creditsAwarded: 1,
        totalCredits: userCredits
      });
    }

    const trends = generateMockTrends();
    trendsCache = trends;
    cacheTimestamp = now;

    res.json({
      success: true,
      data: trends,
      cached: false,
      creditsAwarded: 1,
      totalCredits: userCredits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trends',
      message: error.message
    });
  }
});

app.get('/api/credits', (_req, res) => {
  res.json({
    success: true,
    credits: userCredits
  });
});

app.post('/api/raffle', (_req, res) => {
  const hasWon = Math.random() < 0.1;
  res.json({
    success: true,
    hasWon,
    prize: hasWon ? 'Free Pro Trend Pack' : null,
    nextDraw: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
});

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount = 700 } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        product: 'Pro Trend Pack',
        userId: 'user_123'
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/', (_req, res) => {
  res.send('✅ Backend is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Bloggies API running at http://localhost:${PORT}`);
});
