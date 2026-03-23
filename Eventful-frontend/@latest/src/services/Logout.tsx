import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const logoutUrl = baseUrl +"/auth/logout";
export type GetLogoutResponse ={
    message :string, 

}
export async function Logout():Promise<GetLogoutResponse>{
try{
const response = await axios.post(logoutUrl, {}, {withCredentials:true})
localStorage.clear();
sessionStorage.clear();
console.log(response.data.message)
    return {
        message:response.data.message
    }
}
catch(error:any){
    throw error
}

}