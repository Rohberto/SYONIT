// onboardingSteps.js
export const HomeSteps = [
  {
    key: 'welcome',
    text: 'Welcome to SYONIT! This is a strategic game where you aim to be in the minority. Let\'s take a quick tour.',
    selector: '[data-guide="game"]', // Center on the main game card
  },
  {
    key: 'objective',
    text: 'Your goal: Choose differently from the majority of players to score points and win prizes!',
    selector: '[data-guide="game"]',
  },
  {
    key: 'points',
    text: 'This shows your current point and progress to winning the prize pool.',
    selector: '[data-guide="points"]',
  },
  {
    key: 'screen',
    text: 'This section displays the main game content, including live-game, quotes, leaderboard and more.',
    selector: '[data-guide="screen"]',
  },
  {
    key: 'timer',
    text: 'This countdown shows when the next game starts. Get ready to make your choice!',
    selector: '[data-guide="timer"]',
  },
  {
    key: 'online-status',
    text: 'See how many players are online and currently in game.',
    selector: '[data-guide="online"]',
  },
  {
    key: 'actions',
    text: 'Use INVITE to bring friends, and READY UP to join the next game!',
    selector: '[data-guide="actions"]', // The INVITE and READY UP buttons
  },
  {
    key: 'profile',
    text: 'Access your profile and settings here.',
    selector: '[data-guide="profile"]', // Top left profile icon
  },
  {
    key: 'rules',
    text: 'Tap this icon anytime to review the game rules.',
    selector: '[data-guide="rules"]', // Top right book icon
  },
  {
    key: 'final',
    text: 'You\'re all set! Wait for the timer to reach zero, then make your strategic choice. Good luck!',
    selector: '[data-guide="game"]',
  },
];

export const OnboardingSteps = [
  {
    key: 'welcome',
    text: 'Welcome to SYONIt! Let me guide you through the basics. Click the "Get Started" button to begin your experience, and make sure your sound is on.',
    selector: '[data-guide="onboarding-welcome"]',
  },
 
];


export const IntroSteps = [
  {
 key: 'auth',
  text: 'If you don’t have an account, please register to get started. If you already have one, just log in!',
  selector: '[data-guide="onboarding-auth"]',
  }
 ];
