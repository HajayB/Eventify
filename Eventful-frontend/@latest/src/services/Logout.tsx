import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const logoutUrl = baseUrl +"/auth/logout";

export async function Logout(){
    const token = localStorage.getItem("creatorToken") || sessionStorage.getItem("creatorToken");
if (!token){
    alert("No token provided");
}

const headers = {
    "Content-Type":"application/json",
    Authorization:`Bearer ${token}`
}
const response = await axios.post(logoutUrl, {headers})

}