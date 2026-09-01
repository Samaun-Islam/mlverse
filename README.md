# MLVerse

*Interactive Machine Learning Learning Platform  
 Project Overview*

---

## 1. Motivation

Machine Learning is usually taught through textbooks, static slides, or videos  the learner reads a formula, is told what it means, and has to imagine how it behaves. In my own experience, this was the hardest part of learning ML: not memorizing formulas, but forming an intuitive picture of what a formula actually does as its inputs change.

MLVerse was built to close that gap. Instead of only reading about gradient descent, overfitting, or decision boundaries, the user can drag a slider, click on a chart, or type in a number, and watch the underlying mathematics respond in real time. The goal is to turn abstract theory into something that can be seen and felt, not just read.

## 2. Project Overview

MLVerse is a full-stack (client-only) web application that teaches Machine Learning through three connected modules: Concepts, Algorithms, and Playground. Every visualization is powered by real mathematics implemented in TypeScript  there are no hardcoded or fake results; each output is computed live from the user's input.

| Module | Purpose | Count |
|---|---|---|
| Concepts | Core ML ideas explained through interactive sliders (Gradient Descent, Overfitting, Bias-Variance, Train-Test Split, Confusion Matrix, KNN's K value) | 6 |
| Algorithms | Step-by-step interactive demos of real ML algorithms (Linear/Logistic Regression, Decision Tree, KNN, K-Means, Naive Bayes) | 6 |
| Playground | Live prediction tools using the same math logic, applied to realistic and real datasets (House Price, Flower Species, Pass/Fail) | 3 |

## 3. Tech Stack

| Layer | Technology | Why it was used |
|---|---|---|
| Framework | Next.js 15 (App Router) | File-based routing, fast dev server, easy static/dynamic route generation for `[slug]` pages |
| Language | TypeScript | Type safety for the math logic (interfaces for data points, models, results) reduces runtime bugs |
| Styling | Tailwind CSS | Rapid, consistent utility-based styling across dozens of components |
| Animation | Framer Motion | Declarative animations for sliders, chart transitions, page-load reveals |
| Charts | Recharts | Line/Scatter/Composed charts for most visualizations |
| Custom Visuals | Raw SVG | Used where click-to-add-point interactivity was needed (Linear Regression, KNN Playground) beyond what a charting library easily supports |
| Icons | lucide-react | Consistent icon set across Navbar, cards, and demos |
| Deployment | Vercel (connected to GitHub) | Zero-config Next.js hosting; every push to GitHub auto-deploys |

Important design decision: the entire application is client-side. There is no backend server, no database, and no external API calls for the ML computations. Every algorithm  gradient descent, least-squares regression, KNN distance calculation, Gini-based tree splitting, K-Means iteration, Naive Bayes probability  runs directly in the user's browser using plain JavaScript/TypeScript. This keeps hosting free and simple, and makes every result fully transparent and reproducible.

## 4. Architecture & Data Flow

At a structural level, the project follows this route hierarchy:

```
/ (Home)
/concepts                      -> list of 6 concept cards
/concepts/[slug]                -> interactive demo for one concept
/concepts/[slug]/notes          -> detailed written explanation
/algorithms                     -> list of 6 algorithm cards
/algorithms/[slug]              -> interactive demo for one algorithm
/algorithms/[slug]/notes        -> detailed written explanation
/playground                     -> list of 3 live prediction tools
/playground/[algo]              -> the prediction tool itself
/about                          -> project philosophy
```

Every interactive demo follows the same internal data flow:

```
User Input (slider / click / dropdown)
        |
        v
React state update (useState)
        |
        v
Pure math function in lib/*.ts
  (e.g. runGradientDescent, fitPolynomial, classifyPoint,
   trainLogisticRegression, computeMetrics)
        |
        v
Derived result (numbers, coordinates, model weights)
        |
        v
Chart / SVG re-render (Recharts or raw SVG) + Framer Motion transition
```

This separation  UI components in `components/`, pure computational logic in `lib/` means every algorithm's mathematics can be reasoned about (and reused) independently of how it is displayed. For example, the Linear Regression, KNN, and Logistic Regression logic built for the Algorithms module is directly reused inside the Playground module (House Price Predictor, Flower Classifier, Pass/Fail Predictor).

## 5. Key Features

### 5.1 Concepts Module

- **Gradient Descent**: step-by-step animated descent along a loss curve, with learning-rate and starting-point controls.
- **Overfitting vs Underfitting**: adjustable polynomial degree with live train/test error comparison.
- **Bias-Variance Tradeoff**: 20 simulated datasets fitted simultaneously to visualize the classic bias/variance "spaghetti plot" and U-shaped error curve.
- **Train-Test Split**: adjustable split ratio with warnings when the test set becomes statistically unreliable.
- **Confusion Matrix**: manual TP/FP/TN/FN entry with live Accuracy, Precision, Recall, and F1 calculation.
- **KNN (K value)**: adjustable K with a live-redrawn 2D decision boundary.

### 5.2 Algorithms Module

- **Linear Regression**: click-to-add data points with an animated best-fit line and R² score.
- **Logistic Regression**: adjustable decision threshold over a trained sigmoid curve.
- **Decision Tree**: adjustable max depth, rendered as both a decision-boundary chart and an actual tree diagram (Gini-based recursive splitting).
- **K-Nearest Neighbors**: click-to-query with visual nearest-neighbor connections and live vote breakdown.
- **K-Means Clustering**: animated, step-by-step centroid convergence (unsupervised).
- **Naive Bayes**: interactive spam-word selection with live Bayesian probability breakdown.

### 5.3 Playground Module

- **House Price Predictor**  multi-feature Linear Regression (area, bedrooms, location).
- **Flower Species Classifier**  KNN trained on the real, historical Fisher's Iris Dataset (1936).
- **Student Pass/Fail Predictor**  2-feature Logistic Regression with a decision-boundary heatmap.

## 6. Challenges Faced

**Folder structure / dynamic routes on Windows**: Creating bracket-named folders like `[slug]` through PowerShell caused silent naming failures. Solved by creating these folders directly through the VS Code file explorer instead of the terminal.

**React 19 "setState inside effect" warnings**: Resetting animation state whenever a slider changed initially used a `useEffect` that called `setState` synchronously, which React 19 flags as a bad pattern. Solved by moving state resets into event handlers directly, and in one case by using a `key` prop to force a clean remount of the animated sub-component.

**TypeScript/Recharts type mismatches**: Recharts' Tooltip `formatter` expects a broader `ValueType` (`number | string | array`) than a plain number, causing cascading type errors. Solved by explicitly narrowing the type before formatting.

**Theme inconsistency (dark/light)**: The site initially used light-theme colors, but the browser's forced dark mode inverted colors unpredictably, making text unreadable in several places. Solved by converting the entire site to a single, explicit dark theme (`bg-gray-950/900`, `text-white/gray-300`) instead of relying on system color-scheme inversion.

**Numerical stability in regression**: Fitting higher-degree polynomials (for the Overfitting demo) using the normal equation can produce a near-singular matrix. Solved with a small regularization term (`1e-6`) added to the diagonal before Gaussian elimination.

**Multi-dimensional visualization**: The Iris dataset has 4 features, which cannot be plotted directly in 2D. Solved by classifying using all 4 (normalized) features internally, while visualizing only the two most discriminative features (petal length and width) on the chart.

## 7. Limitations

- Two of the three Playground datasets (House Price, Student Pass/Fail) are synthetically generated rather than sourced from real-world data; only the Flower Classifier uses a genuine historical dataset (Iris).
- All models are trained on small, fixed datasets (tens to a few hundred points) suitable for instant, client-side computation  not representative of production-scale ML training.
- There is no backend, so no user accounts, saved progress, or persistent history across sessions.
- Some algorithms are simplified for clarity (e.g. the Decision Tree does not implement pruning; K-Means is not guaranteed to reach the global optimum on every run).
- Explanatory text mixes Bengali and English; while intentional for accessibility, it is not the same as a fully localized single-language product.

## 8. Future Scope

- Replace remaining synthetic datasets with real, cited public datasets.
- Add more algorithms (Random Forest, a simple Neural Network) as an extension of the Algorithms module.
- Add a quiz/assessment layer per concept to reinforce learning.
- Add user accounts to save progress and completed modules.

## 9. Conclusion

MLVerse demonstrates that Machine Learning concepts, which are traditionally taught through static text and formulas, can be made significantly more intuitive through direct, real-time interaction. By implementing every algorithm's mathematics from scratch in TypeScript and connecting the same logic across three progressively deeper modules  Concepts, Algorithms, and Playground  the project provides a coherent, hands-on learning path from first principles to real predictions, all running entirely in the browser.
