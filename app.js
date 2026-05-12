/**
 * AI Spend Optimizer - Application Logic
 */

let userStack = [];
const TOOL_DATABASE = {
  chatgpt_plus: { name: "ChatGPT Plus", cost: 20, category: "chat", capability: ["text", "code", "image"] },
  chatgpt_team: { name: "ChatGPT Team", cost: 30, category: "chat", capability: ["text", "code", "image", "admin"] },
  claude_pro: { name: "Claude Pro", cost: 20, category: "chat", capability: ["text", "code"] },
  claude_team: { name: "Claude Team", cost: 30, category: "chat", capability: ["text", "code", "admin"] },
  gemini_advanced: { name: "Gemini Advanced", cost: 20, category: "chat", capability: ["text", "image"] },
  perplexity_pro: { name: "Perplexity Pro", cost: 20, category: "search", capability: ["text"] },
  jasper: { name: "Jasper", cost: 49, category: "writing", capability: ["text"] },
  copy_ai: { name: "Copy.ai", cost: 49, category: "writing", capability: ["text"] },
  writesonic: { name: "Writesonic", cost: 19, category: "writing", capability: ["text"] },
  midjourney_basic: { name: "MidJourney Basic", cost: 10, category: "image", capability: ["image"] },
  midjourney_standard: { name: "MidJourney Standard", cost: 30, category: "image", capability: ["image"] },
  midjourney_pro: { name: "MidJourney Pro", cost: 60, category: "image", capability: ["image"] },
  dalle3: { name: "DALL-E 3", cost: 0, category: "image", capability: ["image"] },
  adobe_firefly: { name: "Adobe Firefly", cost: 5, category: "image", capability: ["image"] },
  stable_diffusion: { name: "Stable Diffusion", cost: 10, category: "image", capability: ["image"] },
  canva_pro: { name: "Canva Pro AI", cost: 15, category: "design", capability: ["image", "design"] },
  github_copilot: { name: "GitHub Copilot", cost: 10, category: "code", capability: ["code"] },
  cursor_pro: { name: "Cursor Pro", cost: 20, category: "code", capability: ["code"] },
  tabnine: { name: "Tabnine", cost: 12, category: "code", capability: ["code"] },
  notion_ai: { name: "Notion AI", cost: 10, category: "productivity", capability: ["text"] },
  otter_ai: { name: "Otter.ai", cost: 17, category: "productivity", capability: ["audio"] },
  fireflies: { name: "Fireflies.ai", cost: 18, category: "productivity", capability: ["audio"] },
  grammarly_pro: { name: "Grammarly Pro", cost: 12, category: "writing", capability: ["text"] }
};

// UI Elements
const toolSelect = document.getElementById('toolSelect');
const toolCostInput = document.getElementById('toolCost');
const toolSeatsInput = document.getElementById('toolSeats');
const toolsListEl = document.getElementById('toolsList');
const customToolRow = document.getElementById('customToolName');
const customNameInput = document.getElementById('customName');
const sliderVal = document.getElementById('sliderVal');

// Listen for tool selection to auto-fill price
toolSelect.addEventListener('change', (e) => {
  const val = e.target.value;
  if (val === 'custom') {
    customToolRow.style.display = 'block';
    toolCostInput.value = '';
  } else {
    customToolRow.style.display = 'none';
    if (TOOL_DATABASE[val]) {
      toolCostInput.value = TOOL_DATABASE[val].cost;
    }
  }
});

function updateSliderLabel(val) {
  sliderVal.textContent = `${val}% active`;
}

function addTool() {
  const toolId = toolSelect.value;
  const cost = parseFloat(toolCostInput.value);
  const seats = parseInt(toolSeatsInput.value) || 1;
  let name = "";

  if (toolId === 'custom') {
    name = customNameInput.value || "Custom Tool";
  } else if (toolId) {
    name = TOOL_DATABASE[toolId].name;
  } else {
    return alert("Please select a tool first");
  }

  if (isNaN(cost)) return alert("Please enter a valid cost");

  const newTool = {
    id: toolId === 'custom' ? `custom_${Date.now()}` : toolId,
    dbId: toolId,
    name: name,
    cost: cost,
    seats: seats,
    totalMonthly: cost * seats
  };

  userStack.push(newTool);
  renderTools();
  
  // Reset inputs
  toolSelect.value = "";
  toolCostInput.value = "";
  toolSeatsInput.value = "1";
  customToolRow.style.display = "none";
}

