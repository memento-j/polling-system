import { useEffect, useState } from "react"
import PollCard from "./PollCard"

export default function ActivePolls() {
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
        <div className="flex justify-center mt-10">
            {/* render current running polls once the information has been retrieved from db*/}
            {currentPolls &&
                <div className="carousel w-1/4">
                    <div id="slide1" className="carousel-item relative w-full justify-center m-5">
                        <PollCard question={currentPolls[0]["question"]} id={currentPolls[0]["_id"]}/>
                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide3" className="btn btn-circle">❮</a>
                        <a href="#slide2" className="btn btn-circle">❯</a>
                        </div>
                    </div>
                    <div id="slide2" className="carousel-item relative w-full justify-center m-5">
                        <PollCard question={currentPolls[1]["question"]} id={currentPolls[1]["_id"]}/>
                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide1" className="btn btn-circle">❮</a>
                        <a href="#slide3" className="btn btn-circle">❯</a>
                        </div>
                    </div>
                    <div id="slide3" className="carousel-item relative w-full justify-center m-5">
                        <PollCard question={currentPolls[2]["question"]} id={currentPolls[2]["_id"]}/>
                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide2" className="btn btn-circle">❮</a>
                        <a href="#slide1" className="btn btn-circle">❯</a>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}