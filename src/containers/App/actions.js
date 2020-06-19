/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  START_LOADING,
  STOP_LOADING,
  INIT,
  FILE_UPLOADED,
  UPLOAD_FILE,
  REMOVE_FILE,
  CLEAR_UPLOADED_FILES,
  START_INIT_LOADING,
  STOP_INIT_LOADING,
  SET_SITE_DOMAIN,
  MANY_ACTIONS,
  SEND_EMAIL,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  UPLOAD_REQUEST_FINISHED,
} from './constants';

export function init() {
  return {
    type: INIT,
  };
}

export function callManyActions(actions) {
  return {
    type: MANY_ACTIONS,
    data: actions,
  };
}

export function startLoading() {
  return {
    type: START_LOADING,
  };
}

export function stopLoading() {
  return {
    type: STOP_LOADING,
  };
}

export function startInitLoading() {
  return {
    type: START_INIT_LOADING,
  };
}

export function stopInitLoading() {
  return {
    type: STOP_INIT_LOADING,
  };
}

export function uploadFile(data) {
  return {
    type: UPLOAD_FILE,
    data,
  };
}

export function fileUploaded(data) {
  return {
    type: FILE_UPLOADED,
    data,
  };
}

export function removeFile(data) {
  return {
    type: REMOVE_FILE,
    index: data,
  };
}

export function clearUploadedFiles() {
  return {
    type: CLEAR_UPLOADED_FILES,
  };
}

export function setSiteDomain(siteDomain) {
  return {
    type: SET_SITE_DOMAIN,
    data: siteDomain,
  };
}
export function sendEmail(data) {
  return {
    type: SEND_EMAIL,
    data,
  };
}

export const uploadRequest = () => ({
  type: UPLOAD_REQUEST,
});
export const uploadRequestFinished = () => ({
  type: UPLOAD_REQUEST_FINISHED,
});
export const uploadProgress = (file, progress) => ({
  type: UPLOAD_PROGRESS,
  payload: progress,
  meta: { file },
});
export const uploadSuccess = file => ({
  type: UPLOAD_SUCCESS,
  meta: { file },
});
export const uploadFailure = (file, err) => ({
  type: UPLOAD_FAILURE,
  payload: err,
  error: true,
  meta: { file },
});