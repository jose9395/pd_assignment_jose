import axios from "axios";
import dotenv from "dotenv";
import { PipedrivePersonPayload } from "../types/payload";

dotenv.config();
const apiKey = process.env.PIPEDRIVE_API_KEY!;
const companyDomain = process.env.PIPEDRIVE_COMPANY_DOMAIN!;

export const pipedriveApi = {
  searchPerson(name: string) {
    return axios.get(`https://${companyDomain}.pipedrive.com/api/v1/persons/search`, {
      params: { api_token: apiKey, term: name, fields: "name" }
    });
  },

  updatePerson(id: number, payload: PipedrivePersonPayload) {
    return axios.put(`https://${companyDomain}.pipedrive.com/api/v1/persons/${id}`, payload, {
      params: { api_token: apiKey }
    });
  },

  createPerson(payload: PipedrivePersonPayload) {
    return axios.post(`https://${companyDomain}.pipedrive.com/api/v1/persons`, payload, {
      params: { api_token: apiKey }
    });
  }
};
