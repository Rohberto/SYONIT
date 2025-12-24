// Helper function to pick an icon based on prize name keywords
export const getIconForPrize = (name) => {
  const nameLower = name.toLowerCase();
  
  // Match keywords in prize name to appropriate icons
  if (nameLower.includes('game') || nameLower.includes('console') || nameLower.includes('playstation') || nameLower.includes('xbox')) {
    return "Gamepad2";
  }
  if (nameLower.includes('headphone') || nameLower.includes('audio') || nameLower.includes('earphone')) {
    return "Headphones";
  }
  if (nameLower.includes('shirt') || nameLower.includes('cloth') || nameLower.includes('apparel')) {
    return "Shirt";
  }
  if (nameLower.includes('car') || nameLower.includes('vehicle') || nameLower.includes('auto')) {
    return "Car"; // You'll need to import this: import { Car } from 'lucide-react';
  }
  if (nameLower.includes('bike') || nameLower.includes('tricycle') || nameLower.includes('cycle')) {
    return "Bike"; // import { Bike } from 'lucide-react';
  }
  if (nameLower.includes('banner') || nameLower.includes('flag')) {
    return "Flag"; // import { Flag } from 'lucide-react';
  }
  if (nameLower.includes('card') || nameLower.includes('voucher')) {
    return "Gift";
  }
  
  // Default icon for unrecognized prizes
  return "Gift";
};

// Generate colors dynamically based on prize ID or use a rotation
export const getColorForPrize = (index) => {
  const colors = [
    'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', // Purple-Pink
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', // Blue-Cyan
    'linear-gradient(135deg, #22c55e 0%, #10b981 100%)', // Green-Emerald
    'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)', // Orange-Amber
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Violet
    'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', // Teal
    'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', // Rose
  ];
  
  // Rotate through colors based on index
  return colors[index % colors.length];
};