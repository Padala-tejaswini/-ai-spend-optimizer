# Devlog – AI Spend Optimizer

This file tracks the development journey of the AI Spend Optimizer project: what was built, challenges faced, and lessons learned.

---

## Day 1 – Project Setup
- Initialized project with Next.js + Tailwind CSS.
- Defined core user flow: input → audit engine → instant results → email capture → shareable report.
- Created initial README.md and ARCHITECTURE.md drafts.

**Challenge:** Deciding whether to add authentication.  
**Decision:** Skipped login to reduce friction and align with “instant audit” requirement.

---

## Day 2 – Audit Engine Prototype
- Built a rules-based calculator to detect overspending:
  - Duplicate tools flagged.
  - Oversized plans identified.
  - Monthly + annual savings calculated.
- Added mock data for testing.

**Challenge:** Balancing accuracy vs. simplicity.  
**Decision:** Started with static rules; ML-based recommendations deferred for later.

---

## Day 3 – UI & Results Panel
- Designed clean input form with Tailwind.
- Built results panel showing savings breakdown.
- Added conditional CTA: “Book Credex Consultation” if savings > $200/month.

**Challenge:** Keeping UX simple while showing enough detail.  
**Decision:** Focused on clarity over complexity.

---

## Day 4 – Shareable Reports
- Integrated Supabase/Postgres to store reports.
- Generated unique public URLs for each audit.
- Added Open Graph metadata for Twitter/LinkedIn previews.

**Challenge:** Ensuring URLs are secure but still public.  
**Decision:** Used UUIDs for report IDs.

---

## Day 5 – Email Capture & Deployment
- Added email capture after results are shown.
- Integrated with SendGrid for report delivery.
- Deployed to Vercel for fast CI/CD.

**Challenge:** Timing of email gate.  
**Decision:** Show value first, then request email — improves conversion.

---

## Lessons Learned
1. **Frictionless UX matters** — removing login boosted usability.  
2. **Static rules are enough for MVP** — don’t over-engineer early.  
3. **Shareability drives growth** — Open Graph previews make reports viral.  
4. **Email after value** — better trust and conversion.  
5. **Serverless deployment** — ideal for small projects, but scaling will need queues/caching.

---

## Next Steps
- Add caching for common tool combinations.  
- Explore ML-based recommendations for more accurate audits.  
- Improve consultation funnel with calendar integration.  
- Add analytics to measure usage and conversion rates.
