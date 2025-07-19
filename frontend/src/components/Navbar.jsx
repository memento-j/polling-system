import { Link } from "react-router-dom";

export default function NavBar() {

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
            console.log(resJson);

        } catch(error) {
            console.error("error:", error);
        }
    }

    return(
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link className="btn btn-ghost text-3xl ml-5" to={{ pathname: "/"}}>Polling System</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                <li><Link className="btn btn-primary btn-lg m-5" to={{ pathname: "/"}}>Create Poll</Link></li>
                <li onClick={logout} className="btn btn-primary btn-lg m-5">Logout</li>
                <li><Link className="btn btn-primary btn-lg m-5" to={{ pathname: "/signup"}}>Sign up or Login</Link></li>
                </ul>
            </div>
        </div>
    );
}