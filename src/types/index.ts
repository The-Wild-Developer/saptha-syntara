export interface IBaseRequest {
  channel: string;
  ip: string;
  message: string;
  username: string;
  userAgent: string;
}
export interface ILoginData {
  username: string;
  password: string;
}

export interface IResetPassword {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface IBaseResponse {
  success: boolean;
  message: string;
  data: Record<string, any> | null;
  errors: string | null;
  errorCode: number;
  responseTime: string;
}
export interface IUploadFile {
  file?: any;
  description?: string;
  workbook?: string;
  company?: string;
}

export interface IPages {
  code: string;
  description: string;
  pages: {
    code: string;
    url: string;
    description: string;
    status: string;
  }[];
}

export interface IUserProfile {
  username: string;
  firstName: string;
  lastName: string;
  nic: string;
  email: string;
  mobile: string;
  status: string;
  statusDescription: string;
  lastLoggedDate: string;
  expectingFirstTimeLogging: boolean;
  passwordExpiredDate: string;
  profileImg: {
    file: Base64URLString;
    fileExtensiones: string;
    fileName: string;
    type: "PROFILE";
  };
  userRole: {
    code: string;
    description: string;
  };
  reset: boolean;
}

export interface IUserCreation {
  isApprovalLevel: boolean;
  isDeathApprovalLevel: boolean;
  newUsername: string;
  approvalLevel: string;
  deathApprovalLevel: string;
  userRole: string;
  nic: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  companies: string | string[];
}

export interface IUserFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    newUsername: string;
    userRole: string;
    nic: string;
    email: string;
    mobile: string;
    firstName: string;
    lastName: string;
    status: string;
    loginStatus: string;
  };
}

export interface IProfileImage {
  type?: string;
  file?: any;
  fileName: string;
  fileExtensiones: string;
}
export interface IUpdateProfile {
  mobile: string;
  email: string;
}

export interface IPrivilages {
  page: string;
  userRole: string;
}
export interface IAssignTask {
  page: string;
  userRole: string;
  assignedTask: string;
}

export interface IFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    code: string;
    description: string;
    status: string;
  };
}

export interface ISectionItem {
  id: number;
  code: string;
  description: string;
  status: string;
  statusDescription: string;
}

export interface IPageItem {
  id: number;
  code: string;
  description: string;
  status: string;
  statusDescription: string;
}

export interface ITaskItem {
  id: number;
  code: string;
  description: string;
  status: string;
  statusDescription: string;
}

export interface IEmployeeCreation {
  epfNo: string;
  initials: string;
  title: string;
  firstName: string;
  lastName: string;
  nic: string;
  gender: string;
  email: string;
  noMobileNumber: boolean;
  mobileNo: string;
  maritalStatus: boolean;
  dob: string;
  userAddress: {
    streetNo: string;
    street1: string;
    street2: string;
    city: string;
  };
  userCompanyDetails: {
    companyTypeCode: string;
    staffCategoryCode: string;
    staffTypeCode: string;
    designation: string;
    permanentDate: string;
    insurancePolicyCode: string;
    facility: string;
    paymentCompany: string;
    deathPaymentCompany: string;
  };
  userStatus: string;
}

export interface IUserRole {
  id: number;
  code: string;
  description: string;
  status: string;
  statusDescription: string;
}
export interface IAddUserRole {
  code: string;
  description: string;
  status: string;
}

export interface IPasswordPolicy {
  id: number;
  minUpperCase: number;
  minLowerCase: number;
  minNumbers: number;
  minSpecialCharacters: number;
  minLength: number;
  maxLength: number;
  passwordHistory: number;
  attemptExceedCount: number;
  otpExceedCount: number;
}

export interface IUserPolicy {
  id: number;
  minUpperCase: number;
  minLowerCase: number;
  minNumbers: number;
  minSpecialCharacters: number;
  minLength: number;
  maxLength: number;
}

export interface IUserList {
  id: number;
  newUsername: string;
  email: string;
  status: string;
  statusDescription: string;
  loginStatus: string;
  loginStatusDescription: string;
}

