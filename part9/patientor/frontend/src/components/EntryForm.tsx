import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, MenuItem, Select } from "@mui/material";
import { Entry, EntryType, NewEntry } from "../types";

interface EntryFormProps {
  patientId: string;
  onEntryAdded: (newEntry: Entry) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ patientId, onEntryAdded }) => {
  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("0");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const createNewEntry = (): NewEntry => {
      switch (entryType) {
      case EntryType.HealthCheck:
        return {
          type: EntryType.HealthCheck,
          description,
          date,
          specialist,
          healthCheckRating: Number(healthCheckRating),
        };
      case EntryType.Hospital:
        return {
          type: EntryType.Hospital,
          description,
          date,
          specialist,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
      case EntryType.OccupationalHealthcare:
        const entry: NewEntry = {
          type: EntryType.OccupationalHealthcare,
          description,
          date,
          specialist,
          employerName,
        };
        if (sickLeaveStart && sickLeaveEnd) {
          entry.sickLeave = {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd,
          };
        }
        return entry;
      default:
        throw new Error("Incorrect entry type");
      }
    };

    const newEntry = createNewEntry();

    try {
      const response = await axios.post(`http://localhost:3000/api/patients/${patientId}/entries`, newEntry);
      onEntryAdded(response.data);

      setDescription("");
      setDate("");
      setSpecialist("");
      setHealthCheckRating("0");
      setDischargeDate("");
      setDischargeCriteria("");
      setEmployerName("");
      setSickLeaveStart("");
      setSickLeaveEnd("");
    } catch (error: unknown) {
      if(error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ border: "1px dotted gray", padding: 1, marginBottom: 1 }}>
      <h3>New entry</h3>
      <Select
        labelId="entry-type-label"
        value={entryType}
        label="Entry Type"
        onChange={(e) => setEntryType(e.target.value as EntryType)}
        required
      >
        <MenuItem value={EntryType.Hospital}>Hospital</MenuItem>
        <MenuItem value={EntryType.OccupationalHealthcare}>Occupational Healthcare</MenuItem>
        <MenuItem value={EntryType.HealthCheck}>Health Check</MenuItem>
      </Select>

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
        fullWidth
        margin="normal"
        required
      />

      {entryType === EntryType.HealthCheck && (
        <TextField
          label="Health Check Rating (0-3)"
          value={healthCheckRating}
          onChange={(e) => setHealthCheckRating(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 0, max: 3, type: "number" }}
        />
      )}

      {entryType === EntryType.Hospital && (
        <>
          <TextField
            label="Discharge Date"
            type="date"
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Discharge Criteria"
            value={dischargeCriteria}
            onChange={(e) => setDischargeCriteria(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </>
      )}

      {entryType === EntryType.OccupationalHealthcare && (
        <>
          <TextField
            label="Employer Name"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Sick Leave Start Date"
            type="date"
            value={sickLeaveStart}
            onChange={(e) => setSickLeaveStart(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Sick Leave End Date"
            type="date"
            value={sickLeaveEnd}
            onChange={(e) => setSickLeaveEnd(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}

      {error && <Typography color="error">{error}</Typography>}

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Add Entry
      </Button>
    </Box>
  );
};

export default EntryForm;

