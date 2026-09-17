import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import { syncSwalTheme } from "@/utils/theme";
import "../globals.css";

const baseCustomClass = {
  popup: "swal-themed-popup",
  title: "swal-themed-title",
  htmlContainer: "swal-themed-content",
  confirmButton: "swal-custom-button",
  cancelButton: "swal-cancel-button",
};

const defaultOptions = {
  buttonsStyling: false,
  customClass: baseCustomClass,
};

export const fireAlert = (options: SweetAlertOptions): Promise<SweetAlertResult> => {
  const { didOpen, customClass, ...restOptions } = options;

  return Swal.fire({
    ...defaultOptions,
    ...restOptions,
    customClass: {
      ...baseCustomClass,
      ...customClass,
    },
    didOpen: (popup) => {
      syncSwalTheme();
      didOpen?.(popup);
    },
  } as SweetAlertOptions);
};

export const showDeleteConfirmAlert = (): Promise<SweetAlertResult> => {
  return fireAlert({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });
};

// Success Alert
export const showSuccessAlert = (title: string, text?: string) => {
  fireAlert({
    icon: "success",
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    allowOutsideClick: false,
    confirmButtonText: "OK",
  });
};

// Special Custome Success Message
export const showSpecialSuccessAlert = (
  title: string,
  text?: string,
  onConfirm?: () => void,
) => {
  fireAlert({
    icon: "success",
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: "OK",
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      confirmButton: "swal-special-custom-button",
    },
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  });
};

// Error Alert
export const showErrorAlert = (
  title: string,
  text?: string,
  buttonText: string = "Try Again",
  redirectUrl?: string,
  showCancelButton: boolean = false,
  cancelText: string = "Cancel",
  onConfirm?: () => void,
) => {
  fireAlert({
    icon: "error",
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: buttonText,
    showCancelButton,
    cancelButtonText: cancelText,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      if (onConfirm) onConfirm();
      if (redirectUrl) window.location.href = redirectUrl;
    }
  });
};

export default Swal;