export interface IEmployeeList {
  id: number;
  firstName: string;
  lastName: string;
  nic: string;
  epfNo: string;
  email: string;
  userStatus: string;
  userStatusDescription: string;
  userCompanyDetails: {
    companyTypes: {
      description: string;
    };
    staffCategories: {
      code: string;
      description: string;
    };
    facilityDescription: string;
  };
}

export interface IEmployeeFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    epfNo: string;
    firstName: string;
    lastName: string;
    nic: string;
    email: string;
    mobileNo: string;
    userStatus: string;
    companyCode: string;
    staffCategoryCode: string;
    insurancePolicyCode: string;
  };
}

export interface IRequestPasswordOTP {
  username: string;
}

export interface IPasswordOTP {
  username: string;
  otp: string;
}

export interface IDependent {
  id: number;
  firstName: string;
  lastName: string;
  relationCategoryDescription: string;
  status: string;
  statusDescription: string;
  nic: string;
}

export interface IDependentFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    firstName: string;
    lastName: string;
    dependentCategory: string;
    relationCategory: string;
    nic: string;
    status: string;
    liveStatus: string;
    employeeNic: string;
    company: string;
    epfNo: string;
    staffCategory: string;
    dependentName: string;
  };
}

export interface IClaim {
  id: number;
  requestId: string;
  insuranceClaimsDetails: {
    treatment: {
      treatmentCode: string;
      treatmentDescription: string;
    };
    treatmentCategory: {
      code: string;
      description: string;
    };
  };
  requestStatus: string;
  requestStatusDescription: string;
  approvalLevel: string;
  approvalLevelDescription: string;
  createdDate: string;
  employee: {
    userPersonalDetails: {
      epfNo: string;
    };
  };
}

export interface IClaimFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    requestId: string;
    requestStatus: string;
    treatment: string;
    treatmentCategory: string;
    nic: string;
    dependentNIC: string;
    dependentFirstName: string;
    dependentLastName: string;
    company: string;
    epfNo: string;
    staffCategory: string;
    employeeName: string;
    fromDate: string;
    toDate: string;
  };
}

export interface IClaimApprovalFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    requestId: string;
    epfNo: string;
    period: string;
    staffCategory: string;
    requestStatus: string;
    treatment: string;
    treatmentCategory: string;
    nic: string;
    dependentNIC: string;
    dependentFirstName: string;
    dependentLastName: string;
    company: string;
  };
}

export interface IEmployeeUserFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    epfNo: string;
    firstName: string;
    lastName: string;
    nic: string;
    email: string;
    mobileNo: string;
    loginStatus: string;
    companyCode: string;
    staffCategoryCode: string;
    insurancePolicyCode: string;
  };
}

export interface IEmployeeUserList {
  id: number;
  username: string;
  primaryEmail: string;
  primaryMobile: string;
  loginStatus: string;
  loginStatusDescription: string;
  userPersonalDetails: {
    epfNo: string;
    firstName: string;
    lastName: string;
    nic: string;
  };
}

export interface IDeath {
  id: number;
  requestId: string;
  deathDate: string;
  requestStatus: string;
  requestStatusDescription: string;
  approvalLevel: string;
  approvalLevelDescription: string;
  createdDate: string;
}

export interface IDeathApprovalFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    requestId: string;
    epfNo: string;
    staffCategory: string;
    company: string;
    firstName: string;
    relationCategory: string;
  };
}

export interface IDeathHistoryFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    requestId: string;
    epfNo: string;
    staffCategory: string;
    company: string;
    firstName: string;
    relationCategory: string;
  };
}

export interface IDeathHistory {
  id: number;
  requestId: string;
  deathDate: string;
  requestStatus: string;
  requestStatusDescription: string;
  approvalLevel: string;
  approvalLevelDescription: string;
  employee: {
    userPersonalDetails: {
      userCompanyDetails: {
        companyTypes: {
          description: string;
        };
      };
    };
  };
}

