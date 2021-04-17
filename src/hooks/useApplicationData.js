import React, { useState } from "react";
import "components/Application.scss";
import axios from "axios";

export default function useApplicationData() {

  const confirmDay = (id) => {
    let dayID = null;
    for (const dayObj of state.days) {
      if (dayObj.appointments.includes(id)) {
        dayID = dayObj.id;
      }
    }
    return dayID;
  }

  let [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


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


  const setDay = day => setState({ ...state, day });


  function bookInterview(id, interview, create = false) {
    return axios.put(`api/appointments/${id}`, { interview })
      .then(() => {
        const int = { ...interview }
        const appointment = {
          ...state.appointments[id],
          interview: { ...int }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        const days = state.days.map(day => {
          return (create ? day.id === confirmDay(id) ? { ...day, spots: day.spots - 1 } : { ...day } : { ...day })
        })
        setState({
          ...state,
          days,
          appointments
        });
      });
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
        const days = state.days.map(day => {
          return (day.id === confirmDay(id) ? { ...day, spots: day.spots + 1 } : { ...day })
        });
      })
  }

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}