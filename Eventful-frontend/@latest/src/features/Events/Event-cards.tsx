// import {useEffect, useState} from "react";
import "./Event-cards.css"
type EventType = {
  coverImage: string;
  title: string;
  startTime: string;
  description: string;
  onClick?:()=>void;
};
function EventCards({ coverImage, title, startTime, description, onClick }: EventType){

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(startTime));
    return (
        <div className="card-container" onClick={onClick}>
            <div className="imageWrapper">
                <img src={coverImage} alt="Cover Image" className="eventImage"/>

                <div className="dateBadge">
                    {formattedDate}
                </div>
            </div>
            <div className="eventTexts">
                <h2>{title}</h2>
                <p className="eventDescription">{description}</p>
            </div>
            
        </div>
    )
}

export default EventCards