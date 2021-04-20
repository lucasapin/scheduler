import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import useVisualMode from "../../hooks/useVisualMode";
import Confirm from "./Confirm";
import Error from "./Error";



export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM"
  const DELETE = "DELETE"
  const EDIT = "EDIT"
  const ERROR_SAVE = "ERROR_SAVE"
  const ERROR_DELETE = "ERROR_DELETE"


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // props.interview.interviewer = [];
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true))
  }

  function deleting() {
    transition(CONFIRM)
  };
  function confirmDelete() {
    transition(DELETE, true)
    props.deleteInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true))
  };

  function editing() {
    transition(EDIT);
  }

  function closeError() {
    back()
  }


  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (<Form
        onCancel={() => back()}
        interviewers={props.interviewers}
        onSave={save}
      />)}
      {mode === EDIT && <Form
        name={props.interview.student}
        interviewer={props.interview.interviewer.id}
        onCancel={() => back()}
        interviewers={props.interviewers}
        onSave={save}
      />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={deleting}
          onEdit={editing}
        />
      )}
      {mode === CONFIRM && <Confirm onCancel={() => transition(SHOW)} onConfirm={() => transition(confirmDelete)} message="Are you sure you want to delete?" />}
      {mode === DELETE && <Status message="Canceling" />}
      {mode === ERROR_SAVE && <Error message="Unable to save your appointment" onClose={closeError} />}
      {mode === ERROR_DELETE && <Error message="Unable to delete your appointment" onClose={closeError} />}

    </article>
  )
}



