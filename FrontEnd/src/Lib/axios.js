import axios from "axios";
export const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==="production"?"/api":"http://localhost:5002/api",
    withCredentials:true,
});