import axios from 'axios';

export const MENTOR_ADD_SUCCESS = 'MENTOR_ADD_SUCCESS';
export const MENTOR_ADD_FAILURE = 'MENTOR_ADD_FAILURE';

export const postNewMentorAccount = newAccount => {
  return async dispatch => {
    axios()
      .post(`application/new/mentor`, newAccount)
      .then(() => {
        dispatch({
          type: MENTOR_ADD_SUCCESS,
          payload: { successPage: '/apply/success' },
        });
      })
      .catch(err => {
        dispatch({ type: MENTOR_ADD_FAILURE, payload: { mentorError: err } });
      });
  };
};
