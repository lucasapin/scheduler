import React, { useState } from "react";
import "components/Application.scss";
import axios from "axios";
import index from "../components/Appointment/index";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`api/appointments/${id}`, { interview: interview })
      .then(() => {
        console.log("Put request done with success")
        setState({
          ...state,
          appointments
        });
      })
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

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}