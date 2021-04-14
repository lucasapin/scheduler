export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.find(d => day === d.name);
  if (state.days.length < 1 || filteredDays === undefined) {
    return []
  }
  return filteredDays.appointments.map(id => state.appointments[id])
}





