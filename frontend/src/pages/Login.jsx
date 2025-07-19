import NavBar from "../components/Navbar";

export default function Login() {
    //state for when incorrect inputs are given

    async function handleSubmit(event) {
        //prevent page from refeshing on submit
        event.preventDefault();
        console.log("hi");
        
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
                        <input id="email" type="email" className="input w-xl ml-7 text-lg" placeholder="Email" />
                        {/* Password */}
                        <label className="label text-2xl mt-5 ml-7 mb-2">Password</label>
                        <input id="password" type="password" className="ml-7 input w-xl text-lg" placeholder="Password" />
                        {/* Submit button */}
                        <button className="btn btn-primary btn-xl my-15 mx-7" type="submit">Login</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}