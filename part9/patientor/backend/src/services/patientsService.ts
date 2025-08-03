import patientsData from '../../data/patients';
import { Patient, NewPatient, NonSensitivePatient, Entry, NewEntry } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
    return patientsData;
};

const getPatientById = (id: string): Patient | undefined => {
    return patientsData.find(p => p.id === id);
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
    return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const addPatient = (entry: NewPatient): Patient => {
    const id = uuid();
    const newPatient: Patient = {
        id,
        ...entry,
        entries: []
    };
    patientsData.push(newPatient);
    return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = patientsData.find(p => p.id === patientId);

  if (!patient) {
    throw new Error(`Patient with id ${patientId} not found`);
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);

  return newEntry;
};


export default { getPatients, getPatientById, getNonSensitivePatients, addPatient, addEntry };