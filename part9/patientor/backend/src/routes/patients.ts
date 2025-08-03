import express from 'express';
import patientsService from '../services/patientsService';
import { NewEntry, toNewEntry, toNewPatient } from '../utils';
import { Response } from 'express';
import { NonSensitivePatient, Patient, Entry } from '../types';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
    res.send(patientsService.getNonSensitivePatients());
});

patientsRouter.get('/:id', (req, res: Response<Patient | { error: string }>) => {
    const patient = patientsService.getPatientById(req.params.id);
    if (patient) {
        res.json(patient);
    } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

patientsRouter.post('/', (req, res) => {
    try {
         const newPatient = toNewPatient(req.body);
         const addedPatient = patientsService.addPatient(newPatient);
          res.json(addedPatient);

    } catch (error: unknown) {
       let errorMessage = 'Something went wrong';
       if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
       } 
       res.status(400).send(errorMessage);
    }
});

patientsRouter.post('/:id/entries', (req, res) => {
  try {
    const id = req.params.id;
    const newEntry: NewEntry = toNewEntry(req.body);
    const addedEntry: Entry = patientsService.addEntry(id, newEntry);
    res.json(addedEntry);
  } catch (e) {
    res.status(400).send(e instanceof Error ? e.message : 'Unknown error');
  }
});


export default patientsRouter;