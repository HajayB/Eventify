//sign up page design 
import styles from "./signup.module.css"
import { useState } from "react"
import{Link,useNavigate} from "react-router-dom";
import axios from "axios";

function ResetPasswordPage(){
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
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = baseUrl+"/auth/reset-password-link";
    const [email, setEmail] = useState("");
    async function handleFormSubmit(e: any){
        e.preventDefault();
        try{
            const response = await axios.post(url, {
            email
        })
        const data = response.data;
        if(response.status>= 200 && response.status < 300){
            displayMessage(data.message, "success")
        }
        
    }catch(error:any){
            console.error(error);
            displayMessage(
            error.response?.data?.message || "Something went wrong",
            "error"
            );
        }
    }
    function handleEmailChange(event:any){
        setEmail(event.target.value)
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
                    <h2 className={styles.resetPageH1}>Enter email address to receive reset link</h2>

                <input value={email} onChange={handleEmailChange} type="email" placeholder="Email"/>
                
                {/* <p className={styles.resetPass}>Forgot Password? <Link to="/register" className={styles.linkColor}>Reset Password</Link></p> */}
                <button type="submit" >Send</button>

                <p className={styles.switchAuth}>Want a new account? <Link to="/register" className={styles.linkColor}>Sign Up</Link></p>
                </form>
            </div>
        </>
    )
}

export default ResetPasswordPage