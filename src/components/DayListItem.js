import React from "react";
import "components/DayListItem.scss";
const classNames = require('classnames');

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  });


  const formatSpots = () => {
    if (!props.spots) {
      return "no spots remaining";
    }
    if (props.spots === 1) {
      return `${props.spots} spot remaining`;
    }
    if (props.spots > 1) {
      return `${props.spots} spots remaining`;
    }
  }

  return (
    <li onClick={() => props.setDay(props.name)} className={dayClass} data-testid="day">
      <h2>{props.name}</h2>
      <h3>{formatSpots()}</h3>
    </li>
  );
}