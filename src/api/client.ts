import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

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

// In a React component or API client file
export const testConnection = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/ping");
    console.log(response.data); // Should show { message: "Backend is alive!" }
  } catch (error) {
    console.error("Backend connection failed:", error);
  }
};
