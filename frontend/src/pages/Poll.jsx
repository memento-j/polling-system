import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";

/*
-format the form better you dumbass :D
-add a button to copy the link! 
    who wants to doubleclick and press the copy button in the big 2025? less clicks = good
-add some like "copieed to clipboard" msg or something bro
*/

//page for displaying a poll's current info
export default function Poll() {
    const [poll, setPoll] = useState(undefined);
    const [totalVotes, setTotalVotes] = useState(0);

    //get poll data to display on mount
    useEffect(() => {
        //get id from query params
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        //get poll from db using the id
        fetch(`http://localhost:8080/poll/${id}`, {
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
                console.log("Successfully retrieved poll", data);
                //get and set total votes
                let voteCount = 0;
                data.options.map((_, index) => {
                    voteCount +=  data.options[index]["vote"];
                });
                setTotalVotes(voteCount);
                //set poll data
                setPoll(data);
            })
            .catch((error) => {
                console.error("Error getting poll:", error);
            })
    }, [])

    //get total number of current votes
    //level out progress bar and number
    //add another routee for voting (this file) which will give users the ability to vote
    //then add a new page for poll/:id to simply show the current state of the poll

    return(
        <div>
            <NavBar />
            <div className="mt-20 flex justify-center">
                {/* Render poll information once it is defined*/}
                {poll &&
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-3xl h-6/12 border p-4">
                        <legend className="fieldset-legend text-4xl">Poll</legend>
                        <div>
                            <p className="text-2xl">Send this link to others so they can vote!</p>
                            <p className="text-2xl"> {`http://localhost:5173/vote?id=${poll._id}`}</p>
                            <Link className="btn btn-primary mt-3" to={{ pathname: "/vote", search: `?id=${poll._id}` }}>Go to voting page</Link>
                        </div>
                        <label className="label text-2xl mt-5">Question:</label>
                        <p className="text-3xl ml-1 mb-10">{poll.question}</p>
                        {/*  display poll options and vote count*/}
                        <ul>
                            {poll.options.map((_, index) =>
                                <li key={index}>
                                    <div className="flex">
                                        <label className="label text-xl mr-3">{index+1}.</label>
                                        <p className="text-3xl ml-1"> {poll.options[index]["text"]} </p>
                                    </div>
                                    <progress className="progress progress-primary w-56 m-3" value={poll.options[index]["vote"]} max={totalVotes}></progress>
                                    <span className="text-2xl">{poll.options[index]["vote"]}</span>
                                </li>
                            )}
                        </ul>
                        <p>{totalVotes} total votes so far...</p>
                    </fieldset>
                }

            </div>
        </div>
    )
}