export interface IDeathRequest {
  id: string;
  remark: string;
  deathDate: Date | "";
  documents: {
    type?: string;
    file?: any;
    fileType: string;
    fileName: string;
  }[];
}

export interface IDeathRequestFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    requestId: string;
    epfNo: string;
    staffCategory: string;
    company: string;
    firstName: string;
    relationCategory: string;
  };
}
export interface IDeathRequestList {
  id: number;
  requestId: string;
  deathDate: string;
  requestStatus: string;
  requestStatusDescription: string;
  employee: {
    userPersonalDetails: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface ICivilEmployee {
  id: number;
  status: string;
  statusDescription: string;
  maritalStatusDescription: string;
  documents: {
    type?: string;
    file?: any;
    fileType: string;
    fileName: string;
  }[];
  employeeName: string;
  nic: string;
  epfNo: string;
  company: string;
  staffCategory: string;
}

export interface ICivilEmployeeFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    staffCategory: string;
    civilStatus: string;
    status: string;
    company: string;
    epfNo: string;
  };
}

export interface IUpdateEmployee {
  id: string;
  staffCategory: string;
  policy: string;
  effectiveDate: Date;
  documents:
    | {
        type?: string;
        file?: string;
        fileType: string;
        fileName: string;
      }
    | Record<string, unknown>;
}

export interface ITransferEmployee {
  id: string;
  staffCategory: string;
  policy: string;
  effectiveDate: Date;
  documents: {
    type?: string;
    file?: any;
    fileType: string;
    fileName: string;
  };
}

export interface IViewDashboard {
  employee: {
    totalEmployees: number;
    totalMaleEmployees?: number;
    totalFemaleEmployees?: number;
    activeEmployees?: number;
    inactiveEmployees?: number;
    nonActiveEmployees?: number;
    approvedEmployees?: number;
    rejectedEmployees?: number;
    pendingEmployees?: number;
    dependentsTotal: number;
    totalMaleDependents?: number;
    totalFemaleDependents?: number;
    approvedDependents: number;
    rejectedDependents: number;
    pendingDependents: number;
  };
  healthClaims: {
    total: number;
    approved: number;
    rejected: number;
    underReview: number;
    todayTotal: number;
  };
  deathClaims: {
    total: number;
    approved: number;
    rejected: number;
    underReview: number;
    todayTotal: number;
  };
  companies?: {
    code: string;
    description: string;
    totalEmployees: number;
  }[];
  staffCategories?: {
    code: string;
    description: string;
    totalEmployees: number;
  }[];
  policies?: {
    code: string;
    description: string;
  }[];
}

export interface IAffectedClaimFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    staffCategory: string;
    dateFrom: string;
    dateTo: string;
    claimCategory: string;
    claimId: string;
    company: string;
    paymentCompany: string;
    epf: string;
    status: string | string[];
  };
}

export interface IAffectedClaim {
  id: number;
  requestId: string;
  insuranceClaimsDetails: {
    treatment: {
      treatmentCode: string;
      treatmentDescription: string;
    };
    treatmentCategory: {
      code: string;
      description: string;
    };
  };
  requestStatus: string;
  requestStatusDescription: string;
  approvalLevel: string;
  approvalLevelDescription: string;
  createdDate: string;
  employee: {
    userPersonalDetails: {
      epfNo: string;
    };
  };
  generatedStatus: string;
}

export interface IReceivedPaymentFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    attachmentNo: string;
    company: string;
    staffCategory: string;
    treatmentCategory: string;
    dateFrom: string;
    dateTo: string;
    status: string[];
  };
}

export interface IPayments {
  id: string;
  attachmentNo: string;
  status: string;
  companyCode: string;
  companyDescription: string;
  staffCategoryCode: string;
  staffCategoryDescription: string;
  treatmentCategory: string;
  treatmentCategoryDescription: string;
  dateFrom: string;
  dateTo: string;
  createdDate: string;
  createdBy: string;
}

export interface IPaymentAdviceFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    attachmentNo: string;
    staffCategory: string;
    company: string;
    dateFrom: string;
    dateTo: string;
    status: string | string[];
  };
}

