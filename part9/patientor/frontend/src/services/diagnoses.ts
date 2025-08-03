import axios from "axios";
import { Diagnose } from "../types";
import { apiBaseUrl } from "../constants";

const getAll = async (): Promise<Diagnose[]> => {
  const response = await axios.get(`${apiBaseUrl}/diagnoses`);
  return response.data;
};

export default { getAll };