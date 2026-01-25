
## Implementation Details

### Volatility Harvesting Journal

- **Data Model**: `entries` table with `type` (stressor, success, neutral), `stress_level` (1-10), `signal_score` (derived from AI analysis), `growth_ratio` (calculated field).
- **AI Logic**: Use MCP to analyze the emotional tone and extract actionable insights. Calculate `growth_ratio = signal_score / stress_level`.
- **UI**: A timeline view showing "Stress Events" (red) and "Growth Events" (green). A "Resilience Score" widget that increases as `growth_ratio` improves.

### Barbell Strategy Decision Matrix

- **Data Model**: `strategies` table with `side` (floor, ceiling), `risk_level` (1-10), `reward_potential` (1-10), `fragility_score` (derived from AI analysis).
- **AI Logic**: Use MCP to analyze the user's goals and suggest "Fragile Middle" candidates (moderate risk, low reward) for elimination.
- **UI**: A split-screen dashboard. Left side: "The Floor" (safe, consistent habits). Right side: "The Ceiling" (high-risk, high-reward bets). A "Fragility Alert" banner that appears when fragile tasks are detected.

### Via Negativa Auditor

- **Data Model**: `audits` table with `target` (schedule, habits, tasks), `complexity_score` (derived from AI analysis), `fragility_points` (list of identified vulnerabilities).
- **AI Logic**: Use MCP to analyze the user's calendar and task list. Identify single points of failure and suggest removals.
- **UI**: A "Simplicity Score" widget that increases as complexity decreases. A "Remove" button next to each identified fragile item.