export interface IAttachments {
  id: number;
  attachmentNo: string;
  companyDescription: string;
  staffCategoryDescription: string;
  status: string;
}

export interface IAdviceFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    adviceNo: string;
    staffCategory: string;
    company: string;
    dateFrom: string;
    dateTo: string;
    status: string | string[];
  };
}

export interface IAdvice {
  id: number;
  adviceNo: string;
  voucherNo: string;
  companyDescription: string;
  staffCategoryDescription: string;
  status: string;
}

export interface IDeathAttachmentFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    requestId: string;
    paymentCompany: string;
    dateFrom: string;
    dateTo: string;
    status: string | string[];
  };
}

export interface IDeathAttachment {
  id: number;
  requestId: string;
  employeeName: string;
  dependentName: string;
  staffCategoryDescription: string;
  status: string;
}

export interface IDeathAdviceFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    adviceNo: string;
    staffCategory: string;
    paymentCompany: string;
    dateFrom: string;
    dateTo: string;
    status: string | string[];
  };
}

export interface IDeathAdvice {
  id: number;
  adviceNo: string;
  voucherNo: string;
  chequeNo: string;
  paymentCompanyDescription: string;
  staffCategoryDescription: string;
  status: string;
}

export interface IEmployeeListFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    company: string;
    facility: string;
    status: string | string[];
    staffCategory: string;
    permanentDateFrom: string;
    permanentDateTo: string;
  };
}

export interface IDependentListFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    company: string;
    dependentCategory: string;
    staffCategory: string;
    fromDate: string;
    toDate: string;
  };
}

export interface IDependentList {
  id: number;
  firstName: string;
  lastName: string;
  relationCategoryDescription: string;
  dependentCategoryDescription: string;
  status: string;
  statusDescription: string;
  applicationUser: {
    userPersonalDetails: {
      userCompanyDetails: {
        companyTypes: {
          code: string;
          description: string;
        };
      };
    };
  };
  nic: string;
}

export interface IEmployeeCountFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    company: string;
    staffCategory: string;
    status: string | string[];
    fromDate: string;
    toDate: string;
  };
}

export interface IEmployeeCount {
  id: number;
  companyCode: string;
  companyDescription: string;
  staffCategoryCode: string;
  staffCategoryDescription: string;
  employeeCount: number;
  status: string;
}

export interface IEmployeeLeftFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    facility: string;
    terminateDateFrom: string;
    terminateDateTo: string;
    company: string;
    staffCategory: string;
  };
}

export interface IDeathReportFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    company: string;
    status: string | string[];
    dateFrom: string;
    dateTo: string;
  };
}

export interface IMedicalChequeCreation {
  company: string;
  year: string;
  staffCategory: string;
  months: string | string[];
  chequeNo: string;
  chequeBank: string;
  chequeBranch: string;
  chequeDate: Date | "";
  amount: string;
  receivedDate: Date | "";
  documents: {
    type?: string;
    file?: any;
    fileType: string;
    fileName: string;
  }[];
}
export interface IDeathChequeCreation {
  company: string;
  year: string;
  months: string | string[];
  chequeNo: string;
  chequeBank: string;
  chequeBranch: string;
  chequeDate: Date | "";
  amount: string;
  receivedDate: Date | "";
  documents: {
    type?: string;
    file?: any;
    fileType: string;
    fileName: string;
  }[];
}

export interface IChequeFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    company: string;
    chequeNo: string;
    staffCategory: string;
    months: string | string[];
    year: string;
    chequeDateFrom: string;
    chequeDateTo: string;
    amountFrom: string;
    amountTo: string;
  };
}

export interface ICheque {
  id: number;
  company: string;
  companyDescription: string;
  staffCategory: string;
  staffCategoryDescription: string;
  chequeNo: string;
  year: string;
}

export interface IEmployeeSummaryFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    company: string;
    periodId: string;
    epfNo: string;
  };
}

