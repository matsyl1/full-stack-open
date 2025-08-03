import diagnosesData from '../../data/diagnoses';
import { Diagnose } from '../types';

const getDiagnoses = (): Diagnose[] => {
    return diagnosesData;
};

export default { getDiagnoses };