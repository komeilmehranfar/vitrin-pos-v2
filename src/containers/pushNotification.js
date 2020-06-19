import {PUSH_NOTIFICATION_API} from "../../utils/api";
import request from "../../utils/request";

export default function initPushNotification(showSnackBar, history, updateOrders, siteDomain) {
  const {ipcRenderer} = require('electron')
  const {
    START_NOTIFICATION_SERVICE,
    NOTIFICATION_SERVICE_STARTED,
    NOTIFICATION_SERVICE_ERROR,
    NOTIFICATION_RECEIVED,
    TOKEN_UPDATED,
  } = require('electron-push-receiver/src/constants')

// Listen for service successfully started
  ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
    request(
      PUSH_NOTIFICATION_API,
      {label: `Admin Panel ${siteDomain}`, token},
      'POST',
    );
    console.log('service successfully started', token)
  })

// Handle notification errors
  ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
    console.log('notification error', error)
  })

// Send FCM token to backend
  ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
    request(
      PUSH_NOTIFICATION_API,
      {label: `Admin Panel ${siteDomain}`, token},
      'POST',
    );
    console.log('token updated', token)
  })

// Display notification
  ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
    // check to see if payload contains a body string, if it doesn't consider it a silent push
    if (serverNotificationPayload.notification.body) {
      // payload has a body, so show it to the user
      console.log('display notification', serverNotificationPayload)
      let myNotification = new Notification(serverNotificationPayload.notification.title, {
        body: serverNotificationPayload.notification.body
      })
      updateOrders()
      myNotification.onclick = () => {
        history.push('/online-orders')
        console.log('Notification clicked')
      }
      const audio = new Audio(
        `https://hs3-cf.behtarino.com/static/pristine.mp3`,
      );
      audio.play();
      showSnackBar(
        `${serverNotificationPayload.notification.title}\n${serverNotificationPayload.notification.body}`,
        'success',
      );
    } else {
      // payload has no body, so consider it silent (and just consider the data portion)
      console.log('do something with the key/value pairs in the data', serverNotificationPayload.data)
    }
  })

// Start service
  const senderId = '295415142438' // <-- replace with FCM sender ID from FCM web admin under Settings->Cloud Messaging
  console.log('starting service and registering a client')
  ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId)
}