export interface ISummaryClaim {
  id: number;
  requestId: string;
  treatmentType: string;
  treatmentCategory: string;
  submittedValue: string;
  appliedDate: string;
  approvedValue: string;
  remark: string;
}

export interface ISummaryClaimBalance {
  id: number;
  treatmentDescription: string;
  treatmentCategoryDescription: string;
  availableLimit: string;
  fundLimit: string;
}

export interface IDeathPaidFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    company: string;
    relationCategory: string;
    employeeName: string;
    epfNo: string;
    requestId: string;
    status: string | string[];
    paymentAdviceStatus: string;
  };
}

export interface IDeathPaid {
  id: number;
  requestId: string;
  companyDescription: string;
  staffCategoryDescription: string;
  relationCategoryDescription: string;
  status: string;
  statusDescription: string;
  paymentAdviceGenerated: boolean;
  paymentAdviceStatusDescription: string;
  epfNo: string;
  employeeName: string;
}

export interface ITreatmentFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    company: string;
    treatment: string;
    treatmentCategory: string;
    staffCategory: string;
    fromDate: string;
    toDate: string;
  };
}

export interface ITreatment {
  id: number;
  companyDescription: string;
  treatmentDescription: string;
  treatmentCategoryDescription: string;
  requestTotalAmount: string;
  approvedTotalAmount: string;
  remainingBalance: string;
}

export interface IMedicalClaimFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    requestId: string;
    requestStatus: string;
    treatment: string;
    treatmentCategory: string;
    company: string;
    epfNo: string;
    staffCategory: string;
    fromDate: string;
    toDate: string;
    paymentAdviceStatus: string;
  };
}

export interface IMedicalClaim {
  id: number;
  requestId: string;
  insuranceClaimsDetails: {
    treatment: {
      treatmentCode: string;
      treatmentDescription: string;
    };
    treatmentCategory: {
      code: string;
      description: string;
    };
  };
  requestStatus: string;
  requestStatusDescription: string;
  paymentAdviceStatus: string;
  paymentAdviceStatusDescription: string;
  approvalLevel: string;
  approvalLevelDescription: string;
  createdDate: string;
  employee: {
    userPersonalDetails: {
      epfNo: string;
    };
  };
}

export interface IProfitLossFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    company: string;
    months: string | string[];
    reportType: string;
    year: string;
    staffCategory: string;
  };
}

export interface IProfitLoss {
  id: number;
  companyDescription: string;
  totalPaid: string;
  totalReceived: string;
  difference: string;
  resultDescription: string;
  result: string;
  year: string;
}

export interface IThirdPartyFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: {
    batchNo: string;
    fileName: string;
    status: string;
    uploadedBy: string;
    fromDate: string;
    toDate: string;
  };
}

export interface INewThirdPartDoc {
  file: any;
  fileType: string;
  fileName: string;
}

export interface IThirdParty {
  id: number;
  batchNo: string;
  fileName: string;
  createdBy: string;
  status: string;
  statusDescription: string;
}

export interface IThirdPartyIndoorClaimRow {
  id: number;
  rowNo: number;
  externalReferenceNo: string;
  companyCode: string;
  epfNo: string;
  employeeName: string;
  policyYear: number;
  policyNo: string;
  fromDate: string;
  toDate: string;
  intimatedDate: string;
  paidDate: string;
  nonPayableAmount: number;
  nonPayableItem: string;
  requestAmount: number;
  approvedAmount: number;
  remark: string | null;
  status: string;
  statusDescription: string;
  errorMessage: string | null;
  insuranceClaimId: number | null;
  insuranceClaimRequestId: string | null;
}

