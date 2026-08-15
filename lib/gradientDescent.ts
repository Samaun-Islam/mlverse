export interface DescentStep {
  step: number;
  x: number;
  loss: number;
}

export function lossFunction(x: number): number {
  return x * x + 2;
}

export function derivative(x: number): number {
  return 2 * x;
}

export function runGradientDescent(
  startX: number,
  learningRate: number,
  maxSteps: number = 40
): DescentStep[] {
  const steps: DescentStep[] = [];
  let x = startX;

  for (let i = 0; i <= maxSteps; i++) {
    steps.push({ step: i, x, loss: lossFunction(x) });

    if (Math.abs(derivative(x)) < 0.01) break;

    const grad = derivative(x);
    x = x - learningRate * grad;

    if (Math.abs(x) > 50) {
      steps.push({ step: i + 1, x, loss: lossFunction(x) });
      break;
    }
  }

  return steps;
}

export function generateCurvePoints(): { x: number; y: number }[] {
  const points = [];
  for (let x = -10; x <= 10; x += 0.25) {
    points.push({ x: parseFloat(x.toFixed(2)), y: lossFunction(x) });
  }
  return points;
}