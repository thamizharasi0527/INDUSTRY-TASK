const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const cache = new Map();

function createTrendScore(idea, market) {
  const base = Math.min(95, Math.max(30, 60 + (market.length - idea.length) * 2));
  return {
    label: base > 70 ? 'high' : base > 50 ? 'moderate' : 'low',
    searchMomentum: `${Math.min(100, base + 10)}%`,
    growthSignal: `${Math.max(30, 100 - base)}%`,
  };
}

function estimateMarketFit(idea, market) {
  const score = Math.round(
    40 + Math.min(45, idea.length * 0.8) + Math.min(15, market.length * 0.6)
  );
  return {
    score: Math.min(98, Math.max(28, score)),
    description:
      score > 75
        ? 'Strong early validation signal'
        : score > 55
        ? 'Good fit with room to refine positioning'
        : 'Needs more customer research before scaling',
  };
}

function buildSwot(idea, market) {
  return {
    strengths: `Strong concept in ${market} with early differentiation around ${idea.split(' ').slice(0, 3).join(' ')}`,
    weaknesses: 'Requires deeper customer interviews and a clear go-to-market angle.',
    opportunities: `Expanding demand for ${market} adjacent products creates space to capture new users.`, 
    threats: 'Existing players may move quickly if positioning is too broad.',
  };
}

function competitorAnalysis(idea, market) {
  return `Found multiple adjacent competitors in ${market}. The idea is promising if it lands a specific niche and avoids direct feature parity with larger incumbents.`;
}

function aiRiskOpportunity(idea, market) {
  return {
    risks: 'User adoption may lag without targeted messaging, and early product-market fit depends on your distribution plan.',
    opportunities: 'High potential to capture underserved niche segments and create a strong launch narrative.',
  };
}

app.post('/api/analyze', async (req, res) => {
  const { idea, market } = req.body;
  if (!idea || !market) {
    return res.status(400).json({ message: 'Idea and market are required.' });
  }

  const cacheKey = `${idea.trim().toLowerCase()}|${market.trim().toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  await new Promise((resolve) => setTimeout(resolve, 850));

  const trendScore = createTrendScore(idea, market);
  const marketFit = estimateMarketFit(idea, market);
  const swot = buildSwot(idea, market);
  const competitorSummary = competitorAnalysis(idea, market);
  const { risks, opportunities } = aiRiskOpportunity(idea, market);

  const payload = {
    score: marketFit.score,
    marketFitDescription: marketFit.description,
    competitorSummary,
    swot,
    trendScore,
    risks,
    opportunities,
    timestamp: new Date().toISOString(),
  };

  cache.set(cacheKey, payload);
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  res.json(payload);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', cachedIdeas: cache.size });
});

app.listen(port, () => {
  console.log(`Startup Idea Validation API running at http://localhost:${port}`);
});