export interface IThirdPartyIndoorClaimBatchDetail {
  id: number;
  batchNo: string;
  fileName: string;
  fileType: string;
  status: string;
  statusDescription: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  importedRows: number;
  createdDate: string;
  createdBy: string;
  rows: IThirdPartyIndoorClaimRow[];
}
export interface ITotalReceivedClaimsFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    dateFrom: string;
    dateTo: string;
  };
}
export interface TTotalReceivedClaimItem {
  staffCategory: string;
  claimReceivedPeriod: string;
  receivedClaims: number;
  settledClaims: number;
  remark: string;
}
export interface TTotalReceivedClaimsResponse {
  period: string;
  monthTitle: string;
  normalStaffClaims: {
    staffCategory: string;
    claimReceivedPeriod: string;
    receivedClaims: number;
    stillProcessingClaims: number;
    settledClaims: number;
    rejectedClaims: number;
    assumeRejectClaims: number;
    notYetProcessedClaims: number;
    wecareSettledClaims: number;
  };
  thirdPartyClaims: TTotalReceivedClaimItem[];
  wecareClaims: TTotalReceivedClaimItem[];
  ddfClaims: TTotalReceivedClaimItem[];
}

export interface IClaimStatusFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    fromDate: string;
    toDate: string;
    company: string;
    staffCategory: string;
    epfNo: string;
    employeeName: string;
    dependentName: string;
    dependentCategory: string;
    treatment: string;
    claimStatus: string;
    treatmentCategory: string;
  };
}

export interface IClaimStatus {
  date: string;
  company: string;
  staffCategory: string;
  epfNumber: string;
  employeeName: string;
  dependentName: string;
  dependentCategory: string;
  treatmentType: string;
  requestAmount: string;
  approvedAmount: string;
  claimStatus: string;
  finalRemark: string;
}

export interface IRejectedClaimFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    fromDate: string;
    toDate: string;
    company: string;
    staffCategory: string;
    periodId: string;
  };
}

export interface IRejectedClaimReason {
  rejectedClaims: number;
  returnReason: string;
}

export interface IRejectedClaimCompany {
  companyCode: string;
  companyDescription: string;
  receivedClaims: number;
  rejectedClaims: number;
  reasons: IRejectedClaimReason[];
}

export interface IRejectedClaimReport {
  title: string;
  subTitle: string;
  staffCategoryTitle: string;
  period: string;
  monthTitle: string;
  totalReceivedClaims: number;
  totalRejectedClaims: number;
  rejectedPercentage: number;
  companies: any[];

  policyPeriods?: {
    periodId: number;
    periodDescription: string;
    totalReceivedClaims: number;
    totalRejectedClaims: number;
    rejectedPercentage: number;
    companies: any[];
  }[];
}

export interface IDailyTaskFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  filters: {
    fromDate: string;
    toDate: string;
    claimType: string;
  };
}
export interface IDailyTaskCountDetails {
  count: number;
  details: string;
}
export interface IDailyTaskMedicalSection {
  staffType: string;
  date: string;
  claimsReceived: number;
  notYetProcessed: number;
  firstCheckComplete: IDailyTaskCountDetails;
  pendingRequirementClaims: number;
  haveToPreparePaymentAttachments: IDailyTaskCountDetails;
  preparePaymentAttachments: IDailyTaskCountDetails;
  haveToHandoverForFinalCheck: IDailyTaskCountDetails;
  handoverForFinalCheck: IDailyTaskCountDetails;
  haveToCompleteFinalCheck: IDailyTaskCountDetails;
  finalCheckComplete: IDailyTaskCountDetails;
  haveToInputToCurrentSystem: IDailyTaskCountDetails;
  inputToCurrentSystem: IDailyTaskCountDetails;
  haveToPaymentsComplete: IDailyTaskCountDetails;
  paymentsCompleted: IDailyTaskCountDetails;
  otherWorks: string;
  claimsReceivedDetails?: string;
  notYetProcessedDetails?: string;
}
export interface IDailyTaskDdfSection {
  staffType: string;
  date: string;

  claimsReceivedDetails?: string;
  notYetProcessedDetails?: string;

  firstCheckComplete?: IDailyTaskCountDetails;

  pendingRequirementClaims?: number;

  haveToHandoverToAuthorizedPerson?: IDailyTaskCountDetails;
  handoverToAuthorizedPerson?: IDailyTaskCountDetails;

