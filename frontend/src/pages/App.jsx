import { useState } from "react";
import { useNavigate } from "react-router-dom"
import NavBar from "../components/Navbar";
import ActivePolls from "../components/ActivePolls";

/*  
-figure out how to remove the forms based off the time provided :D
  aka add another api endpoint buddy (:
*/

function App() {
  const navigate = useNavigate();
  const [poll, setPoll] = useState({
    question: "",
    activeDays: "",
    options: []
  });

  //used for generating the option input fields
  const [currentOptions, setCurrentOptions] = useState([
    {
      placeholder: "Option 1",
      id: "option1"
    },
    {
      placeholder: "Option 2",
      id: "option2"
    }
  ])

  function addOptionInput() {
    //ensures no more than 10 options can be added
    if (currentOptions.length === 10) return;

    //add new option to end of array
    setCurrentOptions((prev) => [...prev, 
      {
        placeholder: `Option ${currentOptions.length+1}`,
        id: `option${currentOptions.length+1}`
      }
    ]);
  }

  function removeOptionInput() {
    //dont remove if removing an options will cause there to be less than 2 total options
    if (currentOptions.length === 2) return;

    //remove last option
    const filteredOptions = currentOptions.filter((_, index) => index != currentOptions.length-1);
    setCurrentOptions(filteredOptions); 
  }

  //outputs the poll (for debugging)
  //<p>question: {poll.question} activeDays: {poll.activeDays} options: {poll.options.map((option, i) => <li key={i}>{option.text}</li>)} </p>
  return (
    <div>
      <NavBar/>
      {/* Create poll field */}
      <div className="mt-15 mb-5 flex justify-center">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
          <legend className="fieldset-legend text-4xl">Create Poll</legend>
          <label className="label text-2xl mt-3 ml-2 mb-3">Select poll type:</label>
          <fieldset className="fieldset ml-5">
            <select id="pollType" defaultValue="Pick poll type" className="select select-lg text-base-content">
              <option disabled={true}>Pick poll type</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <span className="label text-[16px]">Only users with accounts can vote on and create private polls!</span>
          </fieldset>
          {/* Enter question input */}
          <label className="label text-2xl mt-3 ml-2">Question:</label>
          <input type="text" className="input w-xl text-[18px] m-5" placeholder="Poll question" onChange={(event) => setPoll({...poll, question: event.target.value})}/>
          {/* Create options input */}
          <label className="label text-2xl mt-3 ml-2">Options:</label>
          {currentOptions.map((option, _) =>
            <div key={option.id}>
              <input id={option.id} type="text" className="input text-[18px] w-xl m-5" placeholder={option.placeholder} />
            </div>
          )}
          <div className="flex">
            <input type="button" className="btn btn-primary m-3 w-2xs" value="Add Option" onClick={addOptionInput}/>
            <input type="button" className="btn btn-primary m-3 w-2xs" value="Remove Option" onClick={removeOptionInput}/>
          </div>
          {/* Enter number of days */}
          <label className="label text-2xl mt-3 ml-2">Active Polling Days:</label>
          <input
            type="number"
            className="input validator w-xl mt-5 ml-5 mr-5 text-[18px]"
            required
            placeholder="Enter number of days for the poll (1-14)"
            min="1"
            max="14"
            title="Must be between be 1 to 14"
            onChange={(event) => setPoll({...poll, activeDays: event.target.value})}
          />
          <p className="validator-hint ml-5">Days be between be 1 to 14</p>
          {/* Submit and create poll by sending it to the database*/}
          <input type="submit" value="Submit Poll" className="btn btn-primary m-5 text-xl" onClick={async () => {
            //update poll with the options
            let newOptions = [];

            for (let i = 0; i < currentOptions.length; i++) {
              const option = document.getElementById(`option${i + 1}`).value;
              newOptions.push({ text: option });
            }
            //get poll type
            const pollType = document.getElementById("pollType").value;

            if (pollType == "public") {
              //create public poll
              const newPoll = {
              ...poll,
              options: newOptions,
              isPrivate: false,
              };
              try {
                const res = await fetch("http://localhost:8080/poll/create", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newPoll),
                });
                if (!res.ok) {
                  throw new Error("Network response was not ok");
                }
                const data = await res.json();
                console.log("Poll added successfully:", data);
                //load page with the id
                navigate(`/poll?id=${data._id}`); 
              } catch(error) {
                console.error("Error adding poll:", error);
              }
            }
            else if (pollType == "private") {
              //create private poll
              const newPoll = {
              ...poll,
              options: newOptions,
              isPrivate: true,
              };
              try {
                const res = await fetch("http://localhost:8080/poll/create-private", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  //ensure cookies can be passed to backend
                  credentials: "include",
                  body: JSON.stringify(newPoll),
                });
                if (!res.ok) {
                  throw new Error("Network response was not ok");
                }
                const data = await res.json();
                console.log("Poll added successfully:", data);
                //load page with the id
                navigate(`/poll?id=${data._id}`); 
              } catch(error) {
                console.error("Error adding poll:", error);
              }
            }
            else {
              //poll type not selected
              
            }
          }}/>
        </fieldset>
      </div>
      <p className="text-center text-3xl mt-10">Some Currently Active Polls</p>
      <ActivePolls />
    </div>
  )
}

export default App