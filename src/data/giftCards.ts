export interface GiftCard {
  id: string;
  name: string;
  image: string;
  color: string;
  amounts: number[];
  regions?: string[];
  howToRedeem: string[];
}

export const giftCards: GiftCard[] = [
  { 
    id: 'steam', 
    name: 'Steam Wallet', 
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop', 
    color: 'from-blue-600 to-blue-900',
    amounts: [5, 10, 25, 50, 100],
    regions: ['Global', 'US', 'EU'],
    howToRedeem: [
      'Log in to your Steam account.',
      'Go to "Games" in the top menu and select "Redeem a Steam Wallet Code".',
      'Enter your code and click "Continue".',
      'The funds will be added to your Steam Wallet.'
    ]
  },
  { 
    id: 'psn', 
    name: 'PlayStation Network', 
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop', 
    color: 'from-blue-500 to-indigo-800',
    amounts: [5, 10, 25, 50, 100],
    regions: ['US', 'UK', 'EU'],
    howToRedeem: [
      'Go to the PlayStation Store on your console or browser.',
      'Select your profile icon at the top of the screen.',
      'Select "Redeem Codes" from the drop-down menu.',
      'Enter the code and select "Redeem".'
    ]
  },
  { 
    id: 'xbox', 
    name: 'Xbox Live Gold', 
    image: 'https://images.unsplash.com/photo-1605901302636-2b217d848148?q=80&w=800&auto=format&fit=crop', 
    color: 'from-green-500 to-green-800',
    amounts: [5, 10, 25, 50, 100],
    regions: ['Global', 'US', 'EU'],
    howToRedeem: [
      'Press the Xbox button to open the guide, and then select "Store".',
      'Press the View button to open the side menu, and then select "Redeem".',
      'Enter the 25-character code, select "Next", and then follow the prompts.'
    ]
  },
  { 
    id: 'nintendo', 
    name: 'Nintendo eShop', 
    image: 'https://images.unsplash.com/photo-1605901302939-00378b4ca50a?q=80&w=800&auto=format&fit=crop', 
    color: 'from-red-500 to-red-800',
    amounts: [5, 10, 25, 50, 100],
    regions: ['US', 'EU', 'JP'],
    howToRedeem: [
      'Select the Nintendo eShop icon on the HOME Menu.',
      'Select the account you want to use.',
      'Select "Enter Code" on the left side of the screen.',
      'Enter the 16-character download code and select "OK".'
    ]
  },
  { 
    id: 'apple', 
    name: 'App Store & iTunes', 
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop', 
    color: 'from-gray-400 to-gray-700',
    amounts: [5, 10, 25, 50, 100],
    regions: ['US', 'UK', 'Global'],
    howToRedeem: [
      'Open the App Store app on your device.',
      'At the top of the screen, tap the sign-in button or your photo.',
      'Tap "Redeem Gift Card or Code".',
      'Enter your code and tap "Redeem".'
    ]
  },
  { 
    id: 'google', 
    name: 'Google Play', 
    image: 'https://images.unsplash.com/photo-1607252656733-fd7407043173?q=80&w=800&auto=format&fit=crop', 
    color: 'from-emerald-400 to-cyan-600',
    amounts: [5, 10, 25, 50, 100],
    regions: ['US', 'UK', 'Global'],
    howToRedeem: [
      'Open the Google Play app.',
      'At the top right, tap the profile icon.',
      'Tap "Payments & subscriptions" and then "Redeem gift code".',
      'Enter the code and tap "Redeem".'
    ]
  },
];
