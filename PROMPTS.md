Audit Engine – Overspending Detection
Prompt:  
“You are an AI spend auditor. Given a list of tools, plans, team size, and monthly spend, identify duplicate tools with overlapping functionality, oversized plans relative to team size, and unused features or add‑ons. Return a JSON object with flags and estimated savings.”

Reason:  
I needed structured, machine‑readable output. JSON ensures the frontend can parse results without ambiguity. The role instruction (“AI spend auditor”) keeps the model focused on cost analysis rather than generic advice.

Savings Calculation
Prompt):  
“Given flagged overspending items and their monthly costs, calculate total monthly savings and total annual savings. Return only numeric values in JSON.”

Reason:  
Separating calculation from detection reduced errors. Forcing numeric JSON output prevented the model from mixing text with numbers.

Recommendations
Prompt :  
“Based on detected overspending, generate two to three clear recommendations. Each recommendation must be actionable (for example: downgrade, consolidate, cancel) and include estimated savings impact. Output as a bullet list in plain text.”

Reason:  
Limiting to two or three recommendations keeps results concise and user‑friendly. Plain text bullets are easy to render in the UI and share.

Consultation Funnel Trigger
Prompt):  
“If total monthly savings is greater than $200, output: ‘Eligible for consultation: Yes’. Otherwise output: ‘Eligible for consultation: No’.”

Reason:  
Binary output simplifies funnel logic and makes eligibility transparent. Using a strict numeric threshold avoids subjective judgments.