function removeTool(index) {
  userStack.splice(index, 1);
  renderTools();
}

function renderTools() {
  toolsListEl.innerHTML = userStack.map((tool, idx) => `
    <div class="tool-item">
      <div class="tool-item-info">
        <h4>${tool.name}</h4>
        <span>$${tool.cost}/mo × ${tool.seats} seats = <strong>$${tool.totalMonthly}</strong></span>
      </div>
      <button class="remove-tool" onclick="removeTool(${idx})">✕</button>
    </div>
  `).join('');
}

async function runAudit() {
  if (userStack.length === 0) return alert("Add at least one tool to run the audit!");

  const formPanel = document.getElementById('formPanel');
  const resultsPanel = document.getElementById('resultsPanel');
  const resultsLoading = document.getElementById('resultsLoading');
  const resultsContent = document.getElementById('resultsContent');

  // Transition UI
  formPanel.style.opacity = "0.5";
  formPanel.style.pointerEvents = "none";
  resultsPanel.style.display = "block";
  resultsPanel.scrollIntoView({ behavior: 'smooth' });

  // Simulate loading steps
  const steps = document.querySelectorAll('.ls');
  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.add('active');
    await new Promise(r => setTimeout(r, 800));
  }

  resultsLoading.style.display = "none";
  resultsContent.style.display = "block";

  performAnalysis();
}

