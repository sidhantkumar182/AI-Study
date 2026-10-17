export const mockQuizzes = [
  {
    id: 'quiz_001',
    pdfId: 'pdf_001',
    pdfName: 'Introduction to Machine Learning.pdf',
    title: 'Machine Learning Fundamentals',
    difficulty: 'medium',
    createdAt: '2025-07-15T11:00:00Z',
    completed: false,
    questions: [
      {
        id: 'q_001',
        question: 'Which of the following best describes "overfitting" in machine learning?',
        options: [
          'When a model performs poorly on both training and test data',
          'When a model performs well on training data but poorly on unseen data',
          'When a model performs well on test data but poorly on training data',
          'When a model has too few parameters to capture data patterns',
        ],
        correctAnswer: 1,
        explanation:
          'Overfitting occurs when a model learns the training data too specifically, including noise, resulting in poor generalization to new, unseen data. The model has "memorized" rather than "learned."',
      },
      {
        id: 'q_002',
        question: 'What does the learning rate (α) control in gradient descent?',
        options: [
          'The number of training epochs',
          'The size of steps taken during optimization',
          'The number of features used in the model',
          'The ratio of training to test data',
        ],
        correctAnswer: 1,
        explanation:
          'The learning rate controls the step size taken in the direction of the negative gradient. A high learning rate may overshoot the minimum; a low learning rate may cause very slow convergence.',
      },
      {
        id: 'q_003',
        question: 'Which regularization technique adds the absolute value of weights as a penalty?',
        options: [
          'L2 Regularization (Ridge)',
          'Dropout',
          'L1 Regularization (Lasso)',
          'Batch Normalization',
        ],
        correctAnswer: 2,
        explanation:
          'L1 regularization (Lasso) adds the sum of the absolute values of model weights to the loss function. This can lead to sparse models where some weights become exactly zero, effectively performing feature selection.',
      },
      {
        id: 'q_004',
        question: 'In cross-validation, what is the primary purpose of the validation set?',
        options: [
          'To train the final model',
          'To tune hyperparameters and assess generalization',
          'To test the model after training is complete',
          'To normalize the input features',
        ],
        correctAnswer: 1,
        explanation:
          'The validation set is used during model development to tune hyperparameters and get an unbiased evaluation of model performance. The test set is reserved for final evaluation only.',
      },
      {
        id: 'q_005',
        question: 'Which of the following is an example of unsupervised learning?',
        options: [
          'Predicting house prices from features',
          'Email spam classification',
          'K-Means clustering of customer segments',
          'Image recognition with labeled dataset',
        ],
        correctAnswer: 2,
        explanation:
          'K-Means clustering is unsupervised learning — it groups data points into clusters based on similarity without any labeled training data. The other options all use labeled data (supervised learning).',
      },
      {
        id: 'q_006',
        question: 'What is the output of the sigmoid activation function?',
        options: [
          'Any real number between -∞ and +∞',
          'A value between 0 and 1',
          'A value between -1 and 1',
          'Only 0 or 1 (binary)',
        ],
        correctAnswer: 1,
        explanation:
          'The sigmoid function σ(x) = 1/(1+e^-x) maps any input to a value between 0 and 1. This makes it useful for binary classification output layers.',
      },
      {
        id: 'q_007',
        question: 'Which metric is most appropriate for evaluating a highly imbalanced classification problem?',
        options: [
          'Accuracy',
          'Mean Squared Error',
          'F1-Score or ROC-AUC',
          'R-squared',
        ],
        correctAnswer: 2,
        explanation:
          'For imbalanced datasets, accuracy is misleading (a model predicting the majority class always would have high accuracy). F1-Score (harmonic mean of precision and recall) and ROC-AUC are much more informative.',
      },
      {
        id: 'q_008',
        question: 'What does PCA (Principal Component Analysis) do?',
        options: [
          'Increases the number of features to improve accuracy',
          'Reduces dimensionality by projecting data onto principal components',
          'Classifies data into predefined categories',
          'Generates synthetic training samples',
        ],
        correctAnswer: 1,
        explanation:
          'PCA is a dimensionality reduction technique that projects data onto orthogonal axes (principal components) that capture the maximum variance, reducing the number of features while preserving most information.',
      },
      {
        id: 'q_009',
        question: 'In a Random Forest, how are individual decision trees made different from each other?',
        options: [
          'By using different activation functions',
          'By training on different epochs',
          'By using bootstrap sampling and random feature subsets',
          'By applying different learning rates',
        ],
        correctAnswer: 2,
        explanation:
          'Random Forests use bootstrap aggregating (bagging) — each tree trains on a random sample of the data — and random feature selection at each split. This creates diverse trees whose aggregated predictions reduce variance.',
      },
      {
        id: 'q_010',
        question: 'Which statement about the bias-variance tradeoff is correct?',
        options: [
          'Increasing model complexity always reduces both bias and variance',
          'Simple models tend to have high variance and low bias',
          'Complex models tend to have high variance and low bias',
          'Bias and variance are completely independent of each other',
        ],
        correctAnswer: 2,
        explanation:
          'As model complexity increases, bias decreases (fewer assumptions) but variance increases (more sensitive to training data). The goal is to find the sweet spot minimizing total error = bias² + variance + irreducible noise.',
      },
    ],
  },
  {
    id: 'quiz_002',
    pdfId: 'pdf_003',
    pdfName: 'Organic Chemistry Reactions.pdf',
    title: 'Nucleophilic Substitution Reactions',
    difficulty: 'hard',
    createdAt: '2025-07-18T12:30:00Z',
    completed: true,
    score: 7,
    questions: [
      {
        id: 'q_011',
        question: 'Which substrate reacts most readily via SN2 mechanism?',
        options: [
          '(CH₃)₃CBr — tert-butyl bromide',
          'CH₃Br — methyl bromide',
          '(CH₃)₂CHBr — isopropyl bromide',
          'CH₃CH₂CH₂CH₂Br — n-butyl bromide',
        ],
        correctAnswer: 1,
        explanation:
          'Methyl bromide is the most reactive in SN2 because it has minimal steric hindrance, allowing the nucleophile to easily attack the electrophilic carbon from the back.',
      },
      {
        id: 'q_012',
        question: 'What is the stereochemical outcome of an SN1 reaction at a chiral center?',
        options: [
          'Complete retention of configuration',
          'Complete inversion of configuration',
          'Racemic mixture (both enantiomers)',
          'Elimination product only',
        ],
        correctAnswer: 2,
        explanation:
          'SN1 proceeds through a planar carbocation intermediate that can be attacked from either face, giving approximately equal amounts of both enantiomers — a racemic mixture.',
      },
    ],
  },
];

export const generateMockQuestions = (difficulty = 'medium', count = 5) => {
  return mockQuizzes[0].questions.slice(0, count);
};
