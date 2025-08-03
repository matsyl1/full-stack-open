export const bmiCalculator = (height: number, weight: number) => {
    const kgs = weight;
    const meters = height/100;
    const bmi = kgs / Math.pow(meters, 2);

    let range = '';
    if (bmi < 18) {
        range = 'Underweight';
    } else if (bmi < 25) {
        range = 'Normal range';
    } else {
        range = 'Overweight';
    }
    return range;
};

if (require.main === module) {
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);

  if (isNaN(height) || isNaN(weight)) {
    console.error('Provide valid numbers for height and weight');
    process.exit(1);
  }

  console.log(bmiCalculator(height, weight));
}