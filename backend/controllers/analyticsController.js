export const getAnalytics = async (req, res, next) => {
  try {
    const stats = {
      totalFlashcards: 312,
      quizAccuracy: 88,
      averageDailyHours: 3.2,
      topicsCompleted: 18,
      studyHours: [
        { date: "2025-07-01", value: 2.5 },
        { date: "2025-07-05", value: 3.8 },
        { date: "2025-07-10", value: 4.2 },
        { date: "2025-07-15", value: 3.5 },
        { date: "2025-07-20", value: 5.0 },
      ],
      quizAccuracyTrend: [
        { date: "2025-07-01", value: 75 },
        { date: "2025-07-05", value: 82 },
        { date: "2025-07-10", value: 85 },
        { date: "2025-07-15", value: 90 },
      ],
      subjectDistribution: [
        { name: "Computer Science", value: 45, color: "#6366f1" },
        { name: "Mathematics", value: 30, color: "#06b6d4" },
        { name: "Chemistry", value: 15, color: "#f59e0b" },
        { name: "Physics", value: 10, color: "#10b981" },
      ],
      topicsList: [
        { topic: "Neural Networks & Backpropagation", completed: 8, total: 10, percentage: 80 },
        { topic: "Integration Techniques", completed: 6, total: 8, percentage: 75 },
        { topic: "Organic Chemistry Reactions", completed: 4, total: 10, percentage: 40 },
      ],
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
