import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
    const { user, setUser } = useUser();
    const [showSignout, setShowSignout] = useState(false);

    //get user data
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const response = await fetch("http://localhost:8080/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            //ensure cookies can be passed to backend
            credentials: "include",
            });
            //no one is signed in
            if (!response.ok) {
            setUser(null);
            }
            //someone is signed in, so store the user data
            else {
            const data = await response.json();
            setUser(data);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
        };

        fetchUser();
    }, []);

    //logout functionality
    async function logout() {
        try {
            const res = await fetch("http://localhost:8080/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });
            if (!res.ok) {
                throw new Error("Logout unsuccessful")
            }
            const resJson = await res.json();
            setUser(null);
            setShowSignout(true);
            //after 2 seconds remove messaage when page renders again
            setTimeout(() => setShowLogoutMessage(false), 2000);            
        } catch(error) {
            console.error("error:", error);
        }
    }

    return(
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link className="btn btn-ghost text-5xl ml-10 p-8" to={{ pathname: "/"}}>Polling System</Link>
            </div>
            {/* signed out message */}
            { showSignout && 
                <div role="alert" className="alert alert-success text-2xl w-100 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="z-20 h-6 w-6 shrink-0 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>You have signed out.</span>
                </div>           
            }

            <div className="flex-none">
            { user != null ? 
            (
                <ul className="menu menu-horizontal px-1 mr-10">
                    <li><Link className="btn btn-primary btn-lg text-xl m-5" to={{ pathname: "/create-poll"}}>Create Public/Private Poll</Link></li>
                    <li onClick={logout} className="btn btn-primary text-xl btn-lg m-5">Logout of {user.username}</li>
                </ul>
            ) : 
                 <ul className="menu menu-horizontal px-1 mr-10">
                    <li><Link className="btn btn-primary btn-lg text-xl m-5" to={{ pathname: "/create-poll"}}>Create Public Poll</Link></li>
                    <li><Link className="btn btn-primary btn-lg text-xl m-5" to={{ pathname: "/signup"}}>Sign up or Login</Link></li>
                </ul>           
            }
            </div>
        </div>
    );
}