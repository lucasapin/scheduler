import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {
  const { day, days, setDay } = props;

  const weekDay = days.map((eachDay, index) => {
    return <DayListItem key={index} name={eachDay.name} spots={eachDay.spots} setDay={setDay} selected={eachDay.name === day}
    />
  })
  return weekDay;
}
