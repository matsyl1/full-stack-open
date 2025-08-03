import { Gender, NewPatient, EntryType, HealthCheckRating } from "./types";
import z from 'zod';

const newPatientSchema = z.object({
    name: z.string().min(1),
    dateOfBirth: z.iso.date(),
    ssn: z.string().min(9),
    gender: z.enum(Gender),
    occupation: z.string().min(1),
});

export const toNewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
};


const baseEntrySchema = z.object({
  description: z.string().min(1),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional(),
});


const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.Hospital),
  discharge: z.object({
    date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid discharge date" }),
    criteria: z.string().min(1),
  }),
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.OccupationalHealthcare),
  employerName: z.string().min(1),
  sickLeave: z.object({
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid sick leave start date" }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid sick leave end date" }),
  }).optional(),
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.HealthCheck),
  healthCheckRating: z.enum(HealthCheckRating),
});

const newEntrySchema = z.discriminatedUnion('type', [
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  healthCheckEntrySchema,
]);

export type NewEntry = z.infer<typeof newEntrySchema>;

export const toNewEntry = (object: unknown): NewEntry => {
  return newEntrySchema.parse(object);
};