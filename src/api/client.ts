import axios from "axios";

const API_BASE_URL = "https://treeserver.vercel.app/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Define types for your Supabase tables
export interface Tree {
  id: number;
  common_name: string;
  species: string | null;
  family: string | null;
}

// Example API calls
export const fetchTrees = async (): Promise<Tree[]> => {
  const response = await apiClient.get("/trees");
  return response.data;
};
