import { Link } from "react-router-dom";

export default function NotFound() {
    return(
        <div className="text-center mt-50">
            <p className="text-5xl mb-10">404 - Page not found :/</p>
            <button className="btn btn-primary btn-xl"><Link to="/">Go to home</Link></button>
        </div>
    )
}