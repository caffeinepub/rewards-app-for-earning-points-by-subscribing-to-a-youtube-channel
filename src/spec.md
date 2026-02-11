# Specification

## Summary
**Goal:** Update the signed-out landing page copy so the selected elements display the phrase “All tasks allowed” in English.

**Planned changes:**
- In `frontend/src/components/LandingScreen.tsx`, change the selected bottom CTA button text to exactly “All tasks allowed”, preserving the existing loading text “Logging in...”.
- In `frontend/src/components/LandingScreen.tsx`, update at least one of the selected feature highlight text elements (selected h3 heading(s) and/or selected paragraph) so the visible UI text clearly includes “All tasks allowed”.
- Ensure only the user-selected elements (as identified by the provided XPaths) are modified, and all updated/introduced user-facing text is in English.

**User-visible outcome:** On the signed-out landing page, the bottom CTA button reads “All tasks allowed” and at least one selected feature highlight text area also displays “All tasks allowed”.
