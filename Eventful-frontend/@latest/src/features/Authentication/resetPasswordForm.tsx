//sign up page design 
import styles from "./signup.module.css"
import { useState, useEffect } from "react"
import{Link,useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";

function ResetPasswordFormPage(){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    function displayMessage(message:string, type = "success") {
        const element = document.createElement("p");
        element.textContent = message;
        if (type === "success") {
            element.style.color = "green";
        } else {
            element.style.color = "red";
        }
        const container = document.getElementById("formId");
        container?.append(element);
        setTimeout(() => {
            element.remove();
        }, 3000);
    }
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = baseUrl+"/auth/reset-password";

    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");

        if (!tokenFromUrl) {
        displayMessage("Token is missing", "error");
        return;
    }

    setToken(tokenFromUrl);
    console.log(tokenFromUrl);
  }, [searchParams]);

    async function handleFormSubmit(e: any){
        e.preventDefault();
        try{
            const response = await axios.post(url, {
            token,newPassword,confirmPassword
        })
        const data = response.data;
        if(response.status>= 200 && response.status < 300){
            displayMessage(data.message, "success");
            setTimeout(() => {
                navigate("/login");
            }, 4000);
        }
        
    }catch(error:any){
            console.error(error);
            displayMessage(
            error.response?.data?.message || "Something went wrong",
            "error"
            );
        }
    }
    function handlePasswordChange(event:any){
        setNewPassword(event.target.value)
    }
    function handleConfirmPasswordChange(event:any){
        setConfirmPassword(event.target.value)
    }
    function handleLogoClick (){
        navigate("/");
    }
    return(
        <>
            <div className={styles.AuthPage}>
                <div className={styles.logo}>
                    <h1 onClick={handleLogoClick}>Event<span>ify</span></h1>
                </div>
                <form onSubmit={handleFormSubmit} className={styles.authForm} id="formId">
                    <h2 className={styles.resetPageH1}>Create new password</h2>

                <input value={newPassword} onChange={handlePasswordChange} type="text" placeholder="Enter New Password"/>
                <input value={confirmPassword} onChange={handleConfirmPasswordChange} type="text" placeholder="Confirm Password"/>
                
                <button type="submit" >Send</button>

                <p className={styles.switchAuth}>Want a new account? <Link to="/register" className={styles.linkColor}>Sign Up</Link></p>
                </form>
            </div>
        </>
    )
}

export default ResetPasswordFormPage