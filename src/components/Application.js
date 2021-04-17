import React from "react";
import useApplicationData from "../hooks/useApplicationData";
import "components/Application.scss";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";
import { state, setDay, bookInterview, deleteInterview } from "../hooks/useApplicationData"
import Appointment from "components/Appointment";
import DayList from "components/DayList";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    deleteInterview
  } = useApplicationData();

  const interviewers = getInterviewersForDay(state, state.day)
  const schedule = getAppointmentsForDay(state, state.day).map((appointment) => {
    const interview = getInterview(state, appointment.interview)

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview} />
    )
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        < Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
