SYONIT - The Ultimate Yes/No Game
SYONIT Logo 
License: MIT
Next.js
React
Table of Contents

Overview
Features
Screenshots
Tech Stack
Installation
Usage
Project Structure
API Endpoints
Contributing
License
Contact
Roadmap

Overview
SYONIT is an engaging, multiplayer yes/no decision making game designed to challenge players' decision-making skills under time pressure. Players compete in real-time rounds, picking between yes/no and ensuring they are in the minority to earn points and climb the leaderboard. With a sleek, mobile-first interface and intuitive navigation, SYONIT combines the thrill of competitive gaming with motivational quotes and social features to keep players coming back.
Built with modern web technologies, SYONIT is a full-stack application featuring user authentication, real-time game sessions, friend invites, and a progressive points system. Whether you're playing solo or inviting friends to join the competition, SYONIT turns simple decisions into high-stakes excitement.
Key Goals

Provide fast-paced, addictive gameplay.
Foster social interaction through invites and leaderboards.
Deliver motivational content to enhance user experience.
Ensure scalability for large player bases.

Features
Core Gameplay

Real-Time Multiplayer: Join games with up to 1,000,000 players in themed rounds.
Yes/No Mechanics: Pick between Yes/No and ensure to be in the minority to gain points.


User Experience

Onboarding Flow: Multi-step signup with email verification, social login (Apple/Google), and profile picture upload.
How-to-Play Tutorial: Interactive slider with 10 steps explaining rules and scoring.
Home Dashboard: Tabbed interface for Game, Idea (motivational quotes), Leaderboard, and Special Events.
Invite System: Search and invite friends via email, with status tracking (In Game, Readied, Friend).

Social & Progression

Points System: Accumulate points toward a 2,500-point prize threshold, visualized with progress bars.
Leaderboard: Real-time rankings by rank, name, and points.
Friend Management: View online status, points, and send invites directly.
Special Events: Upcoming tournaments and bonus rounds.

Additional

Responsive Design: Optimized for mobile devices with iOS-like aesthetics.
Offline Support: Basic caching for seamless navigation.
Analytics: Track user engagement and game metrics.

Screenshots
How to Play Tutorial
How to Play 
Signup Flow
Signup Step 1
Signup Verification
Welcome Screen
Welcome
Home Dashboard - Game Tab
Game Tab
Invite Friends
Invite

Tech Stack
Category,Technology,Version,Purpose
Frontend,Next.js,14.x,"Server-side rendering, routing"
UI Library,React,18.x,Component-based UI
Styling,CSS Modules / Plain CSS,-,"Responsive, mobile-first design"
Icons,HTML Entities / Emojis,-,Simple iconography
State Mgmt,"React Hooks (useState, useEffect)",-,Local state management
Backend,Node.js / Express (planned),-,API server
Database,mySQL / MongoDB (planned),-,"User data, games, leaderboards"
Auth,NextAuth.js / JWT,-,User authentication
Real-time,Socket.io (planned),-,Multiplayer sync
Deployment,Vercel,-,Hosting and CI/CD
CategoryTechnologyVersionPurposeFrontendNext.js14.xServer-side rendering, routingUI LibraryReact18.xComponent-based UIStylingCSS Modules / Plain CSS-Responsive, mobile-first designIconsHTML Entities / Emojis-Simple iconographyState MgmtReact Hooks (useState, useEffect)-Local state managementBackendNode.js / Express (planned)-API serverDatabasePostgreSQL / MongoDB (planned)-User data, games, leaderboardsAuthNextAuth.js / JWT-User authenticationReal-timeSocket.io (planned)-Multiplayer syncDeploymentVercel-Hosting and CI/CD

Installation

Prerequisites

Node.js (v18+)
npm or yarn
Git

Quick Start

Clone the RepositoryBashgit clone https://github.com/yourusername/syonit.git
cd syonit
Install DependenciesBashnpm install
# or
yarn install
Environment Setup
Create a .env.local file in the root directory:textNEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
Run the Development ServerBashnpm run dev
# or
yarn devOpen http://localhost:3000 in your browser.
Build for ProductionBashnpm run build
npm start

Docker (Optional)
If using Docker:
Bashdocker-compose up -d
Usage
Development Workflow

Hot Reloading: Changes to code auto-refresh the browser.
Testing: Run npm test for unit tests (add Jest if needed).
Linting: npm run lint to check code style.

Key Pages & Routes

/ - Home Dashboard (Game, Idea, Leaderboard, Special Events)
/signup - Multi-step registration
/welcome - Post-signup profile setup
/how-to-play - Tutorial slider
/invite - Friend invitation system
/game/[id] - Live game session (planned)

Example: Starting a Game

Navigate to the Home tab.
Click "READY UP" to join a session.
Answer Y/N questions in real-time.
Track points and progress on the leaderboard.

Project Structure
textsyonit/
├── pages/
│   ├── api/              # API routes (auth, games, users)
│   │   ├── auth/[...nextauth].js
│   │   ├── games/
│   │   └── users/
│   ├── index.js          # Home dashboard
│   ├── signup.js         # Multi-step signup
│   ├── welcome.js        # Profile setup
│   ├── how-to-play.js    # Tutorial
│   └── invite.js         # Invites
├── public/
│   ├── styles.css        # Global styles
│   └── images/           # Static assets (icons, logos)
├── components/           # Reusable UI components
│   ├── Header.js
│   ├── Slider.js
│   ├── ProgressBar.js
│   └── NavButtons.js
├── utils/                # Helpers
│   ├── api.js
│   └── constants.js
├── styles/               # CSS modules (if used)
└── README.md
API Endpoints





















































MethodEndpointDescriptionAuth RequiredPOST/api/auth/signupUser registrationNoPOST/api/auth/verifyEmail verificationNoGET/api/games/activeFetch active gamesYesPOST/api/games/joinJoin a game sessionYesPOST/api/invites/sendSend friend inviteYesGET/api/leaderboardGet top playersNoGET/api/quotes/randomFetch motivational quoteNo
Note: Full API documentation coming soon. Currently, backend is mocked with local state.
Contributing
Contributions are welcome! Please follow these steps:

Fork the project.
Create a feature branch (git checkout -b feature/AmazingFeature).
Commit changes (git commit -m 'Add some AmazingFeature').
Push to the branch (git push origin feature/AmazingFeature).
Open a Pull Request.

Guidelines

Use ESLint for code style.
Write tests for new features.
Update documentation.
Keep PRs focused on single changes.

License
This project is licensed under the MIT License - see the LICENSE file for details.
Contact
Your Name - @yourtwitter - your.email@example.com
Project Link: https://github.com/yourusername/syonit
Roadmap
v1.0 (Current)

 Core UI: Signup, Tutorial, Home, Invite
 Basic Game Mechanics: Y/N answers, points
 Static Content: Quotes, Leaderboard placeholders

v1.1 (Upcoming)

 Real-time Backend: Socket.io for multiplayer
 Database Integration: User persistence
 Push Notifications: Game invites
 Analytics Dashboard

v2.0 (Future)

 AI-Generated Questions
 Cross-Platform App (React Native)
 NFT Integration for Prizes
 Global Tournaments


⭐ Star this repo if you found it helpful! Contributions and feedback are always appreciated. Let's make SYONIT the go-to yes/no game! 🚀