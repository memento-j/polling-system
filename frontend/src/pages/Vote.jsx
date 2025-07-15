import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

/*
-format the form better you dumbass :D
-maybe add a count down timer ?
-check user ip to ensure only one person can vote ?
-add some more responsiveness you idioooooooooot (maybe ?)
    everything is thee same size no matter the screen size?
    if someone casts a vote and nothing is select no message or anything displays?
*/

//
export default function Vote() {
    const [poll, setPoll] = useState(undefined);
    const navigate = useNavigate();

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
                //set poll data
                setPoll(data);
            })
            .catch((error) => {
                console.error("Error getting poll:", error);
            })
    }, [])

    return(
        <div>
            <NavBar />
            <div className="mt-20 flex justify-center">
                {/* Render poll information once it is defined*/}
                {poll &&
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-3xl h-6/12 border p-4">
                        <legend className="fieldset-legend text-4xl">Poll</legend>
                        <div>
                            <p className="text-2xl mt-2">Send this link to others so they can vote also!</p>
                            <p className="text-2xl"> {`http://localhost:5173/vote?id=${poll._id}`}</p>
                        </div>
                        <label className="label text-2xl mt-10">Question:</label>
                        <p className="text-3xl ml-1 mb-8">{poll.question}</p>
                        {/*  display poll options and vote count*/}
                        <ul>
                            {poll.options.map((_, index) =>
                                <li key={index}>
                                    <div className="flex m-8">
                                        <input id={`option${index}`} type="radio" name="radio-4" className="radio radio-primary mt-2"/>
                                        <p className="text-3xl ml-5"> {poll.options[index]["text"]} </p>
                                    </div>
                                </li>
                            )}
                        </ul>
                        {/* cast vote button that updates vote count in db*/}
                        <input type="submit" value="Cast Vote" className="btn btn-primary m-5 text-xl" onClick={() => {
                            //get options selected
                            let optionObj = { option: ""};
                            //go through each option and add the checked option's index to the optionObj
                            for (let i = 0; i < poll.options.length; i++) {
                                const optionElement = document.getElementById(`option${i}`);
                                if(optionElement.checked) {
                                    optionObj.option = Number(i);
                                    break;
                                }
                            }
                            //ensures blank votes cannot be added
                            if (optionObj.option === "") {
                                console.log("no option selecteed");
                                return;
                            }
                            //send post request updating the selected option's vote count
                            fetch(`http://localhost:8080/poll/${poll._id}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(optionObj),
                            })
                            .then((response) => {
                                if (!response.ok) {
                                throw new Error("Network response was not ok");
                                }
                                return response.json();
                            })
                            .then((data) => {
                                console.log("Vote updated:", data);
                                //load poll's page
                                navigate(`/poll?id=${data._id}`); 
                            })
                            .catch((error) => {
                                console.error("Error adding poll:", error);
                            });
                        }}/>
                    </fieldset>
                }
            </div>
        </div>
    )
}