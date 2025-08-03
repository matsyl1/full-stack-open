interface Result {
    periodLength: number;
    trainingDays: number;
    targetMet: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number
}

const parseArguments = (argv: string[]): { hours: number[]; target: number} => {
    if (argv.length !== 10) throw new Error('Provide nr of exercise hrs mon-to-sun (7) and target (1)');
    
    const values: number[] = argv.slice(2).map(n => Number(n));
        
    const [mon, tue, wed, thu, fri, sat, sun, target] = values;

    return { hours: [mon, tue, wed, thu, fri, sat, sun], target};
};


export const calculateExercises = (hours: number[], target: number): Result => {
    const periodLength: number = hours.length;
    const trainingDays: number = hours.filter(h => h !== 0).length;
    const average: number = hours.reduce((acc, cv) => acc + cv, 0) / hours.length;
    const targetMet: boolean = average >= target;
    let rating: number;
        if (average > 2) {
            rating = 3;
        } else if (average < 1.5) {
            rating = 1;
        } else {
            rating = 2;
        }
    let ratingDescription: string = '';
        if (average > 2) {
            ratingDescription = 'Solid work!';
        } else if (average < 1.5) {
            ratingDescription = 'You really need to get more active...';
        } else {
            ratingDescription = 'Just fine, but not more than that.';
        }
    
    return {
        periodLength,
        trainingDays,
        targetMet,
        rating,
        ratingDescription,
        target,
        average
    };
};

if (require.main === module) {
    try {
        const { target, hours } = parseArguments(process.argv);
        console.log(calculateExercises(hours, target));
    } catch (error: unknown) {
        if (error instanceof Error) {
        console.error('Error:', error.message);
        }
    } 
}