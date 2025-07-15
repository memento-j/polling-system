import NavBar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [validUsername, setValidUsername] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validPassword2, setValidPassword2] = useState(true);
    const navigate = useNavigate();

    return(
        <div>
            <NavBar />
            <div className="mt-50 flex justify-center ">
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-2xl border p-4">
                    <legend className="fieldset-legend text-4xl">Sign up</legend>
                    
                    <label className="label text-2xl mt-5 ml-7 mb-2">Username</label>
                    <input id="username" type="text" className="input w-xl ml-7 text-lg" placeholder="Username" />
                    {!validUsername && <p className="text-error ml-7 text-[16px]">Username must be 6-16 characters using only letters and numbers</p>}

                    <label className="label text-2xl mt-5 ml-7 mb-2">Email</label>
                    <input id="email" type="email" className="input w-xl ml-7 text-lg" placeholder="Email" />
                    {!validEmail && <p className="text-error ml-7 text-[16px]">Must enter valid email</p>}

                    <label className="label text-2xl mt-5 ml-7 mb-2">Password</label>
                    <input id="password" type="password" className="ml-7 input w-xl text-lg" placeholder="Password" />
                    {!validPassword && <p className="text-error ml-7 text-[16px]">Password must have at least 1 or more numbers, letters, and non-alphanumeric characters and be 8-32 characters long</p>}

                    <label className="label text-2xl mt-5 ml-7 mb-2">Re-enter Password</label>
                    <input id="password2" type="password" className="ml-7 input w-xl text-lg" placeholder="Re-enter Password" />
                    {!validPassword2 && <p className="text-error ml-7 text-[16px]">Passwords do not match</p>}

                    <input type="submit" value="Sign up" className="btn btn-primary btn-lg m-10 text-xl" onClick={() => {
                        //get inputs to validate them before adding user to db
                        const username = document.getElementById("username").value;
                        const email = document.getElementById("email").value;
                        const password = document.getElementById("password").value;
                        const password2 = document.getElementById("password2").value;
                        
                        //check username is only letters and numbers between 6 and 16 characters
                        const usernameRegex = /^[0-9A-Za-z]{6,16}$/;
                        if (!usernameRegex.test(username)) {
                            setValidUsername(false);
                            return;
                        }
                        else {
                            setValidUsername(true);
                        }

                        //check for valid email
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        if (!emailRegex.test(email)) {
                            setValidEmail(false);
                            return;
                        }
                        else {
                            setValidEmail(true);
                        }

                        //check password
                        const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Za-z])(?=.*?[^0-9A-Za-z]).{8,32}$/;
                        if (!passwordRegex.test(password)) {
                            setValidPassword(false);
                            return;
                        }
                        else {
                            setValidPassword(true);
                        }

                        //check if  passwords match
                        if (password !== password2) {
                            setValidPassword2(false)
                            return;
                        }
                        else {
                            setValidPassword2(true)
                        }
                        
                        //create new user object
                        const newUser = {
                            username,
                            email,
                            password
                        }


                        //create user object to store into db
                        //store into db with error handling as well
                        fetch("http://localhost:8080/user/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser),
                        })
                        .then((response) => {
                            if (!response.ok) {
                            throw new Error("Network response was not ok");
                            }
                            return response.json();
                        })
                        .then((data) => {
                            //check if duplicate was found and return if it was


                            console.log("user added successfully:", data);
                            //navigate to homepage
                            navigate(`/`); 
                        })
                        .catch((error) => {
                            console.error("Error adding user:", error);
                        });
                    }}/> 
                </fieldset>
            </div>
        </div>
    );
}