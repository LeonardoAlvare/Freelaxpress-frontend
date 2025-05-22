import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://proaula-be-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});
