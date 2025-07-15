import { Link } from "react-router-dom"

export default function PollCard( {question, id} ) {
    return(
        <div className="card bg-primary text-primary-content w-96">
            <div className="card-body">
                <h2 className="text-4xl text-center mt-5 mb-20">{question}</h2>
                <button className="btn btn-neutral btn-lg">
                    <Link to={{ pathname: "/poll", search: `?id=${id}`}}>Click here view</Link>
                </button>
            </div>
        </div>
    )
}