export const mockChats = [
  {
    id: 'chat_001',
    title: 'ML Algorithms Explained',
    pdfId: 'pdf_001',
    pdfName: 'Introduction to Machine Learning.pdf',
    createdAt: '2025-07-15T10:00:00Z',
    updatedAt: '2025-07-15T10:45:00Z',
    messages: [
      {
        id: 'msg_001',
        role: 'user',
        content: 'Can you explain how gradient descent works in simple terms?',
        timestamp: '2025-07-15T10:00:00Z',
      },
      {
        id: 'msg_002',
        role: 'assistant',
        content: `## Gradient Descent — Simple Explanation 🎯

Imagine you're hiking in the mountains and you want to reach the **lowest valley** (minimum). You can't see the whole terrain, but you can feel which way is downhill from where you stand.

**Here's how gradient descent works:**

1. **Start somewhere** — Initialize at a random point on the loss landscape
2. **Calculate the slope** — Find the gradient (direction of steepest ascent)
3. **Step downhill** — Move in the *opposite* direction of the gradient
4. **Repeat** — Keep taking steps until you reach (near) the bottom

### The Math
The update rule is:
\`\`\`
θ = θ - α × ∇J(θ)
\`\`\`
Where:
- **θ** = parameters (weights)
- **α** = learning rate (step size)
- **∇J(θ)** = gradient of the loss function

### Key Variants
| Type | Description | When to use |
|------|-------------|-------------|
| **Batch GD** | Uses entire dataset | Small datasets |
| **Stochastic GD** | Uses one sample | Very large datasets |
| **Mini-batch GD** | Uses small batches | Most practical cases |

The **learning rate** α is crucial — too large and you overshoot, too small and training is very slow.`,
        timestamp: '2025-07-15T10:00:30Z',
      },
      {
        id: 'msg_003',
        role: 'user',
        content: 'What is overfitting and how do we prevent it?',
        timestamp: '2025-07-15T10:15:00Z',
      },
      {
        id: 'msg_004',
        role: 'assistant',
        content: `## Overfitting — What It Is & How to Fix It

**Overfitting** occurs when a model learns the training data *too well*, including its noise and random fluctuations, making it perform poorly on new, unseen data.

Think of it like a student who **memorizes exam answers** rather than understanding concepts — they fail when questions are slightly different.

### Signs of Overfitting
- 📈 High training accuracy
- 📉 Low validation/test accuracy
- Large gap between train and test performance

### Prevention Techniques

**1. Regularization**
\`\`\`python
# L2 Regularization (Ridge)
loss = MSE + λ × Σ(weights²)
\`\`\`

**2. Dropout** — randomly deactivate neurons during training

**3. More Training Data** — more data = less overfitting

**4. Cross-Validation** — evaluate on multiple validation sets

**5. Early Stopping** — stop training when validation loss increases

**6. Simplify the Model** — reduce parameters/layers`,
        timestamp: '2025-07-15T10:15:45Z',
      },
      {
        id: 'msg_005',
        role: 'user',
        content: 'Can you compare supervised vs unsupervised learning?',
        timestamp: '2025-07-15T10:30:00Z',
      },
      {
        id: 'msg_006',
        role: 'assistant',
        content: `## Supervised vs Unsupervised Learning

### Supervised Learning 👨‍🏫
- **Has labeled data** — You provide input-output pairs
- Model learns to **map inputs to correct outputs**
- Examples: Classification, Regression

**Algorithms:** Linear Regression, Decision Trees, Neural Networks, SVM

**Use case:** Email spam detection, image classification, price prediction

---

### Unsupervised Learning 🔍
- **No labels** — Model finds patterns on its own
- Discovers **hidden structure** in data
- Examples: Clustering, Dimensionality Reduction

**Algorithms:** K-Means, DBSCAN, PCA, Autoencoders

**Use case:** Customer segmentation, anomaly detection, topic modeling

---

### Quick Comparison

| Feature | Supervised | Unsupervised |
|---------|------------|--------------|
| Labels | Required | Not needed |
| Goal | Predict output | Find structure |
| Evaluation | Easy (accuracy) | Hard |
| Examples | 90% of ML tasks | Exploratory analysis |`,
        timestamp: '2025-07-15T10:30:20Z',
      },
    ],
  },
  {
    id: 'chat_002',
    title: 'Calculus Derivatives Help',
    pdfId: 'pdf_002',
    pdfName: 'Calculus — Stewart 8th Edition.pdf',
    createdAt: '2025-07-16T09:00:00Z',
    updatedAt: '2025-07-16T09:30:00Z',
    messages: [
      {
        id: 'msg_007',
        role: 'user',
        content: 'Explain the chain rule with examples',
        timestamp: '2025-07-16T09:00:00Z',
      },
      {
        id: 'msg_008',
        role: 'assistant',
        content: `## The Chain Rule 🔗

The chain rule is used to differentiate **composite functions** — functions within functions.

### Formula
If **y = f(g(x))**, then:
\`\`\`
dy/dx = f'(g(x)) × g'(x)
\`\`\`

Or using Leibniz notation:
\`\`\`
dy/dx = (dy/du) × (du/dx)
\`\`\`

### Example 1: Simple Case
Find the derivative of **y = (3x + 1)⁵**

- Let u = 3x + 1, so y = u⁵
- dy/du = 5u⁴
- du/dx = 3
- **Answer:** dy/dx = 5(3x+1)⁴ × 3 = **15(3x+1)⁴**

### Example 2: Trigonometric
Find d/dx[sin(x²)]

- f(u) = sin(u), g(x) = x²
- f'(u) = cos(u), g'(x) = 2x
- **Answer:** cos(x²) × 2x = **2x·cos(x²)**`,
        timestamp: '2025-07-16T09:00:25Z',
      },
    ],
  },
  {
    id: 'chat_003',
    title: 'Organic Chemistry Mechanisms',
    pdfId: 'pdf_003',
    pdfName: 'Organic Chemistry Reactions.pdf',
    createdAt: '2025-07-18T11:30:00Z',
    updatedAt: '2025-07-18T12:00:00Z',
    messages: [
      {
        id: 'msg_009',
        role: 'user',
        content: 'What is SN1 vs SN2 mechanism?',
        timestamp: '2025-07-18T11:30:00Z',
      },
      {
        id: 'msg_010',
        role: 'assistant',
        content: `## SN1 vs SN2 Nucleophilic Substitution

These are two mechanisms for substitution reactions in organic chemistry.

### SN2 (Bimolecular Nucleophilic Substitution)
- **One step** — concerted mechanism
- Nucleophile attacks at the **same time** as leaving group departs
- Results in **inversion of configuration** (Walden inversion)
- Rate depends on both substrate and nucleophile: **Rate = k[substrate][nucleophile]**
- Favored by: Primary substrates, strong nucleophiles, polar aprotic solvents

### SN1 (Unimolecular Nucleophilic Substitution)
- **Two steps** — forms carbocation intermediate
- **Step 1:** Leaving group departs → carbocation
- **Step 2:** Nucleophile attacks carbocation
- Can give **racemization** (both configurations)
- Rate depends only on substrate: **Rate = k[substrate]**
- Favored by: Tertiary substrates, weak nucleophiles, polar protic solvents

### Quick Comparison
| Feature | SN2 | SN1 |
|---------|-----|-----|
| Steps | 1 | 2 |
| Substrate | 1° best | 3° best |
| Stereochemistry | Inversion | Racemization |
| Solvent | Polar aprotic | Polar protic |`,
        timestamp: '2025-07-18T11:30:35Z',
      },
    ],
  },
];

export const mockSuggestedPrompts = [
  'Summarize the key concepts in this chapter',
  'Create practice questions for me',
  "Explain this topic like I'm 10 years old",
  'What are the most important formulas?',
  'Compare and contrast these two concepts',
  'What will likely be on the exam?',
  'Give me real-world examples of this',
  'Create a study plan for this material',
];
