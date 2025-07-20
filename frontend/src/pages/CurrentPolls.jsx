import { useEffect, useState } from "react"
import NavBar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function CurrentPolls() {
    const [currentPolls, setCurrentPolls] = useState(undefined);

    //on mount, get current active polls (up to 5 ?)
    useEffect(() => {
        
        fetch("http://localhost:8080/polls", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            }
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
            })
            .then((data) => {
                console.log("Successfully retrieved polls", data);
                //set polls data
                setCurrentPolls(data);
            })
            .catch((error) => {
                console.error("Error getting polls:", error);
            })
    }, []) 

    return(
        <div>
            <NavBar/>
            <p className="text-center text-5xl mt-15">*Insert fancy landing page* (probably later to practice)</p>
            <p className="text-center text-7xl mt-15">Polling System</p>
            { currentPolls && 
                <ul className="list bg-base-300 rounded-box shadow-md w-[40%] mt-20 mx-auto">
                    <li className="p-4 pb-8 text-3xl opacity-60 tracking-wide">Currently Active Polls...</li>
                    {/* loop through and create list elements based the number of active polls*/}
                    {currentPolls.map((poll) => (
                       <li key={poll._id} className="list-row mb-3">
                            <div>
                                <div className="text-xl uppercase font-semibold opacity-60">Poll Question:</div>
                            </div>
                            <p className="text-3xl mb-3">{poll.question}</p>
                            <button className="btn btn-primary text-xl"><Link to={{ pathname: "/poll", search: `?id=${poll._id}`}}>Go to poll</Link></button>
                        </li>  
                    )
                    )}
                </ul>
            }
        </div>
    )
}