  haveToHandoverToFinalCheck?: IDailyTaskCountDetails;
  handoverToFinalCheck?: IDailyTaskCountDetails;

  haveToCompleteFinalCheck?: IDailyTaskCountDetails;
  finalCheckComplete?: IDailyTaskCountDetails;

  haveToPreparePayment?: IDailyTaskCountDetails;

  haveToCheckedPaymentAdviceAndFundTransfer?: IDailyTaskCountDetails;
  paymentAdviceAndFundTransferChecked?: IDailyTaskCountDetails;

  returnedClaims?: number;

  haveToPaymentsCompleted?: IDailyTaskCountDetails;
  paymentsCompleted?: IDailyTaskCountDetails;

  otherWorks?: string | null;
}
export interface IDailyTaskReportData {
  period: string;
  medical: IDailyTaskMedicalSection | null;
  ddf: IDailyTaskDdfSection | null;
}

export interface IDailyTaskExportPayload {
  filters: {
    fromDate: string;
    toDate: string;
    claimType?: string;
  };
  medicalOtherWorks?: string;
  ddfOtherWorks?: string;
}

export interface IAuditLookup {
  code: string;
  description: string;
}

export interface IAuditLog {
  id: number;
  dateTime: string;
  source: string;
  module: string;
  action: string;
  result: string;
  responseStatus: number | null;
  requestPath: string | null;
  httpMethod: string | null;
  durationMs: number | null;
  correlationId: string | null;
  pageCode: string | null;
  pageDescription: string | null;
  taskCode: string | null;
  taskDescription: string | null;
  username: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  oldValue: unknown;
  newValue: unknown;
}

export interface IAuditLogSearch {
  source: string;
  pageCode: string;
  taskCode: string;
  username: string;
  fromDate: string;
  toDate: string;
}

export interface IAuditLogFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: IAuditLogSearch;
}

export interface IAdminActivity {
  id: number;
  dateTime: string;
  activity: string | null;
  module: string | null;
  moduleDescription: string | null;
  performedBy: string | null;
  result: string | null;
  ipAddress: string | null;
  device: string | null;
  correlationId: string | null;
}

export interface IAdminActivitySearch {
  pageCode: string;
  taskCode: string;
  action: string;
  result: string;
  username: string;
  fromDate: string;
  toDate: string;
}

export interface IAdminActivityFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: IAdminActivitySearch;
}

export type ICareAppActivity = IAdminActivity;

export interface ICareAppActivitySearch {
  module: string;
  action: string;
  result: string;
  username: string;
  fromDate: string;
  toDate: string;
}

export interface ICareAppActivityFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: ICareAppActivitySearch;
}

export interface ISupportTicketAttachment {
  id?: number;
  messageId?: number | null;
  documentId?: number;
  fileName: string;
  fileType: string;
  file: string;
}

export interface ISupportTicketReply {
  id: number;
  authorUsername: string;
  authorName: string;
  message: string;
  createdDate: string;
  attachments: ISupportTicketAttachment[];
}

export interface ISupportTicketStatusHistory {
  oldStatus: string | null;
  newStatus: string;
  remark: string | null;
  changedBy: string;
  changedDate: string;
}

export interface ISupportTicket {
  id: number;
  ticketNo: string;
  systemType: string;
  systemDescription: string;
  companyCode: string;
  companyDescription: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  resolution: string | null;
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
  resolvedDate: string | null;
  closedDate: string | null;
  replyCount: number;
  attachmentCount: number;
  replies: ISupportTicketReply[] | null;
  attachments: ISupportTicketAttachment[] | null;
  statusHistory: ISupportTicketStatusHistory[] | null;
}

export interface ISupportTicketSearch {
  ticketNo: string;
  companyCode: string;
  category: string;
  subject: string;
  priority: string;
  status: string;
  createdBy: string;
  fromDate: string;
  toDate: string;
}

export interface ISupportTicketFilter {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  search: ISupportTicketSearch;
}

export interface ISupportTicketForm {
  companyCode: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  attachments: ISupportTicketAttachment[];
}
