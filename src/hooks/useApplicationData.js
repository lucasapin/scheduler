import React, { useState } from "react";
import "components/Application.scss";
import axios from "axios";

export default function useApplicationData() {

  let [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  React.useEffect(() => {
    const baseUrl = "/api"
    const promiseDay = axios.get(`${baseUrl}/days`);
    const promiseAppointment = axios.get(`${baseUrl}/appointments`);
    const promiseInterviewer = axios.get(`${baseUrl}/interviewers`)
    const promises = [promiseDay, promiseAppointment, promiseInterviewer];

    Promise.all(promises)
      .then((all) => {
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      })
  }, []);


  const setDay = day => setState({ ...state, day });

  const updateSpots = (state) => {
    const newState = { ...state }
    const currentDay = state.days.find(day => day.name === state.day)
    const listOfAppointmentsForADay = currentDay.appointments
    const emptyAppointments = listOfAppointmentsForADay.filter(appointmentId => state.appointments[appointmentId].interview === null)
    const numberOfSpots = emptyAppointments.length
    currentDay.spots = numberOfSpots

    return newState
  }

  function bookInterview(id, interview) {
    return axios.put(`api/appointments/${id}`, { interview })
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState(prev => {
          const newState = { ...prev, appointments }
          const updatedSpotState = updateSpots(newState)
          return updatedSpotState
        })
      });
  }

  function deleteInterview(id) {
    return axios.delete(`api/appointments/${id}`)
      .then(resp => {
        const interview = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: interview
        };
        setState(prev => {
          const newState = { ...prev, appointments }
          const updatedSpotState = updateSpots(newState)
          return updatedSpotState
        })
      })
  }

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}