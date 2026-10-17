export const mockUser = {
  id: 'usr_001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'student',
  plan: 'pro',
  createdAt: '2024-09-01T00:00:00Z',
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      studyReminders: true,
      weeklyReport: true,
    },
    studyGoalHours: 4,
  },
  stats: {
    totalStudyHours: 148,
    quizzesTaken: 43,
    flashcardsReviewed: 312,
    pdfsUploaded: 18,
    currentStreak: 7,
    longestStreak: 22,
  },
};

export const mockUsers = [
  mockUser,
  {
    id: 'usr_002',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'student',
    plan: 'free',
    createdAt: '2024-10-15T00:00:00Z',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        studyReminders: true,
        weeklyReport: false,
      },
      studyGoalHours: 3,
    },
    stats: {
      totalStudyHours: 67,
      quizzesTaken: 18,
      flashcardsReviewed: 145,
      pdfsUploaded: 7,
      currentStreak: 3,
      longestStreak: 10,
    },
  },
];
