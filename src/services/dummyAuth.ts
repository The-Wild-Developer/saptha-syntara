import type { IBaseResponse, IPages, IUserProfile } from "@/types";

export const DUMMY_USERNAME = "admin";
export const DUMMY_PASSWORD = "admin123";

const DUMMY_PASSWORD_KEY = "ss_dummy_password";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

function ok(
  data: Record<string, any> | IPages[] | null = null,
  message = "Success",
): IBaseResponse {
  return {
    success: true,
    message,
    data: data as Record<string, any> | null,
    errors: null,
    errorCode: 0,
    responseTime: new Date().toISOString(),
  };
}

function fail(message: string, errorCode = 1006): IBaseResponse {
  return {
    success: false,
    message,
    data: null,
    errors: message,
    errorCode,
    responseTime: new Date().toISOString(),
  };
}

export const dummyUserProfile: IUserProfile = {
  username: DUMMY_USERNAME,
  firstName: "Admin",
  lastName: "User",
  nic: "199012345678",
  email: "admin@sapthasyntara.com",
  mobile: "0771234567",
  status: "ACT",
  statusDescription: "Active",
  lastLoggedDate: new Date().toISOString(),
  expectingFirstTimeLogging: false,
  passwordExpiredDate: "31 Dec 2027",
  profileImg: {
    file: "",
    fileExtensiones: "png",
    fileName: "profile.png",
    type: "PROFILE",
  },
  userRole: {
    code: "ADMIN",
    description: "Administrator",
  },
  reset: false,
};

export const dummyPages: IPages[] = [
  {
    code: "MENU",
    description: "Main Menu",
    pages: [
      {
        code: "DASHBOARD",
        url: "/dashboard",
        description: "Dashboard",
        status: "ACT",
      },
      {
        code: "GROUP",
        url: "/manage/view-group",
        description: "Group Management",
        status: "ACT",
      },
      {
        code: "COMPANY",
        url: "/manage/view-company",
        description: "Company Management",
        status: "ACT",
      },
      {
        code: "SECTION",
        url: "/manage/view-section",
        description: "Section Management",
        status: "ACT",
      },
      {
        code: "EMPLOYEE",
        url: "/employees/view",
        description: "Employee Management",
        status: "ACT",
      },
      {
        code: "ORDER_BOOK",
        url: "/order-book/view",
        description: "Order Book Management",
        status: "ACT",
      },
      {
        code: "PRODUCTION_LINE",
        url: "/production-line/view",
        description: "Production Line Management",
        status: "ACT",
      },
      {
        code: "HIERARCHY",
        url: "/hierarchy",
        description: "Hierarchy Management",
        status: "ACT",
      },
      {
        code: "CALENDAR",
        url: "/calendar",
        description: "Calendar Management",
        status: "ACT",
      },
      {
        code: "PLANNING",
        url: "/production-planning",
        description: "Production Planning Board",
        status: "ACT",
      },
    ],
  },
];

export function getDummyPassword() {
  if (typeof window === "undefined") {
    return DUMMY_PASSWORD;
  }
  return window.localStorage.getItem(DUMMY_PASSWORD_KEY) || DUMMY_PASSWORD;
}

function saveDummyPassword(password: string) {
  window.localStorage.setItem(DUMMY_PASSWORD_KEY, password);
}

export async function dummyLogin(username: string, password: string) {
  await delay();
  if (
    username.trim().toLowerCase() !== DUMMY_USERNAME ||
    password !== getDummyPassword()
  ) {
    return fail("Username or password invalid, Please try again.");
  }

  return ok(
    {
      tokenDetails: {
        accessToken: "dummy-access-token",
        refreshToken: "dummy-refresh-token",
      },
      profileDetails: dummyUserProfile,
    },
    "Login successful",
  );
}

export async function dummyLeftMenu() {
  await delay(200);
  return ok(dummyPages, "Pages loaded");
}

export async function dummyLogout() {
  await delay(200);
  return ok(null, "Logout successful");
}

export async function dummyRequestOtp(username: string) {
  await delay();
  if (username.trim().toLowerCase() !== DUMMY_USERNAME) {
    return fail("Username not found.");
  }
  return ok(null, "OTP sent");
}

export async function dummyResetPassword(
  username: string,
  password: string,
  confirmPassword: string,
) {
  await delay();
  if (username.trim().toLowerCase() !== DUMMY_USERNAME) {
    return fail("Username not found.");
  }
  if (!password || password !== confirmPassword) {
    return fail("Passwords do not match.");
  }
  saveDummyPassword(password);
  return ok(null, "Password reset successful");
}
