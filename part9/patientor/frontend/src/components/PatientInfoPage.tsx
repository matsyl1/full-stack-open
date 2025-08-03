import { Patient, Entry } from "../types";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import patientsService from '../services/patients';
import EntryDetails from "./EntryDetails";
import EntryForm from "./EntryForm";


const PatientInfoPage = () => {
  const { id: patientId } = useParams<{ id: string }>();
  
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!patientId) return;
    const fetchPatient = async () => {
      try {
        const data = await patientsService.getById(patientId);
        setPatient(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPatient();
  }, [patientId]);

  if (!patientId) {
    return <div>Invalid patient ID</div>;
  }

  if (!patient) {
    return <div>Loading patient data...</div>;
  }

  const onEntryAdded = (newEntry: Entry) => {
    setPatient({
      ...patient,
      entries: [...patient.entries, newEntry]
    });
  };

  return (
    <>
      <h3>{patient.name}</h3>
      <p>Date of birth: {patient.ssn}</p>
      <p>Gender: {patient.gender}</p>
      <p>Occupation: {patient.occupation}</p>
      <EntryForm patientId={patientId} onEntryAdded={onEntryAdded}/>
      <h4>Journal entries</h4>
      {patient.entries.map((entry) => (
        <div key={entry.id}>
          <EntryDetails entry={entry} />
        </div>
      ))}
    </>

  );
};

export default PatientInfoPage;
