// onboardingSteps.js
export const HomeSteps = [
  {
    key: 'points',
    text: 'This shows your points. You score when you choose the minority.',
    selector: '[data-guide="points"]',
  },
  {
    key: 'game',
    text: 'This card shows the current game state.',
    selector: '[data-guide="game"]',
  },
  {
    key: 'timer',
    text: 'When this timer ends, the game starts.',
    selector: '[data-guide="timer"]',
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
