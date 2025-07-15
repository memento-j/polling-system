import { useState } from "react";
import { useNavigate } from "react-router-dom"
import NavBar from "../components/Navbar";
import ActivePolls from "../components/ActivePolls";

/*  
-figure out how to remove the forms based off the time provided :D
  aka add another api endpoint buddy (:
-add a section on the bottom that shows current running polls
*/

function App() {
  const navigate = useNavigate();
  const [poll, setPoll] = useState({
    question: "",
    activeDays: "",
    options: []
  });
  //array to toggle on and off which options should be hidden or shown
  const [showItems, setShowItems] = useState([false, false, false, false, false, false, false, false]);
  //individual option element to be shown or hidden
  const [optionIndex, setOptionIndex] = useState(0);

  //flip the toggle to show a new option that the user can provide input for
  function displayOptionInput() {
    //dont increement anymore as there are no more options to be added
    if (optionIndex === 8) {
      return;
    }

    //create new array and toggle only the index that for the input field needed to be shown
    const newShowItems = showItems.map((toggle, index) => {
      if (index === optionIndex) {
        return !toggle;
      }
      else {
        return toggle;
      }
    });
    setShowItems(newShowItems);
    setOptionIndex(prev => prev + 1);
  }

  //flip the toggle to remove an option that the user can provide input for
  function removeOptionInput() {
    //dont decrement anymore as there are no more options to be removed
    if (optionIndex === 0) {
      return;
    }
    //create new array and toggle only the index that needs to be hidden
    const newShowItems = showItems.map((toggle, index) => {
      if (index === optionIndex - 1) {
        return !toggle;
      }
      else {
        return toggle;
      }
    });
    setShowItems(newShowItems);
    setOptionIndex(prev => prev - 1);
  }

  //<p>question: {poll.question} activeDays: {poll.activeDays} options: {poll.options.map((option, i) => <li key={i}>{option.text}</li>)} </p>
  return (
    <div>
      <NavBar/>
      {/* Create poll field */}
      <div className="mt-15 mb-5 flex justify-center">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
          <legend className="fieldset-legend text-4xl">Create Poll</legend>
          {/* Enter question */}
          <input type="text" className="input w-xl text-[18px] m-5" placeholder="Poll question" onChange={(event) => setPoll({...poll, question: event.target.value})}/>
          {/* Create options */}
          <input id="option1" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 1" />
          <input id="option2" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 2" />
          {showItems[0] && (
            <input id="option3" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 3"/>
          )}
          {showItems[1] && (
            <input id="option4" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 4" />
          )}
          {showItems[2] && (
            <input id="option5" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 5" />
          )}
          {showItems[3] && (
            <input id="option6" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 6" />
          )}
          {showItems[4] && (
            <input id="option7" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 7" />
          )}
          {showItems[5] && (
            <input id="option8" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 8" />
          )}
          {showItems[6] && (
            <input id="option9" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 9" />
          )}
          {showItems[7] && (
            <input id="option10" type="text" className="input text-[18px] w-xl m-5" placeholder="Option 10" />
          )}
          <div className="flex">
            <input type="button" className="btn btn-primary m-3 w-2xs" value="Add Option" onClick={displayOptionInput}/>
            <input type="button" className="btn btn-primary m-3 w-2xs" value="Remove Option" onClick={removeOptionInput}/>
          </div>
          {/* Enter number of days */}
          <input
            type="number"
            className="input validator w-xl mt-10 ml-5 mb-5 mr-5 text-[18px]"
            required
            placeholder="Enter number of days for the poll (1-14)"
            min="1"
            max="14"
            title="Must be between be 1 to 14"
            onChange={(event) => setPoll({...poll, activeDays: event.target.value})}
          />
          <p className="validator-hint ml-5">Days be between be 1 to 14</p>
          {/* Submit and create poll by sending it to the database*/}
          <input type="submit" value="Submit Poll" className="btn btn-primary m-5 text-xl" onClick={() => {
            //update poll with the options
            let newOptions = [];
            let numOfOptions = optionIndex + 2;

            for (let i = 0; i < numOfOptions; i++) {
              const option = document.getElementById(`option${i + 1}`).value;
              newOptions.push({ text: option });
            }

            // Create a new poll object including the options
            const newPoll = {
              ...poll,
              options: newOptions,
            };
            
            //add poll to db
            fetch("http://localhost:8080/poll/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newPoll),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {
                console.log("Poll added successfully:", data);
                //load page with the id
                navigate(`/poll?id=${data._id}`); 
              })
              .catch((error) => {
                console.error("Error adding poll:", error);
              });
          }}/>
        </fieldset>
      </div>
      <p className="text-center text-3xl mt-10">Some Currently Active Polls</p>
      <ActivePolls />
    </div>
  )
}

export default App