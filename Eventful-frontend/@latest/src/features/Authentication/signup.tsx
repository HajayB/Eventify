//sign up page design 
import styles from "./signup.module.css"
import { useState } from "react"
import axios from "axios";
import{Link, useNavigate} from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

function SignupPage(){
  usePageTitle("Sign Up");
    const url = "http://localhost:4000/api/auth/register";
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("EVENTEE");
    let navigate = useNavigate();

    function handleLogoClick (){
        navigate("/");
    }
    function handleNameChange(event:any){
        setName(event.target.value)
    }

    function handleEmailChange(event:any){
        setEmail(event.target.value)
    }

    function handlePasswordChange(event:any){
        setPassword(event.target.value)
    }

    function HandleRoleChange(event:any){
        setRole(event.target.value)
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
            const {data} = await axios.post(url, {
            name, email, password, role
        }); 
        

        if(data.status>= 200 && data.status < 300){
            displayMessage(data.message, "success");
            setTimeout(() => {
                navigate("/login");
            }, 4000);
        }
        }
        catch(error:any){
            console.error(error)
            displayMessage(
            error.response?.data?.message || "Something went wrong",
            "error"
            );
        }

        }

    return (
        
            <div className={styles.AuthPage}>
                 <div className={styles.logo}>
                    <h1 onClick={handleLogoClick}>Event<span>ify</span></h1>
                </div>
                <form onSubmit={handleFormSubmit} className={styles.authForm} id="formId">
                    <h2>Create Account</h2>
                <input value={name} onChange={handleNameChange} type="text" placeholder="Name"/>

                <input value={email} onChange={handleEmailChange} type="email" placeholder="Email"/>
                
                <input value={password} onChange={handlePasswordChange} type="password" placeholder="Password"/>
                <div className={styles.roleGroup}>               
                    <input type="radio" id="eventee" name="role" value="EVENTEE" onChange={HandleRoleChange}/>
                    <label htmlFor="eventee">EVENTEE</label>
                    <input type="radio" id="creator" name="role" value="CREATOR" onChange={HandleRoleChange}/>
                    <label htmlFor="creator">CREATOR</label><br></br>
                </div>

                <button type="submit">Sign Up</button>

                <p className={styles.switchAuth}>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>

    )
}

export default SignupPage