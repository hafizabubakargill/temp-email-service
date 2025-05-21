
import { EmailType } from '@/types/email';

// Function to generate a random email address
export const generateRandomEmail = (): string => {
  const username = Math.random().toString(36).substring(2, 10);
  const domains = ['disposmail.com', 'tempbox.io', 'quickmail.xyz'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  return `${username}@${domain}`;
};

// Mock data for emails
const mockEmails: EmailType[] = [
  {
    id: '1',
    sender: 'Netflix <info@netflix.com>',
    subject: 'New shows added to your watchlist',
    body: '<p>Hello,</p><p>We\'ve added new shows that match your interests. Check out these titles that we think you\'ll love:</p><ul><li>Stranger Things Season 4</li><li>The Witcher: Blood Origin</li><li>Wednesday</li></ul><p>Start watching now!</p><p>Netflix Team</p>',
    snippet: 'We\'ve added new shows that match your interests. Check out these titles that we think you\'ll love...',
    date: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
    labels: ['Entertainment', 'Subscription']
  },
  {
    id: '2',
    sender: 'Amazon <orders@amazon.com>',
    subject: 'Your Amazon order has shipped',
    body: '<p>Hello,</p><p>Your recent order (#AB123456) has shipped and is on its way to you!</p><p>Estimated delivery: Tomorrow by 8pm</p><p>Track your package: <a href="#">Track now</a></p><p>Thank you for shopping with Amazon!</p>',
    snippet: 'Your recent order (#AB123456) has shipped and is on its way to you! Estimated delivery: Tomorrow by 8pm...',
    date: new Date(Date.now() - 45 * 60000).toISOString(),
    read: true,
    labels: ['Shopping']
  },
];

// Additional mock emails that can be added during refresh
const additionalMockEmails: EmailType[] = [
  {
    id: '3',
    sender: 'Twitter <info@twitter.com>',
    subject: 'Security alert: new login to your account',
    body: '<p>Hello,</p><p>We noticed a new login to your Twitter account from a new device. Was this you?</p><p>Device: iPhone 14<br>Location: New York, USA<br>Time: Just now</p><p>If this was you, you can ignore this message. If not, please secure your account immediately by <a href="#">changing your password</a>.</p>',
    snippet: 'We noticed a new login to your Twitter account from a new device. Was this you?',
    date: new Date().toISOString(),
    read: false,
    labels: ['Security', 'Social']
  },
  {
    id: '4',
    sender: 'LinkedIn <notifications@linkedin.com>',
    subject: 'You have 3 new connection requests',
    body: '<p>Hello,</p><p>You have 3 new connection requests waiting for your review:</p><ul><li>John Doe, Software Engineer at Google</li><li>Jane Smith, Product Manager at Apple</li><li>Alex Johnson, UX Designer at Microsoft</li></ul><p><a href="#">Review your connections</a></p>',
    snippet: 'You have 3 new connection requests waiting for your review: John Doe, Software Engineer at Google...',
    date: new Date(Date.now() - 5 * 60000).toISOString(),
    read: false,
    labels: ['Social', 'Professional']
  },
];

// Function to fetch mock emails
export const fetchEmails = async (includeNew: boolean = false): Promise<EmailType[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      if (includeNew && Math.random() > 0.5) {
        // 50% chance to get a new email when refreshing
        const randomIndex = Math.floor(Math.random() * additionalMockEmails.length);
        const newEmail = {
          ...additionalMockEmails[randomIndex],
          id: Date.now().toString(),  // Ensure unique ID
          date: new Date().toISOString()  // Current timestamp
        };
        resolve([newEmail]);
      } else {
        resolve(includeNew ? [] : [...mockEmails]);
      }
    }, 1000);
  });
};
