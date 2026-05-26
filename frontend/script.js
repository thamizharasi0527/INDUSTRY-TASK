const form = document.getElementById('idea-form');
const results = document.getElementById('results');
const statusCard = document.getElementById('status-card');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const idea = form.idea.value.trim();
  const market = form.market.value.trim();
  if (!idea || !market) return;

  setLoading(true);
  renderStatus('Analyzing your idea. This may take a moment...');

  try {
    const response = await fetch('http://localhost:4000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, market }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Unable to analyze idea');
    renderResults(data);
  } catch (error) {
    renderStatus('Something went wrong. Please make sure the backend is running.');
    console.error(error);
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  const button = form.querySelector('button');
  button.textContent = isLoading ? 'Analyzing…' : 'Analyze Idea';
  button.disabled = isLoading;
}

function renderStatus(message) {
  statusCard.innerHTML = `
    <h3>Analysis status</h3>
    <p>${message}</p>
  `;
}

function renderResults(data) {
  const { score, competitorSummary, swot, trendScore, risks, opportunities, marketFitDescription } = data;

  results.innerHTML = `
    <div class="result-card">
      <h3>Market fit score</h3>
      <p><strong>${score}%</strong> — ${marketFitDescription}</p>
    </div>
    <div class="result-card">
      <h3>Trend scoring</h3>
      <p>${trendScore.label} demand signal</p>
      <ul>
        <li>Search momentum: ${trendScore.searchMomentum}</li>
        <li>Growth signal: ${trendScore.growthSignal}</li>
      </ul>
    </div>
    <div class="result-card">
      <h3>Competitor analysis</h3>
      <p>${competitorSummary}</p>
    </div>
    <div class="result-card">
      <h3>SWOT</h3>
      <p><strong>Strengths:</strong> ${swot.strengths}</p>
      <p><strong>Weaknesses:</strong> ${swot.weaknesses}</p>
      <p><strong>Opportunities:</strong> ${swot.opportunities}</p>
      <p><strong>Threats:</strong> ${swot.threats}</p>
    </div>
    <div class="result-card">
      <h3>AI-generated risks & opportunities</h3>
      <p><strong>Risks:</strong> ${risks}</p>
      <p><strong>Opportunities:</strong> ${opportunities}</p>
    </div>
  `;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.animate-on-scroll').forEach((element) => observer.observe(element));
