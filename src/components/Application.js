import React, { useState } from "react";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import axios from 'axios';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  console.log(state);

  const setDay = day => setState({ ...state, day });


  React.useEffect(() => {
    const baseUrl = "http://localhost:8001/api/"
    const promiseDay = axios.get(`${baseUrl}/days`);
    const promiseAppointment = axios.get(`${baseUrl}/appointments`);
    const promiseInterviewer = axios.get(`${baseUrl}/interviewers`)
    const promises = [promiseDay, promiseAppointment, promiseInterviewer];

    Promise.all(promises)
      .then((all) => {
        console.log(all[2].data)
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      })

  }, []);

  const schedule = getAppointmentsForDay(state, state.day).map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day)
    function bookInterview(id, interview) {
      const appointment = {

        ...state.appointments[id],
        interview: { ...interview }
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      setState({
        ...state,
        appointments
      });
      axios.put(`http://localhost:8001/api/appointments/${id}`, { id: id, interview: interview })
        .then(data => console.log("data***********", data))
    }

    function deleteInterview(id) {
      return axios.delete(`/api/appointments/${id}`)
        .then(resp => {
          const interview = {
            ...state.appointments[id],
            interview: null
          };
          const appointments = {
            ...state.appointments,
            [id]: interview
          };
        })
    }

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
