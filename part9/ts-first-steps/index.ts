import express from 'express';
import { bmiCalculator } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());



app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  const he = Number(height);
  const we = Number(weight);

  if(!height || !weight || isNaN(he) || isNaN(we)) {
    return res.status(400).json({ error: 'malformatted params' });
  }

  const bmi = bmiCalculator(he, we);

  return res.json({
    weight: we,
    height: he,
    bmi
  });
});

app.post('/exercises', (req, res) => {
  console.log('BODY:', req.body);
  const body = req.body as { daily_exercises: unknown; target: unknown };

  if (body.daily_exercises === undefined || body.target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  const dailyExercises = body.daily_exercises;
  const target = Number(body.target);

  if (
    !Array.isArray(dailyExercises) ||
    dailyExercises.some(dayExHrs => isNaN(Number(dayExHrs))) ||
    isNaN(target)
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(dailyExercises.map(Number), target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});