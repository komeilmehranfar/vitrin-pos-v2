import { call, put, takeLatest, all, take } from "redux-saga/effects";
import { ImageCompressor } from "image-compressor";

import userSaga from "../../../stores/user/saga";
import businessSaga from "../../../stores/business/saga";
import uiSaga from "../../../stores/ui/saga";
import transactionSaga from "../../../stores/transaction/saga";
import { createUploadFileChannel } from "./createFileUploadChannel";

import {
  fileUploaded,
  startLoading,
  stopLoading,
  uploadFailure,
  uploadSuccess,
  uploadProgress,
  uploadRequest,
  uploadRequestFinished,
} from "./actions";
import { ACCEPT_ORDER, SEND_EMAIL, UPLOAD_FILE } from "./constants";
import { getFileExtensionType, getFileExtention } from "../../../utils/helper";
import { setSnackBarMessage } from "../../../stores/ui/actions";
import request from "../../../utils/request";
import {
  EMAIL_API,
  FILE_SERVER_URL_API,
  ORDER_DELIVERER_API,
  ORDER_DELIVERY_TIME_API,
  ORDER_STATUS_PROGRESS_API,
} from "../../../utils/api";
import { submitHamiOrder } from "../../../integrations/hami/actions";
import { submitAriaOrder } from "../../../integrations/aria/actions";
import { setAdminOrder } from "../OnlineOrder/actions";

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const imageCompressor = new ImageCompressor();
    if (file.size > 500000) {
      const compressorSettings = {
        quality: 1,
        toWidth: 500,
        mimeType: "image/png",
        speed: "low",
      };
      if (file && /\.png|\.jpg|\.jpeg/.test(file.name.toLowerCase())) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = function onloadend() {
          const imageRead = fileReader.result;
          imageCompressor.run(imageRead, compressorSettings, continueUpload);
        };
        const continueUpload = (base64image) => {
          const newFile = dataURLtoFile(
            base64image,
            `${file.name.replace()}.png`
          );
          resolve(newFile);
        };
      } else {
        reject();
      }
    } else {
      resolve(file);
    }
  });
}

export function* uploadFileSaga(url, file) {
  yield put(uploadRequest());
  const channel = yield call(createUploadFileChannel, url, file);
  while (true) {
    const { progress = 0, err, success } = yield take(channel);
    if (err) {
      yield put(uploadFailure(file, err));
      yield put(setSnackBarMessage("فایل شما اپلود نشد.", "fail"));

      return;
    }
    if (success) {
      yield put(uploadSuccess(file));
      yield put(setSnackBarMessage("فایل شما با موفقیت اپلود شد.", "success"));
      return;
    }
    yield put(uploadProgress(file, progress));
  }
}

export function* uploadFile(file, folderName, callback) {
  yield put(startLoading());
  yield put(uploadRequest());
  try {
    const {
      response: {
        data: { url },
      },
    } = yield call(
      request,
      FILE_SERVER_URL_API,
      { file_name: file.name, folder_name: folderName },
      "GET"
    );
    yield call(uploadFileSaga, url, file);
    const type = getFileExtensionType(
      getFileExtention(file.name).toLowerCase()
    );
    if (type) {
      const uploadedFile = {
        url: url.substr(0, url.indexOf("?")),
        file_name: url.substring(url.lastIndexOf("/") + 1, url.indexOf("?")),
        folder_name: folderName,
        type,
      };
      yield put(fileUploaded(uploadedFile));
      if (callback)
        yield call(
          callback,
          url.substr(0, url.indexOf("?")),
          `${uploadedFile.folder_name}/${uploadedFile.file_name}`
        );
    }
  } catch (err) {
    console.log(err);
  }
  yield put(stopLoading());
  yield put(uploadRequestFinished());
}
function* sendEmail(action) {
  try {
    yield call(request, EMAIL_API, action.data, "POST");
  } catch (err) {
    // console.log(err);
  }
}

export function* uploadFiles(action) {
  yield put(startLoading());
  const { files, folderName } = action.data;
  for (let i = 0; i < files.length; i += 1) {
    const type = getFileExtensionType(
      getFileExtention(files[i].name).toLowerCase()
    );
    const _file = type === "image" ? yield compressImage(files[i]) : files[i];
    yield call(uploadFile, _file, folderName, action.callback);
  }
  yield put(stopLoading());
}
export function* acceptOrder(action) {
  try {
    yield put(startLoading());
    let meta = {};
    if (!action.data.preventSms) {
      const { response } = yield call(
        request,
        ORDER_DELIVERY_TIME_API(action.data.id, action.data.plugin),
        {
          delivery_time: action.data.deliveryTime,
        },
        "PATCH"
      );
      meta = response.meta || {};
    }
    if (
      action.data.preventSms ||
      (meta.status_code >= 200 && meta.status_code <= 300)
    ) {
      if (action.data.deliverer)
        yield call(
          request,
          ORDER_DELIVERER_API(action.data.id, "shopping"),
          {
            deliverer_name: action.data.deliverer,
            send_sms: action.data.sendSms,
          },
          "PATCH"
        );

      const {
        response: { data },
      } = yield call(
        request,
        ORDER_STATUS_PROGRESS_API(action.data.id, "shopping"),
        action.data.preventSms ? { pos_device: 0 } : {},
        "PATCH"
      );
      if (data) {
        const integration = localStorage.getItem("integrated");
        if (integration === "hami") {
          submitHamiOrder(data);
          return;
        }
        if (integration === "aria") {
          submitAriaOrder(data);
          return;
        }
        yield put(setSnackBarMessage("سفارش مورد نظر تایید شد.", "success"));
        yield put(setAdminOrder(data));
      } else if (!action.data.preventSms)
        yield put(
          setSnackBarMessage("در تایید سفارش خطایی رخ داده است!", "fail")
        );
    } else if (!action.data.preventSms)
      yield put(
        setSnackBarMessage("در تایید سفارش خطایی رخ داده است!", "fail")
      );
    yield put(stopLoading());
  } catch (err) {
    console.log(err);
    yield put(setSnackBarMessage("در تایید سفارش خطایی رخ داده است!", "fail"));
    yield put(stopLoading());
  }
}

export default function* generalSaga() {
  yield all([
    ...userSaga,
    ...businessSaga,
    ...uiSaga,
    ...transactionSaga,
    takeLatest(ACCEPT_ORDER, acceptOrder),
    takeLatest(SEND_EMAIL, sendEmail),
    takeLatest(UPLOAD_FILE, uploadFiles),
  ]);
}
