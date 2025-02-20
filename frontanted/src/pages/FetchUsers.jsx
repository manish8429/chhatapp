import axios from "axios";
import { getToken } from "@/utils/auth";

export const fetchUsers = async () => {
  try {
    const token = getToken();
    const response = await axios.get("http://localhost:3000/api/getallusers", {
      headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
    });

    // console.log("Fetched Users:", response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    return [];
  }
};
