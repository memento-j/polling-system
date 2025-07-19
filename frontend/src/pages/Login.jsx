import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
export default function Login() {
    //state for when incorrect inputs are given
    //
    const navigate = useNavigate();

    async function handleSubmit(event) {
        //prevent page from refeshing on submit
        event.preventDefault();
        //get form data
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const user = {
            email,
            password
        }

        try {
            //login using endpoint
            const res = await fetch("http://localhost:8080/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(user)
            });
            //if bad response
            if (!res.ok) {
                throw new Error("failed to login")
            }
            navigate("/");
        } catch(error) {
            console.error("error:", error);
        }
        
    }

    return(
        <div>
            <NavBar />
            <p className="text-5xl text-center mt-30">Login to create private polls!</p>
            <div className="mt-30 flex justify-center ">
                <form onSubmit={handleSubmit}>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-2xl border p-4">
                        <legend className="fieldset-legend text-4xl">Login</legend>
                        {/* Email */}
                        <label className="label text-2xl mt-5 ml-7 mb-2">Email</label>
                        <input id="email" name="email" type="email" className="input w-xl ml-7 text-lg" placeholder="Email" />
                        {/* Password */}
                        <label className="label text-2xl mt-5 ml-7 mb-2">Password</label>
                        <input id="password" name="password" type="password" className="ml-7 input w-xl text-lg" placeholder="Password" />
                        {/* Submit button */}
                        <button className="btn btn-primary btn-xl my-15 mx-7" type="submit">Login</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}