function performAnalysis() {
  let totalCurrent = 0;
  let totalOptimized = 0;
  let findings = [];
  let recs = [];
  let breakdownRows = [];

  const teamSizeStr = document.getElementById('teamSize').value;
  const utilization = parseInt(document.getElementById('utilizationRate').value);
  const primaryUse = document.getElementById('primaryUse').value;

  // Track categories for overlap
  const categoriesPresent = {};
  userStack.forEach(tool => {
    const dbEntry = TOOL_DATABASE[tool.dbId] || { category: 'other' };
    if (!categoriesPresent[dbEntry.category]) categoriesPresent[dbEntry.category] = [];
    categoriesPresent[dbEntry.category].push(tool);
    totalCurrent += tool.totalMonthly;
  });

  // 1. Check Overlaps (e.g. ChatGPT + Claude)
  if (categoriesPresent['chat'] && categoriesPresent['chat'].length > 1) {
    findings.push({
      icon: '🔄',
      title: 'Redundant LLM Subscriptions',
      desc: `You are paying for ${categoriesPresent['chat'].length} different chat interfaces. Most teams can consolidate to just one.`
    });
    
    // Pick the most expensive one as redundant for calculation
    const sorted = [...categoriesPresent['chat']].sort((a, b) => b.totalMonthly - a.totalMonthly);
    const saveable = sorted.slice(1).reduce((sum, t) => sum + t.totalMonthly, 0);
    recs.push({
      icon: '🎯',
      title: `Consolidate to ${sorted[0].name}`,
      desc: `Cancel other chat tools to save $${saveable}/mo without losing core AI capabilities.`
    });
  }

  // 2. Check Writing tools vs ChatGPT
  if ((categoriesPresent['writing'] || categoriesPresent['marketing']) && categoriesPresent['chat']) {
    findings.push({
      icon: '✍️',
      title: 'Specialized Writing Overlap',
      desc: "Tools like Jasper or Copy.ai often overlap 90% with ChatGPT/Claude Pro capabilities."
    });
    recs.push({
      icon: '💡',
      title: 'Custom GPTs over Niche Tools',
      desc: "Replace specialized writing tools with custom system prompts in your primary LLM."
    });
  }

  // 3. Utilization Check
  if (utilization < 50) {
    findings.push({
      icon: '👥',
      title: 'Low Seat Utilization',
      desc: `Your team usage is at ${utilization}%. You likely have idle licenses costing you money.`
    });
    const seatWaste = Math.round(totalCurrent * (1 - (utilization/100 + 0.1)));
    if (seatWaste > 0) {
      recs.push({
        icon: '✂️',
        title: 'Prune Idle Licenses',
        desc: `Reduce seat counts to match actual active users. Estimated savings: $${seatWaste}/mo.`
      });
    }
  }

  // 4. Monthly vs Annual (Logic simplified: 20% savings)
  recs.push({
    icon: '📅',
    title: 'Switch to Annual Billing',
    desc: 'Most AI vendors offer 20% discounts for annual commitments.'
  });

  // Calculate optimized total (Mock logic for demonstration)
  // We'll say optimization reduces spend by a percentage based on findings
  let savingFactor = 0.15; // Base 15% from annual
  if (findings.length > 2) savingFactor += 0.25;
  if (utilization < 50) savingFactor += 0.20;
  
  const monthlySavings = Math.round(totalCurrent * Math.min(savingFactor, 0.65));
  totalOptimized = totalCurrent - monthlySavings;

  // UI Updates
  document.getElementById('sbAmount').textContent = `$${monthlySavings}`;
  document.getElementById('sbAnnual').textContent = `$${monthlySavings * 12}/year`;
  
  // Waste Score (0-100)
  const score = Math.min(Math.round((monthlySavings / totalCurrent) * 150), 100);
  document.getElementById('scoreVal').textContent = score;
  const offset = 201 - (201 * score / 100);
  document.getElementById('ringFill').style.strokeDashoffset = offset;

  // Render Lists
  document.getElementById('findingsList').innerHTML = findings.map(f => `
    <div class="finding-item">
      <div class="item-icon">${f.icon}</div>
      <div class="item-text">
        <h4>${f.title}</h4>
        <p>${f.desc}</p>
      </div>
    </div>
  `).join('');

  document.getElementById('recsList').innerHTML = recs.map(r => `
    <div class="rec-item">
      <div class="item-icon">${r.icon}</div>
      <div class="item-text">
        <h4>${r.title}</h4>
        <p>${r.desc}</p>
      </div>
    </div>
  `).join('');

  // Render Table
  document.getElementById('breakdownBody').innerHTML = userStack.map(tool => {
    const isRedundant = findings.some(f => f.title.includes('Redundant') && tool.category === 'chat');
    const toolSaving = isRedundant ? tool.totalMonthly : Math.round(tool.totalMonthly * 0.2);
    return `
      <tr>
        <td>${tool.name}</td>
        <td>$${tool.totalMonthly}</td>
        <td><span class="${isRedundant ? 'text-danger' : 'text-success'}">${isRedundant ? '⚠️ Redundant' : '✅ Active'}</span></td>
        <td>$${isRedundant ? 0 : tool.totalMonthly - toolSaving}</td>
        <td><span class="save-tag">-$${toolSaving}</span></td>
      </tr>
    `;
  }).join('');

  document.getElementById('breakdownFoot').innerHTML = `
    <tr style="font-weight:bold; border-top: 2px solid var(--glass-border)">
      <td>TOTAL</td>
      <td>$${totalCurrent}</td>
      <td>-</td>
      <td>$${totalOptimized}</td>
      <td style="color:var(--success)">$${monthlySavings}/mo</td>
    </tr>
  `;

  // Consultation Logic (> $200)
  if (monthlySavings > 200) {
    document.getElementById('ctaCapture').style.display = "none";
    document.getElementById('ctaConsult').style.display = "block";
    document.getElementById('consultSavings').textContent = `$${monthlySavings}`;
  } else {
    document.getElementById('ctaCapture').style.display = "block";
    document.getElementById('ctaConsult').style.display = "none";
  }
}

function captureEmail() {
  const email = document.getElementById('emailInput').value;
  if (!email || !email.includes('@')) return alert("Please enter a valid business email");
  
  showToast("✅ Audit report sent to " + email);
  
  // In a real app, this would trigger a backend mailer
  setTimeout(() => {
    alert("In this demo: A custom PDF report was generated and 'emailed' to you!");
  }, 500);
}

function bookConsultation() {
  window.open('https://calendly.com/credex-ai/audit-review', '_blank');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Sharing
function shareReport(platform) {
  const text = `I just audited my AI spend with Credex and found $${document.getElementById('sbAmount').textContent} in monthly savings! Check your stack here:`;
  const url = window.location.href;
  
  let shareUrl = "";
  if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  if (platform === 'hn') shareUrl = `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(text)}`;
  
  if (shareUrl) window.open(shareUrl, '_blank');
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  showToast("🔗 Link copied to clipboard!");
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = "none";
}
