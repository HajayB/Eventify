//sign up page design 
import styles from "./signup.module.css"
import { useState } from "react"
import{Link,useNavigate} from "react-router-dom";
import axios from "axios";


function LoginPage(){
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = baseUrl+"/auth/login";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();
    function handleEmailChange(event:any){
        setEmail(event.target.value)
    }

    function handlePasswordChange(event:any){
        setPassword(event.target.value)
    }
    function handleLogoClick (){
        navigate("/");
    }
    

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
    }

    async function handleFormSubmit(e: any){
        e.preventDefault();
        try{
            const response = await axios.post(url, 
            {email, password}, { withCredentials: true })
        const data = response.data;

        if(response.status>= 200 && response.status < 300){
            displayMessage(data.message, "success");
            if(data.user.role==="CREATOR"){
                // Save user (object → must stringify)
                localStorage.setItem("creator", JSON.stringify(data.user));
                setTimeout(() => {
                navigate("/creator/dashboard");
            }, 4000);
            }
            else{
                // Save user (object → must stringify)
                localStorage.setItem("eventee", JSON.stringify(data.user));                
                setTimeout(() => {
                navigate("/dashboard");
            }, 4000);
            }
        }
    }
        catch(error:any){
            console.error(error);
            displayMessage(
            error.response?.data?.message || "Something went wrong",
            "error"
            );
        }   
    }


    return (
        <>

        <div className={styles.AuthPage}>
                <div className={styles.logo}>
                    <h1 onClick={handleLogoClick}>Event<span>ify</span></h1>
                </div>
                <form onSubmit={handleFormSubmit} className={styles.authForm} id="formId">
                    <h2>Welcome Back</h2>

                <input value={email} onChange={handleEmailChange} type="email" placeholder="Email"/>

                <input value={password} onChange={handlePasswordChange} type="password" placeholder="Password"/><br></br>
                
                <p className={styles.resetPass}>Forgot Password? <Link to="/reset-password-link" className={styles.linkColor}>Reset Password</Link></p>
                <button type="submit" >Login</button>

                <p className={styles.switchAuth}>Want a new account? <Link to="/register" className={styles.linkColor}>Sign Up</Link></p>
                </form>
            </div>
        </>


    )
}

export default LoginPage