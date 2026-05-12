# Tests – AI Spend Optimizer

This document lists the automated tests written for the **Audit Engine**.  
Minimum of 5 tests are included, focusing on overspending detection, savings calculation, and recommendations.

---

## Test Files

### 1. `tests/duplicateTools.test.js`
- **Covers:** Detects when a user is paying for multiple overlapping tools (e.g., ChatGPT Plus + Claude Pro for similar use cases).
- **Expected Result:** Flags duplicates and suggests consolidation.

### 2. `tests/oversizedPlan.test.js`
- **Covers:** Identifies when a team is subscribed to a higher‑tier plan than needed (e.g., Enterprise plan for 2 users).
- **Expected Result:** Suggests downgrade to appropriate plan.

### 3. `tests/unusedFeatures.test.js`
- **Covers:** Checks if users are paying for features they don’t use (e.g., image generation add‑on unused).
- **Expected Result:** Flags unused features and calculates potential savings.

### 4. `tests/savingsCalculation.test.js`
- **Covers:** Ensures monthly and annual savings are calculated correctly.
- **Expected Result:** Accurate savings output in currency format.

### 5. `tests/recommendationsEngine.test.js`
- **Covers:** Validates that the engine provides actionable recommendations (switch, downgrade, consolidate).
- **Expected Result:** Recommendations are clear, relevant, and tied to savings.

---

## How to Run Tests

### Install Dependencies
```bash
npm install
