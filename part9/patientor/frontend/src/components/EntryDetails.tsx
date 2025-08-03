import React from "react";
import { Entry, EntryType } from "../types";
import { Box, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

interface EntryDetailsProps {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry }) => {
  switch (entry.type) {
  case EntryType.Hospital:
    return (
      <Box sx={{ border: "1px dotted gray", padding: 1, marginBottom: 1 }}>
        <Typography variant="subtitle1">
          <LocalHospitalIcon /> {entry.date} - Hospital Entry
        </Typography>
        <Typography>{entry.description}</Typography>
        <Typography>Discharge Date: {entry.discharge.date}</Typography>
        <Typography>Criteria: {entry.discharge.criteria}</Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic", marginTop: 1 }}>
          diagnose/check by {entry.specialist}
        </Typography>
      </Box>
    );

  case EntryType.OccupationalHealthcare:
    return (
      <Box sx={{ border: "1px dotted gray", padding: 1, marginBottom: 1 }}>
        <Typography variant="subtitle1">
          <WorkIcon /> {entry.date} - Occupational Healthcare / {entry.employerName}
        </Typography>
        <Typography>{entry.description}</Typography>
        {entry.sickLeave && (
          <Typography>
            Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
          </Typography>
        )}
        <Typography variant="body2" sx={{ fontStyle: "italic", marginTop: 1 }}>
          diagnose/check by {entry.specialist}
        </Typography>
      </Box>
    );

  case EntryType.HealthCheck:
    const getHealthRatingColor = (rating: number): "success" | "warning" | "error" | "disabled" => {
      switch (rating) {
      case 0:
        return "success"; 
      case 1:
        return "warning"; 
      case 2:
        return "error";   
      case 3:
        return "disabled"; 
      default:
        return "disabled";
      }
    };
    
    return (
      <Box sx={{ border: "1px dotted gray", padding: 1, marginBottom: 1 }}>
        <Typography variant="subtitle1">
          <MedicalServicesIcon /> {entry.date} - Health Check
        </Typography>
        <Typography>{entry.description}</Typography>
        <FiberManualRecordIcon color={getHealthRatingColor(entry.healthCheckRating)} />
        <Typography variant="body2" sx={{ fontStyle: "italic", marginTop: 1 }}>
            diagnose/check by {entry.specialist}
        </Typography>
      </Box>
    );

  default:
    return assertNever(entry);
  }
};

export default EntryDetails;
