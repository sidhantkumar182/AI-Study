export const mockAnalytics = {
  studyHours: [
    { date: '2025-07-01', value: 2.5 },
    { date: '2025-07-02', value: 3.0 },
    { date: '2025-07-03', value: 1.5 },
    { date: '2025-07-04', value: 4.0 },
    { date: '2025-07-05', value: 2.0 },
    { date: '2025-07-06', value: 0.5 },
    { date: '2025-07-07', value: 3.5 },
    { date: '2025-07-08', value: 4.0 },
    { date: '2025-07-09', value: 2.0 },
    { date: '2025-07-10', value: 5.5 },
    { date: '2025-07-11', value: 3.0 },
    { date: '2025-07-12', value: 1.0 },
    { date: '2025-07-13', value: 0.0 },
    { date: '2025-07-14', value: 4.5 },
    { date: '2025-07-15', value: 6.0 },
    { date: '2025-07-16', value: 2.5 },
    { date: '2025-07-17', value: 3.5 },
    { date: '2025-07-18', value: 4.0 },
    { date: '2025-07-19', value: 3.0 },
    { date: '2025-07-20', value: 1.5 },
  ],
  quizAccuracy: [
    { date: '2025-07-01', value: 65 },
    { date: '2025-07-04', value: 70 },
    { date: '2025-07-07', value: 75 },
    { date: '2025-07-10', value: 68 },
    { date: '2025-07-13', value: 82 },
    { date: '2025-07-15', value: 78 },
    { date: '2025-07-18', value: 85 },
    { date: '2025-07-20', value: 88 },
  ],
  topicsCompleted: [
    { topic: 'Supervised Learning', completed: 8, total: 10, percentage: 80 },
    { topic: 'Calculus Derivatives', completed: 12, total: 15, percentage: 80 },
    { topic: 'Organic Chemistry', completed: 7, total: 12, percentage: 58 },
    { topic: 'Data Structures', completed: 9, total: 14, percentage: 64 },
    { topic: 'World History', completed: 4, total: 10, percentage: 40 },
    { topic: 'Microeconomics', completed: 5, total: 8, percentage: 63 },
    { topic: 'Neural Networks', completed: 3, total: 8, percentage: 38 },
  ],
  subjectDistribution: [
    { name: 'Computer Science', value: 35, color: '#6366f1' },
    { name: 'Mathematics', value: 25, color: '#f59e0b' },
    { name: 'Chemistry', value: 20, color: '#10b981' },
    { name: 'Economics', value: 12, color: '#ec4899' },
    { name: 'History', value: 8, color: '#8b5cf6' },
  ],
  heatmap: (() => {
    const data = [];
    const start = new Date('2025-01-01');
    for (let i = 0; i < 200; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const baseActivity = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.7;
      const count = Math.random() < baseActivity
        ? Math.floor(Math.random() * 4) + 1
        : 0;
      data.push({ date: dateStr, count });
    }
    return data;
  })(),
  weeklyPerformance: [
    { week: 'W24', quizScore: 65, studyHours: 18, flashcardsReviewed: 35 },
    { week: 'W25', quizScore: 72, studyHours: 22, flashcardsReviewed: 42 },
    { week: 'W26', quizScore: 68, studyHours: 20, flashcardsReviewed: 38 },
    { week: 'W27', quizScore: 78, studyHours: 26, flashcardsReviewed: 55 },
    { week: 'W28', quizScore: 82, studyHours: 24, flashcardsReviewed: 60 },
    { week: 'W29', quizScore: 85, studyHours: 19, flashcardsReviewed: 48 },
  ],
};

export const mockDashboardStats = {
  todayStudyHours: 1.5,
  weeklyStudyHours: 19.5,
  totalFlashcards: 312,
  quizAccuracy: 85,
  currentStreak: 7,
  documentsUploaded: 18,
  topicsCompleted: 48,
  averageDailyHours: 3.2,
};
