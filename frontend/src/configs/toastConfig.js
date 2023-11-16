import { createToast } from "mosha-vue-toastify";

export const toast = {
  success(message) {
    createToast(message, {
      showIcon: true,
      type: "success",
      position: "bottom-right",
    });
  },
  error(message) {
    createToast(message, {
      showIcon: true,
      type: "danger",
      position: "bottom-right",
    });
  },
  warning(message) {
    createToast(message, {
      showIcon: true,
      type: "warning",
      position: "bottom-right",
    });
  },
};
