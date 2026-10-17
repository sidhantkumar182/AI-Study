export const mockSummaries = [
  {
    id: 'sum_001',
    pdfId: 'pdf_001',
    pdfName: 'Introduction to Machine Learning.pdf',
    readingTime: 8,
    createdAt: '2025-07-15T10:00:00Z',
    shortSummary:
      'Machine learning enables computers to learn from data without explicit programming. This document covers supervised, unsupervised, and reinforcement learning paradigms, key algorithms, and evaluation metrics.',
    detailedSummary: `Machine Learning (ML) is a subset of Artificial Intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. The learning process begins with observations or data — such as examples, direct experience, or instruction — to look for patterns in data and make better decisions in the future.

The primary types of machine learning are Supervised Learning, where the algorithm learns from labeled training data; Unsupervised Learning, where the algorithm discovers patterns in unlabeled data; and Reinforcement Learning, where an agent learns by interacting with an environment and receiving rewards or penalties.

**Supervised learning** is the most widely used form, encompassing algorithms like linear regression for continuous output prediction and classification algorithms like logistic regression, decision trees, random forests, and neural networks for categorical outputs. The key challenge is avoiding overfitting (learning training data too specifically) and underfitting (failing to capture underlying patterns).

**Model evaluation** relies on metrics appropriate to the task. For classification: accuracy, precision, recall, F1-score, and ROC-AUC. For regression: MAE, MSE, RMSE, and R-squared. Cross-validation helps ensure metrics generalize to unseen data.

**Feature engineering** — selecting and transforming input variables — often determines model performance more than algorithm choice. Techniques include normalization, one-hot encoding, and dimensionality reduction via PCA.

The **bias-variance tradeoff** is central to ML: high bias causes underfitting while high variance causes overfitting. Regularization techniques like L1 (Lasso) and L2 (Ridge) help manage this tradeoff.`,
    bulletPoints: [
      'Machine learning is a subset of AI enabling systems to learn from data',
      'Three paradigms: supervised, unsupervised, and reinforcement learning',
      'Supervised learning requires labeled data for classification and regression tasks',
      'Overfitting occurs when a model memorizes training data instead of learning patterns',
      'The bias-variance tradeoff is fundamental to model performance',
      'Gradient descent is the primary optimization algorithm for training neural networks',
      'Regularization (L1/L2) prevents overfitting by penalizing model complexity',
      'Cross-validation provides reliable performance estimates on unseen data',
      'Feature engineering often impacts performance more than algorithm selection',
      'Deep learning uses multi-layer neural networks for complex pattern recognition',
    ],
    keyTerms: [
      { term: 'Gradient Descent', definition: 'An optimization algorithm that iteratively minimizes a loss function by moving in the direction of steepest descent.' },
      { term: 'Overfitting', definition: 'When a model learns training data too specifically, including noise, leading to poor generalization.' },
      { term: 'Cross-Validation', definition: 'A technique to assess how a model generalizes to independent datasets by partitioning data into folds.' },
      { term: 'Regularization', definition: 'Techniques (L1, L2) that add a penalty term to the loss function to prevent overfitting.' },
      { term: 'Feature Engineering', definition: 'The process of using domain knowledge to transform raw data into features useful for ML models.' },
      { term: 'Bias-Variance Tradeoff', definition: 'The balance between a model\'s ability to minimize bias (error from assumptions) and variance (sensitivity to training data).' },
      { term: 'Hyperparameter', definition: 'Configuration variables set before training that control the learning process, such as learning rate and tree depth.' },
      { term: 'Loss Function', definition: 'A mathematical function measuring the difference between predicted and actual values during training.' },
    ],
    importantConcepts: [
      {
        title: 'The Learning Pipeline',
        explanation: 'Data collection → Preprocessing → Feature engineering → Model selection → Training → Evaluation → Deployment. Each stage critically impacts final performance.',
        importance: 'high',
      },
      {
        title: 'Bias-Variance Tradeoff',
        explanation: 'Simple models have high bias (underfitting); complex models have high variance (overfitting). Optimal model complexity balances both for best generalization.',
        importance: 'high',
      },
      {
        title: 'Gradient Descent Variants',
        explanation: 'Batch GD (stable but slow), Stochastic GD (fast but noisy), Mini-batch GD (practical balance). Adam optimizer adapts learning rates per parameter.',
        importance: 'high',
      },
      {
        title: 'Ensemble Methods',
        explanation: 'Combining multiple models (bagging, boosting, stacking) consistently outperforms single models. Random Forests and XGBoost are state-of-the-art for tabular data.',
        importance: 'medium',
      },
      {
        title: 'Neural Network Architecture',
        explanation: 'Layers of interconnected neurons apply non-linear transformations. Depth enables learning hierarchical features. Activation functions (ReLU, sigmoid) introduce non-linearity.',
        importance: 'medium',
      },
    ],
  },
  {
    id: 'sum_002',
    pdfId: 'pdf_003',
    pdfName: 'Organic Chemistry Reactions.pdf',
    readingTime: 5,
    createdAt: '2025-07-18T12:00:00Z',
    shortSummary:
      'A reference guide covering the most common organic chemistry reaction mechanisms including substitution (SN1, SN2), elimination (E1, E2), addition, and condensation reactions.',
    detailedSummary: `Organic chemistry reactions can be categorized by the type of bond breaking and forming that occurs. Understanding reaction mechanisms — the step-by-step process by which reactants transform into products — is essential for predicting and explaining chemical behavior.

**Nucleophilic substitution reactions** involve a nucleophile replacing a leaving group. The SN2 mechanism proceeds in a single concerted step with inversion of stereochemistry, favored by primary substrates and strong nucleophiles in polar aprotic solvents. The SN1 mechanism forms a carbocation intermediate, proceeds through two steps, and gives racemization, favored by tertiary substrates in polar protic solvents.

**Elimination reactions** form double bonds by removing atoms from adjacent carbons. E2 is a concerted one-step mechanism requiring anti-periplanar geometry, while E1 proceeds through a carbocation intermediate similar to SN1.

**Addition reactions** add atoms across double or triple bonds. Electrophilic addition to alkenes follows Markovnikov's rule. Radical additions follow anti-Markovnikov selectivity.`,
    bulletPoints: [
      'SN2 reactions occur in one step with inversion of configuration (Walden inversion)',
      'SN1 reactions proceed through a carbocation intermediate giving racemization',
      'E2 elimination requires anti-periplanar arrangement of leaving group and β-hydrogen',
      'Markovnikov\'s rule predicts the major product in electrophilic addition',
      'Resonance stabilization increases carbocation stability and SN1/E1 rates',
      'Steric hindrance favors elimination (E) over substitution (S)',
      'Strong bases favor elimination; good nucleophiles favor substitution',
    ],
    keyTerms: [
      { term: 'Nucleophile', definition: 'An electron-rich species that donates electrons to form a new bond.' },
      { term: 'Electrophile', definition: 'An electron-deficient species that accepts electrons.' },
      { term: 'Leaving Group', definition: 'An atom or group that departs with the bonding electrons.' },
      { term: 'Carbocation', definition: 'A positively charged carbon intermediate, stabilized by alkyl groups.' },
      { term: 'Markovnikov\'s Rule', definition: 'In electrophilic addition, H adds to the carbon with more hydrogens.' },
    ],
    importantConcepts: [
      {
        title: 'SN1 vs SN2 Deciding Factors',
        explanation: 'Primary → SN2. Tertiary → SN1. Secondary → depends on nucleophile strength and solvent. Strong nucleophile + polar aprotic → SN2. Weak nucleophile + polar protic → SN1.',
        importance: 'high',
      },
      {
        title: 'Stereochemistry in Substitution',
        explanation: 'SN2 always gives inversion (Walden inversion). SN1 gives racemic mixture (50:50 R and S) because nucleophile can attack from either face of the planar carbocation.',
        importance: 'high',
      },
    ],
  },
];
