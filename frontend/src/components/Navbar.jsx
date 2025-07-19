import { Link } from "react-router-dom";

export default function NavBar() {
    return(
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link className="btn btn-ghost text-3xl ml-5" to={{ pathname: "/"}}>Polling System</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                <li><Link className="btn btn-primary btn-lg m-5" to={{ pathname: "/"}}>Create Poll</Link></li>
                <li><Link className="btn btn-primary btn-lg m-5" to={{ pathname: "/signup"}}>Sign up or Login</Link></li>
                </ul>
            </div>
        </div>
    );
}