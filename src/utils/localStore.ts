export interface CompanyGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
}

export interface Company {
  id: string;
  groupId: string;
  name: string;
  code: string;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  companyId: string;
  employeeNo: string;
  title: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  status: string;
  image?: string;
  createdAt: string;
}

export interface ProductionLine {
  id: string;
  companyId: string;
  sectionId: string;
  name: string;
  code: string;
  style: string;
  targetOutput: string;
  employeeCount: string;
  employeeIds: string[];
  shift: string;
  createdAt: string;
}

export type OrderStatus =
  | "Confirmed"
  | "In Cutting"
  | "In Sewing"
  | "In Finishing"
  | "Packed"
  | "Shipped"
  | "On Hold"
  | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "Confirmed",
  "In Cutting",
  "In Sewing",
  "In Finishing",
  "Packed",
  "Shipped",
  "On Hold",
  "Cancelled",
];

export const GARMENT_TYPES = [
  "T-Shirt",
  "Polo Shirt",
  "Shirt",
  "Blouse",
  "Hoodie",
  "Sweatshirt",
  "Jacket",
  "Trousers",
  "Jeans",
  "Shorts",
  "Skirt",
  "Dress",
  "Leggings",
  "Underwear",
  "Activewear",
];

export const FABRIC_TYPES = [
  "Cotton Jersey",
  "Cotton Poplin",
  "Cotton Twill",
  "Cotton/Polyester",
  "Polyester",
  "Fleece",
  "Denim",
  "Rib",
  "Interlock",
  "French Terry",
  "Linen",
  "Viscose",
  "Nylon",
];

export const SEASONS = [
  "SS26",
  "AW26",
  "SS27",
  "AW27",
  "Holiday",
  "Core / Basic",
  "Repeat Order",
];

export const SIZE_RANGES = [
  "XS-XL",
  "S-XL",
  "S-XXL",
  "XS-XXL",
  "28-38",
  "2-12",
  "One Size",
];

export interface OrderBook {
  id: string;
  companyId: string;
  orderNo: string;
  styleNo: string;
  styleName: string;
  buyer: string;
  season: string;
  garmentType: string;
  fabricType: string;
  color: string;
  sizeRange: string;
  qtyXS: string;
  qtyS: string;
  qtyM: string;
  qtyL: string;
  qtyXL: string;
  qtyXXL: string;
  orderQty: string;
  orderDate: string;
  deliveryDate: string;
  merchandiser: string;
  status: OrderStatus | string;
  remarks: string;
  createdAt: string;
}

export interface Section {
  id: string;
  companyId: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
}

export type HolidayType =
  | "Public"
  | "Mercantile"
  | "Bank"
  | "Religious"
  | "Company"
  | "Optional"
  | "Special";

export const HOLIDAY_TYPES: HolidayType[] = [
  "Public",
  "Mercantile",
  "Bank",
  "Religious",
  "Company",
  "Optional",
  "Special",
];

export interface CalendarHoliday {
  id: string;
  date: string;
  name: string;
  type: HolidayType;
  description: string;
}

export interface CalendarConfig {
  id: string;
  year: number;
  name: string;
  weekStartsOn: 0 | 1;
  weekendDays: number[];
  holidays: CalendarHoliday[];
  updatedAt: string;
}

export interface PlanningSkipSettings {
  skipWeekends: boolean;
  skipSaturday: boolean;
  skipSunday: boolean;
  skipHolidayTypes: HolidayType[];
}

export const DEFAULT_PLANNING_SKIP: PlanningSkipSettings = {
  skipWeekends: false,
  skipSaturday: false,
  skipSunday: true,
  skipHolidayTypes: [...HOLIDAY_TYPES],
};

export function normalizePlanningSkip(
  raw?: Partial<PlanningSkipSettings> | null,
): PlanningSkipSettings {
  const skipHolidayTypes = Array.isArray(raw?.skipHolidayTypes)
    ? raw.skipHolidayTypes.filter((type): type is HolidayType =>
        HOLIDAY_TYPES.includes(type as HolidayType),
      )
    : [...HOLIDAY_TYPES];
  const skipWeekends = Boolean(raw?.skipWeekends);
  const skipSaturday = skipWeekends || Boolean(raw?.skipSaturday);
  const skipSunday =
    skipWeekends || (raw?.skipSunday === undefined ? true : Boolean(raw.skipSunday));
  return {
    skipWeekends: skipWeekends || (skipSaturday && skipSunday),
    skipSaturday,
    skipSunday,
    skipHolidayTypes,
  };
}

export function isSkippedWeekday(
  weekday: number,
  skip?: PlanningSkipSettings,
) {
  if (!skip) return weekday === 0 || weekday === 6;
  if (weekday === 0) return skip.skipWeekends || skip.skipSunday;
  if (weekday === 6) return skip.skipWeekends || skip.skipSaturday;
  return false;
}

export function isSkippedHolidayType(
  type: HolidayType,
  skip?: PlanningSkipSettings,
) {
  if (!skip) return true;
  return skip.skipHolidayTypes.includes(type);
}

export function isSkippedDate(
  weekday: number,
  holidays: Array<{ type: HolidayType }>,
  skip?: PlanningSkipSettings,
) {
  if (isSkippedWeekday(weekday, skip)) return true;
  return holidays.some((holiday) => isSkippedHolidayType(holiday.type, skip));
}

export interface ProductionPlanAssignment {
  id: string;
  orderId: string;
  lineId: string;
  startDate: string;
  qty?: number;
  createdAt: string;
}

const KEYS = {
  groups: "ss_groups",
  companies: "ss_companies",
  employees: "ss_employees",
  productionLines: "ss_production_lines",
  sections: "ss_sections",
  calendars: "ss_calendars_v2",
  orders: "ss_order_book",
  productionPlans: "ss_production_plans",
  planningSkip: "ss_planning_skip",
};

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, items: T[]) {
  window.localStorage.setItem(key, JSON.stringify(items));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createStore<T extends { id: string }>(key: string) {
  return {
    getAll: () => readList<T>(key),
    add: (item: Omit<T, "id"> & Partial<Pick<T, "id">>) => {
      const next = { ...item, id: item.id || createId() } as T;
      writeList(key, [...readList<T>(key), next]);
      return next;
    },
    update: (id: string, patch: Partial<T>) => {
      const items = readList<T>(key).map((item) =>
        item.id === id ? ({ ...item, ...patch, id } as T) : item,
      );
      writeList(key, items);
      return items.find((item) => item.id === id);
    },
    remove: (id: string) => {
      writeList(
        key,
        readList<T>(key).filter((item) => item.id !== id),
      );
    },
  };
}

export const groupStore = {
  ...createStore<CompanyGroup>(KEYS.groups),
  add: (item: Omit<CompanyGroup, "id" | "createdAt">) => {
    const next: CompanyGroup = {
      ...item,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.groups, [...groupStore.getAll(), next]);
    return next;
  },
};

export const companyStore = {
  ...createStore<Company>(KEYS.companies),
  add: (item: Omit<Company, "id" | "createdAt">) => {
    const next: Company = {
      ...item,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.companies, [...companyStore.getAll(), next]);
    return next;
  },
};

export const employeeStore = {
  ...createStore<Employee>(KEYS.employees),
  add: (item: Omit<Employee, "id" | "createdAt">) => {
    const next: Employee = {
      ...item,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.employees, [...employeeStore.getAll(), next]);
    return next;
  },
};

export const productionLineStore = {
  ...createStore<ProductionLine>(KEYS.productionLines),
  add: (item: Omit<ProductionLine, "id" | "createdAt">) => {
    const next: ProductionLine = {
      ...item,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.productionLines, [...productionLineStore.getAll(), next]);
    return next;
  },
};

export const sectionStore = {
  ...createStore<Section>(KEYS.sections),
  add: (item: Omit<Section, "id" | "createdAt">) => {
    const next: Section = {
      ...item,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.sections, [...sectionStore.getAll(), next]);
    return next;
  },
};

export const orderBookStore = {
  ...createStore<OrderBook>(KEYS.orders),
  add: (item: Omit<OrderBook, "id" | "createdAt">) => {
    const next: OrderBook = {
      ...item,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.orders, [...orderBookStore.getAll(), next]);
    return next;
  },
};

export const productionPlanStore = {
  ...createStore<ProductionPlanAssignment>(KEYS.productionPlans),
  assign: (item: Omit<ProductionPlanAssignment, "id" | "createdAt">) => {
    const next: ProductionPlanAssignment = {
      ...item,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    const items = productionPlanStore
      .getAll()
      .filter((assignment) => assignment.orderId !== item.orderId);
    writeList(KEYS.productionPlans, [...items, next]);
    return next;
  },
  addSegment: (item: Omit<ProductionPlanAssignment, "id" | "createdAt">) => {
    const next: ProductionPlanAssignment = {
      ...item,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    writeList(KEYS.productionPlans, [...productionPlanStore.getAll(), next]);
    return next;
  },
  removeByOrderId: (orderId: string) => {
    writeList(
      KEYS.productionPlans,
      productionPlanStore
        .getAll()
        .filter((assignment) => assignment.orderId !== orderId),
    );
  },
};

function holidayId() {
  return `hol-${createId()}`;
}

type StandardHolidaySeed = {
  month: number;
  day: number;
  name: string;
  type: HolidayType;
  description: string;
};

/** Official Sri Lanka holidays (2026 gazette / CBSL). Used as the default calendar. */
const SRI_LANKA_HOLIDAYS_2026: StandardHolidaySeed[] = [
  {
    month: 1,
    day: 3,
    name: "Duruthu Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 1,
    day: 15,
    name: "Tamil Thai Pongal Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 2,
    day: 1,
    name: "Navam Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 2,
    day: 4,
    name: "Independence Day",
    type: "Mercantile",
    description: "National Day — Public, Bank & Mercantile holiday",
  },
  {
    month: 2,
    day: 15,
    name: "Mahasivarathri Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 3,
    day: 2,
    name: "Medin Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 3,
    day: 21,
    name: "Id-Ul-Fitre (Ramazan Festival Day)",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 4,
    day: 1,
    name: "Bak Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 4,
    day: 3,
    name: "Good Friday",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 4,
    day: 13,
    name: "Day prior to Sinhala & Tamil New Year Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 4,
    day: 14,
    name: "Sinhala & Tamil New Year Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 5,
    day: 1,
    name: "Vesak Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 5,
    day: 1,
    name: "May Day (International Workers' Day)",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 5,
    day: 2,
    name: "Day following Vesak Full Moon Poya Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 5,
    day: 28,
    name: "Id-Ul-Allah (Hadji Festival Day)",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 5,
    day: 30,
    name: "Adhi Poson Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 6,
    day: 29,
    name: "Poson Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 7,
    day: 29,
    name: "Esala Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 8,
    day: 26,
    name: "Milad-Un-Nabi (Holy Prophet's Birthday)",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 8,
    day: 27,
    name: "Nikini Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 9,
    day: 26,
    name: "Binara Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 10,
    day: 25,
    name: "Vap Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 11,
    day: 8,
    name: "Deepavali Festival Day",
    type: "Public",
    description: "Public & Bank holiday",
  },
  {
    month: 11,
    day: 24,
    name: "Ill Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 12,
    day: 23,
    name: "Unduwap Full Moon Poya Day",
    type: "Religious",
    description: "Public & Bank holiday",
  },
  {
    month: 12,
    day: 25,
    name: "Christmas Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
];

/** Fixed national holidays reused when an official year gazette list is not embedded. */
const FIXED_NATIONAL_HOLIDAYS: StandardHolidaySeed[] = [
  {
    month: 1,
    day: 15,
    name: "Tamil Thai Pongal Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 2,
    day: 4,
    name: "Independence Day",
    type: "Mercantile",
    description: "National Day — Public, Bank & Mercantile holiday",
  },
  {
    month: 4,
    day: 13,
    name: "Day prior to Sinhala & Tamil New Year Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 4,
    day: 14,
    name: "Sinhala & Tamil New Year Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 5,
    day: 1,
    name: "May Day (International Workers' Day)",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
  {
    month: 12,
    day: 25,
    name: "Christmas Day",
    type: "Mercantile",
    description: "Public, Bank & Mercantile holiday",
  },
];

function buildHolidaysFromSeed(
  year: number,
  seeds: StandardHolidaySeed[],
): CalendarHoliday[] {
  return seeds.map((seed) => ({
    id: holidayId(),
    date: `${year}-${String(seed.month).padStart(2, "0")}-${String(seed.day).padStart(2, "0")}`,
    name: seed.name,
    type: seed.type,
    description: seed.description,
  }));
}

/** Default calendar with original Sri Lanka holidays. */
export function createStandardCalendar(year: number): CalendarConfig {
  const seeds =
    year === 2026 ? SRI_LANKA_HOLIDAYS_2026 : FIXED_NATIONAL_HOLIDAYS;

  return {
    id: `calendar-${year}`,
    year,
    name: `${year} Sri Lanka Holiday Calendar`,
    weekStartsOn: 1,
    weekendDays: [0],
    holidays: buildHolidaysFromSeed(year, seeds),
    updatedAt: new Date().toISOString(),
  };
}

export const calendarStore = {
  getAll: () => readList<CalendarConfig>(KEYS.calendars),
  getByYear: (year: number) =>
    calendarStore.getAll().find((item) => item.year === year),
  getOrCreate: (year: number) => {
    const existing = calendarStore.getByYear(year);
    if (existing) return existing;
    const next = createStandardCalendar(year);
    writeList(KEYS.calendars, [...calendarStore.getAll(), next]);
    return next;
  },
  save: (config: CalendarConfig) => {
    const next: CalendarConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    const items = calendarStore.getAll();
    const index = items.findIndex((item) => item.year === config.year);
    if (index >= 0) {
      items[index] = next;
    } else {
      items.push(next);
    }
    writeList(KEYS.calendars, items);
    return next;
  },
  resetToStandard: (year: number) => {
    const next = createStandardCalendar(year);
    return calendarStore.save(next);
  },
};

export const planningSkipStore = {
  get: (): PlanningSkipSettings => {
    if (typeof window === "undefined") {
      return normalizePlanningSkip(DEFAULT_PLANNING_SKIP);
    }
    try {
      const raw = window.localStorage.getItem(KEYS.planningSkip);
      return normalizePlanningSkip(raw ? JSON.parse(raw) : DEFAULT_PLANNING_SKIP);
    } catch {
      return normalizePlanningSkip(DEFAULT_PLANNING_SKIP);
    }
  },
  save: (settings: PlanningSkipSettings) => {
    const next = normalizePlanningSkip(settings);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEYS.planningSkip, JSON.stringify(next));
    }
    return next;
  },
};

const DUMMY_PROJECT_SEED_KEY = "ss_dummy_project_v1";
const DUMMY_EMPLOYEES_SEED_KEY = "ss_dummy_employees_v1";
const DUMMY_ORDER_TREND_DATES: Record<string, string> = {
  "PO-26001": "2026-04-12",
  "PO-26002": "2026-05-08",
  "PO-26003": "2026-05-22",
  "PO-26004": "2026-06-14",
  "PO-26005": "2026-06-26",
  "PO-26006": "2026-07-11",
  "PO-26007": "2026-07-24",
  "PO-26008": "2026-08-09",
  "PO-26009": "2026-08-21",
  "PO-26010": "2026-09-05",
  "PO-26011": "2026-04-20",
  "PO-26012": "2026-05-02",
  "PO-26013": "2026-05-16",
  "PO-26014": "2026-06-03",
  "PO-26015": "2026-06-18",
  "PO-26016": "2026-07-02",
  "PO-26017": "2026-04-28",
  "PO-26018": "2026-05-12",
  "PO-26019": "2026-05-30",
  "PO-26020": "2026-06-09",
  "PO-26021": "2026-06-22",
  "PO-26022": "2026-07-16",
  "PO-26023": "2026-04-16",
  "PO-26024": "2026-05-05",
  "PO-26025": "2026-05-19",
  "PO-26026": "2026-06-01",
  "PO-26027": "2026-06-28",
  "PO-26028": "2026-07-08",
  "PO-26029": "2026-07-30",
  "PO-26030": "2026-08-15",
};

function patchDummyOrderTrendDates() {
  orderBookStore.getAll().forEach((order) => {
    const orderDate = DUMMY_ORDER_TREND_DATES[order.orderNo];
    if (orderDate && order.orderDate !== orderDate) {
      orderBookStore.update(order.id, { orderDate });
    }
  });
}

const DUMMY_EMPLOYEE_DATA: Omit<Employee, "id" | "createdAt" | "companyId">[] = [
  {
    employeeNo: "EMP001",
    title: "Mr",
    firstName: "Nimal",
    lastName: "Perera",
    role: "Operator",
    department: "Production",
    phone: "0771000001",
    email: "nimal.perera@example.com",
    dateOfBirth: "1990-03-12",
    status: "Active",
  },
  {
    employeeNo: "EMP002",
    title: "Mrs",
    firstName: "Kamala",
    lastName: "Silva",
    role: "Supervisor",
    department: "Production",
    phone: "0771000002",
    email: "kamala.silva@example.com",
    dateOfBirth: "1988-07-21",
    status: "Active",
  },
  {
    employeeNo: "EMP003",
    title: "Ms",
    firstName: "Anusha",
    lastName: "Fernando",
    role: "Quality Inspector",
    department: "Quality",
    phone: "0771000003",
    email: "anusha.fernando@example.com",
    dateOfBirth: "1992-11-05",
    status: "Active",
  },
  {
    employeeNo: "EMP004",
    title: "Mr",
    firstName: "Ruwan",
    lastName: "Jayasinghe",
    role: "Technician",
    department: "Maintenance",
    phone: "0771000004",
    email: "ruwan.jayasinghe@example.com",
    dateOfBirth: "1985-01-18",
    status: "Active",
  },
  {
    employeeNo: "EMP005",
    title: "Miss",
    firstName: "Sanduni",
    lastName: "Wickramasinghe",
    role: "Operator",
    department: "Production",
    phone: "0771000005",
    email: "sanduni.w@example.com",
    dateOfBirth: "1995-09-30",
    status: "Active",
  },
  {
    employeeNo: "EMP006",
    title: "Mr",
    firstName: "Chathura",
    lastName: "Bandara",
    role: "Manager",
    department: "Production",
    phone: "0771000006",
    email: "chathura.bandara@example.com",
    dateOfBirth: "1982-04-09",
    status: "Active",
  },
  {
    employeeNo: "EMP007",
    title: "Mrs",
    firstName: "Dilani",
    lastName: "Gunasekara",
    role: "HR",
    department: "HR",
    phone: "0771000007",
    email: "dilani.g@example.com",
    dateOfBirth: "1989-12-14",
    status: "Active",
  },
  {
    employeeNo: "EMP008",
    title: "Mr",
    firstName: "Tharindu",
    lastName: "Rathnayake",
    role: "Operator",
    department: "Production",
    phone: "0771000008",
    email: "tharindu.r@example.com",
    dateOfBirth: "1993-06-02",
    status: "Active",
  },
  {
    employeeNo: "EMP009",
    title: "Ms",
    firstName: "Ishara",
    lastName: "Dissanayake",
    role: "Accountant",
    department: "Finance",
    phone: "0771000009",
    email: "ishara.d@example.com",
    dateOfBirth: "1991-08-25",
    status: "Active",
  },
  {
    employeeNo: "EMP010",
    title: "Mr",
    firstName: "Lasith",
    lastName: "Mendis",
    role: "Technician",
    department: "Maintenance",
    phone: "0771000010",
    email: "lasith.mendis@example.com",
    dateOfBirth: "1987-02-17",
    status: "Active",
  },
  {
    employeeNo: "EMP011",
    title: "Miss",
    firstName: "Nadeesha",
    lastName: "Karunaratne",
    role: "Operator",
    department: "Production",
    phone: "0771000011",
    email: "nadeesha.k@example.com",
    dateOfBirth: "1996-10-08",
    status: "Active",
  },
  {
    employeeNo: "EMP012",
    title: "Mr",
    firstName: "Sahan",
    lastName: "Abeysekara",
    role: "Supervisor",
    department: "Quality",
    phone: "0771000012",
    email: "sahan.a@example.com",
    dateOfBirth: "1986-05-29",
    status: "Active",
  },
  {
    employeeNo: "EMP013",
    title: "Mrs",
    firstName: "Piumi",
    lastName: "Senanayake",
    role: "Admin",
    department: "IT",
    phone: "0771000013",
    email: "piumi.s@example.com",
    dateOfBirth: "1990-07-11",
    status: "Active",
  },
  {
    employeeNo: "EMP014",
    title: "Mr",
    firstName: "Kasun",
    lastName: "Weerasinghe",
    role: "Operator",
    department: "Production",
    phone: "0771000014",
    email: "kasun.w@example.com",
    dateOfBirth: "1994-03-03",
    status: "Active",
  },
  {
    employeeNo: "EMP015",
    title: "Ms",
    firstName: "Hasini",
    lastName: "Pathirana",
    role: "Quality Inspector",
    department: "Quality",
    phone: "0771000015",
    email: "hasini.p@example.com",
    dateOfBirth: "1993-01-22",
    status: "Active",
  },
  {
    employeeNo: "EMP016",
    title: "Mr",
    firstName: "Amila",
    lastName: "Herath",
    role: "Operator",
    department: "Stores",
    phone: "0771000016",
    email: "amila.herath@example.com",
    dateOfBirth: "1989-09-16",
    status: "Active",
  },
  {
    employeeNo: "EMP017",
    title: "Miss",
    firstName: "Thilini",
    lastName: "Jayawardena",
    role: "Operator",
    department: "Production",
    phone: "0771000017",
    email: "thilini.j@example.com",
    dateOfBirth: "1997-12-01",
    status: "Active",
  },
  {
    employeeNo: "EMP018",
    title: "Mr",
    firstName: "Dinesh",
    lastName: "Ranasinghe",
    role: "Technician",
    department: "Maintenance",
    phone: "0771000018",
    email: "dinesh.r@example.com",
    dateOfBirth: "1984-06-19",
    status: "Active",
  },
  {
    employeeNo: "EMP019",
    title: "Mrs",
    firstName: "Malsha",
    lastName: "Ekanayake",
    role: "Supervisor",
    department: "Merchandising",
    phone: "0771000019",
    email: "malsha.e@example.com",
    dateOfBirth: "1988-04-27",
    status: "Active",
  },
  {
    employeeNo: "EMP020",
    title: "Mr",
    firstName: "Pradeep",
    lastName: "Gamage",
    role: "Operator",
    department: "Production",
    phone: "0771000020",
    email: "pradeep.gamage@example.com",
    dateOfBirth: "1991-11-13",
    status: "Active",
  },
];

type DummyEmployeeSeed = Omit<Employee, "id" | "createdAt" | "companyId"> & {
  companyCode: string;
};

const EXTRA_EMPLOYEE_DATA: DummyEmployeeSeed[] = [
  {
    companyCode: "SSF01",
    employeeNo: "EMP021",
    title: "Mr",
    firstName: "Lakmal",
    lastName: "Jayawardena",
    role: "Operator",
    department: "Finishing",
    phone: "0771000021",
    email: "lakmal.j@example.com",
    dateOfBirth: "1992-04-16",
    status: "Active",
  },
  {
    companyCode: "SSF01",
    employeeNo: "EMP022",
    title: "Miss",
    firstName: "Sewwandi",
    lastName: "Perera",
    role: "Operator",
    department: "Finishing",
    phone: "0771000022",
    email: "sewwandi.p@example.com",
    dateOfBirth: "1996-08-04",
    status: "Active",
  },
  {
    companyCode: "SSF01",
    employeeNo: "EMP023",
    title: "Mr",
    firstName: "Isuru",
    lastName: "Madushanka",
    role: "Operator",
    department: "Packing",
    phone: "0771000023",
    email: "isuru.m@example.com",
    dateOfBirth: "1994-02-11",
    status: "Active",
  },
  {
    companyCode: "SKN01",
    employeeNo: "EMP024",
    title: "Mr",
    firstName: "Amal",
    lastName: "Perera",
    role: "Operator",
    department: "Production",
    phone: "0771000024",
    email: "amal.perera@example.com",
    dateOfBirth: "1990-05-08",
    status: "Active",
  },
  {
    companyCode: "SKN01",
    employeeNo: "EMP025",
    title: "Mrs",
    firstName: "Nirosha",
    lastName: "Silva",
    role: "Operator",
    department: "Production",
    phone: "0771000025",
    email: "nirosha.silva@example.com",
    dateOfBirth: "1991-09-19",
    status: "Active",
  },
  {
    companyCode: "SKN01",
    employeeNo: "EMP026",
    title: "Mr",
    firstName: "Gayan",
    lastName: "Fernando",
    role: "Supervisor",
    department: "Production",
    phone: "0771000026",
    email: "gayan.fernando@example.com",
    dateOfBirth: "1987-01-26",
    status: "Active",
  },
  {
    companyCode: "SKN01",
    employeeNo: "EMP027",
    title: "Ms",
    firstName: "Kavindi",
    lastName: "Jayasuriya",
    role: "Operator",
    department: "Production",
    phone: "0771000027",
    email: "kavindi.j@example.com",
    dateOfBirth: "1995-12-03",
    status: "Active",
  },
  {
    companyCode: "SKN01",
    employeeNo: "EMP028",
    title: "Mr",
    firstName: "Roshan",
    lastName: "Wickrama",
    role: "Operator",
    department: "Production",
    phone: "0771000028",
    email: "roshan.w@example.com",
    dateOfBirth: "1993-07-14",
    status: "Active",
  },
  {
    companyCode: "SKN01",
    employeeNo: "EMP029",
    title: "Ms",
    firstName: "Sachini",
    lastName: "Bandara",
    role: "Quality Inspector",
    department: "Quality",
    phone: "0771000029",
    email: "sachini.b@example.com",
    dateOfBirth: "1994-11-21",
    status: "Active",
  },
  {
    companyCode: "SKN01",
    employeeNo: "EMP030",
    title: "Mr",
    firstName: "Nuwan",
    lastName: "Gunawardena",
    role: "Operator",
    department: "Production",
    phone: "0771000030",
    email: "nuwan.g@example.com",
    dateOfBirth: "1989-03-09",
    status: "Active",
  },
  {
    companyCode: "SKN01",
    employeeNo: "EMP031",
    title: "Miss",
    firstName: "Harshani",
    lastName: "Dias",
    role: "Operator",
    department: "Production",
    phone: "0771000031",
    email: "harshani.dias@example.com",
    dateOfBirth: "1997-06-18",
    status: "Active",
  },
  {
    companyCode: "SYW01",
    employeeNo: "EMP032",
    title: "Mr",
    firstName: "Janith",
    lastName: "Rajapaksa",
    role: "Operator",
    department: "Production",
    phone: "0771000032",
    email: "janith.r@example.com",
    dateOfBirth: "1990-10-02",
    status: "Active",
  },
  {
    companyCode: "SYW01",
    employeeNo: "EMP033",
    title: "Mrs",
    firstName: "Menaka",
    lastName: "Wijesinghe",
    role: "Operator",
    department: "Production",
    phone: "0771000033",
    email: "menaka.w@example.com",
    dateOfBirth: "1992-02-28",
    status: "Active",
  },
  {
    companyCode: "SYW01",
    employeeNo: "EMP034",
    title: "Mr",
    firstName: "Asela",
    lastName: "Cooray",
    role: "Supervisor",
    department: "Production",
    phone: "0771000034",
    email: "asela.cooray@example.com",
    dateOfBirth: "1986-08-07",
    status: "Active",
  },
  {
    companyCode: "SYW01",
    employeeNo: "EMP035",
    title: "Ms",
    firstName: "Oshadi",
    lastName: "Liyanage",
    role: "Operator",
    department: "Production",
    phone: "0771000035",
    email: "oshadi.l@example.com",
    dateOfBirth: "1995-01-15",
    status: "Active",
  },
  {
    companyCode: "SYW01",
    employeeNo: "EMP036",
    title: "Mr",
    firstName: "Chamika",
    lastName: "Silva",
    role: "Operator",
    department: "Production",
    phone: "0771000036",
    email: "chamika.silva@example.com",
    dateOfBirth: "1993-05-23",
    status: "Active",
  },
  {
    companyCode: "SYW01",
    employeeNo: "EMP037",
    title: "Ms",
    firstName: "Ridmi",
    lastName: "Fonseka",
    role: "Quality Inspector",
    department: "Quality",
    phone: "0771000037",
    email: "ridmi.f@example.com",
    dateOfBirth: "1994-09-06",
    status: "Active",
  },
  {
    companyCode: "SYW01",
    employeeNo: "EMP038",
    title: "Mr",
    firstName: "Thusitha",
    lastName: "Perera",
    role: "Operator",
    department: "Production",
    phone: "0771000038",
    email: "thusitha.p@example.com",
    dateOfBirth: "1988-12-12",
    status: "Active",
  },
  {
    companyCode: "SYW01",
    employeeNo: "EMP039",
    title: "Miss",
    firstName: "Ayomi",
    lastName: "Rathnayaka",
    role: "Operator",
    department: "Production",
    phone: "0771000039",
    email: "ayomi.r@example.com",
    dateOfBirth: "1996-07-29",
    status: "Active",
  },
];

function ensureByCode<T extends { id: string; code: string }>(
  items: T[],
  code: string,
  create: () => T,
) {
  return items.find((item) => item.code === code) || create();
}

function employeeByNo(employeeNo: string) {
  return employeeStore.getAll().find((item) => item.employeeNo === employeeNo);
}

function companyByCode(code: string) {
  return companyStore.getAll().find((item) => item.code === code);
}

function ensureSection(
  companyId: string,
  code: string,
  name: string,
  description: string,
) {
  const exists = sectionStore
    .getAll()
    .some((item) => item.companyId === companyId && item.code === code);
  if (!exists) {
    sectionStore.add({ companyId, code, name, description });
  }
  return (
    sectionStore
      .getAll()
      .find((item) => item.companyId === companyId && item.code === code)?.id ||
    ""
  );
}

function ensureDemoLinesAndOrders() {
  const ssf = companyByCode("SSF01");
  const skn = companyByCode("SKN01");
  const syw = companyByCode("SYW01");
  if (!ssf || !skn || !syw) return;

  const ssfSew = ensureSection(ssf.id, "SEW", "Sewing", "Garment sewing lines");
  const ssfCut = ensureSection(
    ssf.id,
    "CUT",
    "Cutting",
    "Fabric spreading and cutting",
  );
  const ssfFin = ensureSection(
    ssf.id,
    "FIN",
    "Finishing",
    "Ironing, QC and packing prep",
  );
  const ssfPkg = ensureSection(
    ssf.id,
    "PKG",
    "Packing",
    "Final packing and carton",
  );
  const sknSew = ensureSection(skn.id, "SEW", "Sewing", "Knit sewing lines");
  const sknCut = ensureSection(skn.id, "CUT", "Cutting", "Knit fabric cutting");
  const sknFin = ensureSection(skn.id, "FIN", "Finishing", "Knit finishing");
  const sknPkg = ensureSection(skn.id, "PKG", "Packing", "Knit packing");
  const sywSew = ensureSection(syw.id, "SEW", "Sewing", "Woven sewing lines");
  const sywCut = ensureSection(syw.id, "CUT", "Cutting", "Woven cutting");
  const sywFin = ensureSection(syw.id, "FIN", "Finishing", "Woven finishing");
  const sywPkg = ensureSection(syw.id, "PKG", "Packing", "Woven packing");

  const ids = (...employeeNos: string[]) =>
    employeeNos
      .map((employeeNo) => employeeByNo(employeeNo)?.id)
      .filter((id): id is string => Boolean(id));

  const lineDefs: Array<Omit<ProductionLine, "id" | "createdAt">> = [
    {
      companyId: ssf.id,
      sectionId: ssfSew,
      name: "Sewing Line A",
      code: "PLA",
      style: "ST-110 Organic Tee",
      targetOutput: "1200",
      employeeCount: "8",
      employeeIds: ids(
        "EMP001",
        "EMP002",
        "EMP003",
        "EMP005",
        "EMP008",
        "EMP011",
        "EMP014",
        "EMP017",
      ),
      shift: "Day",
    },
    {
      companyId: ssf.id,
      sectionId: ssfSew,
      name: "Sewing Line B",
      code: "PLB",
      style: "ST-220 Classic Polo",
      targetOutput: "900",
      employeeCount: "6",
      employeeIds: ids(
        "EMP012",
        "EMP015",
        "EMP016",
        "EMP018",
        "EMP020",
        "EMP010",
      ),
      shift: "Day",
    },
    {
      companyId: ssf.id,
      sectionId: ssfFin,
      name: "Finishing Line C",
      code: "PLC",
      style: "ST-110 Organic Tee",
      targetOutput: "1500",
      employeeCount: "3",
      employeeIds: ids("EMP021", "EMP022", "EMP023"),
      shift: "General",
    },
    {
      companyId: ssf.id,
      sectionId: ssfSew,
      name: "Sewing Line D",
      code: "PLD",
      style: "ST-250 Active Leggings",
      targetOutput: "1100",
      employeeCount: "6",
      employeeIds: ids("EMP006", "EMP007", "EMP009"),
      shift: "Day",
    },
    {
      companyId: ssf.id,
      sectionId: ssfSew,
      name: "Sewing Line E",
      code: "PLE",
      style: "ST-280 Jersey Polo",
      targetOutput: "1000",
      employeeCount: "6",
      employeeIds: ids("EMP013", "EMP019"),
      shift: "Day",
    },
    {
      companyId: ssf.id,
      sectionId: ssfCut,
      name: "Cutting Line F",
      code: "PLF",
      style: "Multi-style cutting",
      targetOutput: "1800",
      employeeCount: "4",
      employeeIds: ids("EMP004"),
      shift: "Day",
    },
    {
      companyId: ssf.id,
      sectionId: ssfPkg,
      name: "Packing Line G",
      code: "PLG",
      style: "Carton and polybag",
      targetOutput: "2000",
      employeeCount: "4",
      employeeIds: [],
      shift: "General",
    },
    {
      companyId: ssf.id,
      sectionId: ssfSew,
      name: "Night Sewing Line H",
      code: "PLH",
      style: "ST-115 Basic Tee",
      targetOutput: "850",
      employeeCount: "5",
      employeeIds: [],
      shift: "Night",
    },
    {
      companyId: ssf.id,
      sectionId: ssfSew,
      name: "Sewing Line I",
      code: "PLI",
      style: "ST-290 Crew Sweatshirt",
      targetOutput: "950",
      employeeCount: "6",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: ssf.id,
      sectionId: ssfFin,
      name: "Finishing Line J",
      code: "PLJ",
      style: "ST-132 Rib Tank",
      targetOutput: "1300",
      employeeCount: "4",
      employeeIds: [],
      shift: "General",
    },
    {
      companyId: skn.id,
      sectionId: sknSew,
      name: "Knit Line 1",
      code: "K1",
      style: "ST-330 Training Hoodie",
      targetOutput: "700",
      employeeCount: "5",
      employeeIds: ids("EMP024", "EMP025", "EMP026", "EMP027", "EMP028"),
      shift: "Day",
    },
    {
      companyId: skn.id,
      sectionId: sknSew,
      name: "Knit Line 2",
      code: "K2",
      style: "ST-410 Kids Shorts",
      targetOutput: "800",
      employeeCount: "3",
      employeeIds: ids("EMP029", "EMP030", "EMP031"),
      shift: "Night",
    },
    {
      companyId: skn.id,
      sectionId: sknSew,
      name: "Knit Line 3",
      code: "K3",
      style: "ST-340 Fleece Hoodie",
      targetOutput: "650",
      employeeCount: "5",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: skn.id,
      sectionId: sknSew,
      name: "Knit Line 4",
      code: "K4",
      style: "ST-360 Jogger Pant",
      targetOutput: "720",
      employeeCount: "5",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: skn.id,
      sectionId: sknCut,
      name: "Knit Cutting 1",
      code: "KC1",
      style: "Knit fabric cutting",
      targetOutput: "1400",
      employeeCount: "4",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: skn.id,
      sectionId: sknFin,
      name: "Knit Finishing 1",
      code: "KF1",
      style: "Knit ironing and QC",
      targetOutput: "1100",
      employeeCount: "4",
      employeeIds: [],
      shift: "General",
    },
    {
      companyId: skn.id,
      sectionId: sknPkg,
      name: "Knit Packing 1",
      code: "KP1",
      style: "Knit packing",
      targetOutput: "1600",
      employeeCount: "3",
      employeeIds: [],
      shift: "General",
    },
    {
      companyId: skn.id,
      sectionId: sknSew,
      name: "Knit Night Line",
      code: "KN1",
      style: "ST-115 Basic Tee",
      targetOutput: "780",
      employeeCount: "5",
      employeeIds: [],
      shift: "Night",
    },
    {
      companyId: skn.id,
      sectionId: sknSew,
      name: "Knit Line 5",
      code: "K5",
      style: "ST-225 Pique Polo",
      targetOutput: "740",
      employeeCount: "5",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: skn.id,
      sectionId: sknFin,
      name: "Knit Finishing 2",
      code: "KF2",
      style: "ST-630 Knit Dress",
      targetOutput: "980",
      employeeCount: "4",
      employeeIds: [],
      shift: "General",
    },
    {
      companyId: syw.id,
      sectionId: sywSew,
      name: "Woven Line 1",
      code: "W1",
      style: "ST-510 Oxford Shirt",
      targetOutput: "650",
      employeeCount: "5",
      employeeIds: ids("EMP032", "EMP033", "EMP034", "EMP035", "EMP036"),
      shift: "Day",
    },
    {
      companyId: syw.id,
      sectionId: sywSew,
      name: "Woven Line 2",
      code: "W2",
      style: "ST-620 Summer Dress",
      targetOutput: "500",
      employeeCount: "3",
      employeeIds: ids("EMP037", "EMP038", "EMP039"),
      shift: "Day",
    },
    {
      companyId: syw.id,
      sectionId: sywSew,
      name: "Woven Line 3",
      code: "W3",
      style: "ST-540 Chino Trouser",
      targetOutput: "580",
      employeeCount: "5",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: syw.id,
      sectionId: sywSew,
      name: "Woven Line 4",
      code: "W4",
      style: "ST-560 Formal Blouse",
      targetOutput: "540",
      employeeCount: "4",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: syw.id,
      sectionId: sywCut,
      name: "Woven Cutting 1",
      code: "WC1",
      style: "Woven fabric cutting",
      targetOutput: "1200",
      employeeCount: "4",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: syw.id,
      sectionId: sywFin,
      name: "Woven Finishing 1",
      code: "WF1",
      style: "Woven ironing and QC",
      targetOutput: "900",
      employeeCount: "4",
      employeeIds: [],
      shift: "General",
    },
    {
      companyId: syw.id,
      sectionId: sywPkg,
      name: "Woven Packing 1",
      code: "WP1",
      style: "Woven packing",
      targetOutput: "1300",
      employeeCount: "3",
      employeeIds: [],
      shift: "General",
    },
    {
      companyId: syw.id,
      sectionId: sywSew,
      name: "Woven Night Line",
      code: "WN1",
      style: "ST-530 Work Shirt",
      targetOutput: "520",
      employeeCount: "4",
      employeeIds: [],
      shift: "Night",
    },
    {
      companyId: syw.id,
      sectionId: sywSew,
      name: "Woven Line 5",
      code: "W5",
      style: "ST-710 Denim Jacket",
      targetOutput: "480",
      employeeCount: "5",
      employeeIds: [],
      shift: "Day",
    },
    {
      companyId: syw.id,
      sectionId: sywSew,
      name: "Woven Line 6",
      code: "W6",
      style: "ST-430 Cargo Shorts",
      targetOutput: "560",
      employeeCount: "4",
      employeeIds: [],
      shift: "Day",
    },
  ];

  lineDefs.forEach((line) => {
    const exists = productionLineStore
      .getAll()
      .some((item) => item.code === line.code);
    if (!exists) productionLineStore.add(line);
  });

  const orderDefs: Array<Omit<OrderBook, "id" | "createdAt">> = [
    {
      companyId: ssf.id,
      orderNo: "PO-26001",
      styleNo: "ST-110",
      styleName: "Organic Tee",
      buyer: "H&M",
      season: "SS26",
      garmentType: "T-Shirt",
      fabricType: "Cotton Jersey",
      color: "White",
      sizeRange: "XS-XXL",
      ...sizeQty(400, 1200, 1800, 1600, 800, 200),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26001"],
      deliveryDate: "2026-09-18",
      merchandiser: "Malsha Ekanayake",
      status: "Confirmed",
      remarks: "Organic cotton, care label in 4 languages",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26002",
      styleNo: "ST-220",
      styleName: "Classic Polo",
      buyer: "Zara",
      season: "SS26",
      garmentType: "Polo Shirt",
      fabricType: "Cotton/Polyester",
      color: "Navy",
      sizeRange: "S-XXL",
      ...sizeQty(0, 800, 1400, 1400, 700, 100),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26002"],
      deliveryDate: "2026-09-22",
      merchandiser: "Malsha Ekanayake",
      status: "In Cutting",
      remarks: "Contrast tipping on collar",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26006",
      styleNo: "ST-250",
      styleName: "Active Leggings",
      buyer: "Adidas",
      season: "SS26",
      garmentType: "Leggings",
      fabricType: "Nylon",
      color: "Graphite",
      sizeRange: "XS-XL",
      ...sizeQty(300, 900, 1200, 1000, 400, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26006"],
      deliveryDate: "2026-10-05",
      merchandiser: "Malsha Ekanayake",
      status: "Confirmed",
      remarks: "High-stretch, side pocket",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26008",
      styleNo: "ST-280",
      styleName: "Jersey Polo",
      buyer: "Decathlon",
      season: "SS26",
      garmentType: "Polo Shirt",
      fabricType: "Cotton Jersey",
      color: "Forest Green",
      sizeRange: "S-XXL",
      ...sizeQty(0, 600, 1100, 1100, 500, 150),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26008"],
      deliveryDate: "2026-10-10",
      merchandiser: "Malsha Ekanayake",
      status: "Confirmed",
      remarks: "Sports fit, moisture wicking",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26011",
      styleNo: "ST-290",
      styleName: "Crew Sweatshirt",
      buyer: "C&A",
      season: "AW26",
      garmentType: "Sweatshirt",
      fabricType: "French Terry",
      color: "Stone",
      sizeRange: "S-XXL",
      ...sizeQty(0, 500, 900, 900, 400, 100),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26011"],
      deliveryDate: "2026-10-12",
      merchandiser: "Malsha Ekanayake",
      status: "Confirmed",
      remarks: "Set-in sleeve, rib cuffs",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26012",
      styleNo: "ST-118",
      styleName: "Kids Tee",
      buyer: "GAP",
      season: "SS26",
      garmentType: "T-Shirt",
      fabricType: "Cotton Jersey",
      color: "Sunshine Yellow",
      sizeRange: "2-12",
      ...sizeQty(250, 700, 800, 600, 250, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26012"],
      deliveryDate: "2026-10-08",
      merchandiser: "Malsha Ekanayake",
      status: "In Cutting",
      remarks: "Nickel-free snaps, soft handfeel",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26013",
      styleNo: "ST-132",
      styleName: "Rib Tank",
      buyer: "H&M",
      season: "SS26",
      garmentType: "Activewear",
      fabricType: "Rib",
      color: "Ivory",
      sizeRange: "XS-XL",
      ...sizeQty(350, 800, 1000, 800, 300, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26013"],
      deliveryDate: "2026-10-18",
      merchandiser: "Malsha Ekanayake",
      status: "Confirmed",
      remarks: "Narrow strap, bonded hem",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26014",
      styleNo: "ST-335",
      styleName: "Zip Hoodie",
      buyer: "Adidas",
      season: "AW26",
      garmentType: "Hoodie",
      fabricType: "Fleece",
      color: "Core Black",
      sizeRange: "S-XXL",
      ...sizeQty(0, 450, 900, 950, 500, 150),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26014"],
      deliveryDate: "2026-10-15",
      merchandiser: "Malsha Ekanayake",
      status: "In Sewing",
      remarks: "YKK zipper, thumbholes",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26015",
      styleNo: "ST-412",
      styleName: "Jersey Shorts",
      buyer: "Decathlon",
      season: "SS26",
      garmentType: "Shorts",
      fabricType: "Cotton Jersey",
      color: "Navy",
      sizeRange: "S-XXL",
      ...sizeQty(0, 600, 1000, 900, 400, 80),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26015"],
      deliveryDate: "2026-10-22",
      merchandiser: "Malsha Ekanayake",
      status: "Confirmed",
      remarks: "Elastic waist, inner drawcord",
    },
    {
      companyId: ssf.id,
      orderNo: "PO-26016",
      styleNo: "ST-470",
      styleName: "Nightwear Set",
      buyer: "Tesco F&F",
      season: "AW26",
      garmentType: "Underwear",
      fabricType: "Interlock",
      color: "Dusty Rose",
      sizeRange: "S-XL",
      ...sizeQty(0, 400, 700, 650, 250, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26016"],
      deliveryDate: "2026-10-28",
      merchandiser: "Malsha Ekanayake",
      status: "On Hold",
      remarks: "Waiting for print strike-off",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26003",
      styleNo: "ST-330",
      styleName: "Training Hoodie",
      buyer: "Nike",
      season: "AW26",
      garmentType: "Hoodie",
      fabricType: "Fleece",
      color: "Black",
      sizeRange: "S-XXL",
      ...sizeQty(0, 500, 1100, 1200, 600, 200),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26003"],
      deliveryDate: "2026-09-25",
      merchandiser: "Chathura Bandara",
      status: "In Sewing",
      remarks: "Reflective print on back",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26004",
      styleNo: "ST-410",
      styleName: "Kids Shorts",
      buyer: "Uniqlo",
      season: "SS26",
      garmentType: "Shorts",
      fabricType: "Cotton Jersey",
      color: "Sky Blue",
      sizeRange: "2-12",
      ...sizeQty(200, 700, 900, 700, 300, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26004"],
      deliveryDate: "2026-09-12",
      merchandiser: "Gayan Fernando",
      status: "In Finishing",
      remarks: "Child safety drawcord spec",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26009",
      styleNo: "ST-115",
      styleName: "Basic Tee",
      buyer: "Tesco F&F",
      season: "Core / Basic",
      garmentType: "T-Shirt",
      fabricType: "Cotton Jersey",
      color: "Heather Grey",
      sizeRange: "S-XL",
      ...sizeQty(0, 1000, 1600, 1400, 600, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26009"],
      deliveryDate: "2026-09-15",
      merchandiser: "Gayan Fernando",
      status: "In Sewing",
      remarks: "Repeat core programme",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26010",
      styleNo: "ST-340",
      styleName: "Fleece Hoodie",
      buyer: "Primark",
      season: "AW26",
      garmentType: "Hoodie",
      fabricType: "Fleece",
      color: "Burgundy",
      sizeRange: "S-XXL",
      ...sizeQty(0, 700, 1300, 1300, 700, 200),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26010"],
      deliveryDate: "2026-10-20",
      merchandiser: "Gayan Fernando",
      status: "Confirmed",
      remarks: "Kangaroo pocket, matching drawcord",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26017",
      styleNo: "ST-360",
      styleName: "Jogger Pant",
      buyer: "Nike",
      season: "AW26",
      garmentType: "Trousers",
      fabricType: "French Terry",
      color: "Charcoal",
      sizeRange: "S-XXL",
      ...sizeQty(0, 450, 900, 950, 500, 120),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26017"],
      deliveryDate: "2026-10-14",
      merchandiser: "Gayan Fernando",
      status: "Confirmed",
      remarks: "Cuffed hem, side pockets",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26018",
      styleNo: "ST-225",
      styleName: "Pique Polo",
      buyer: "Uniqlo",
      season: "SS26",
      garmentType: "Polo Shirt",
      fabricType: "Cotton/Polyester",
      color: "White",
      sizeRange: "S-XXL",
      ...sizeQty(0, 700, 1200, 1100, 500, 100),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26018"],
      deliveryDate: "2026-10-11",
      merchandiser: "Gayan Fernando",
      status: "In Cutting",
      remarks: "Mother of pearl buttons",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26019",
      styleNo: "ST-418",
      styleName: "Sweat Shorts",
      buyer: "Primark",
      season: "SS26",
      garmentType: "Shorts",
      fabricType: "Fleece",
      color: "Olive",
      sizeRange: "S-XL",
      ...sizeQty(0, 550, 850, 800, 300, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26019"],
      deliveryDate: "2026-10-19",
      merchandiser: "Chathura Bandara",
      status: "Confirmed",
      remarks: "Brushed back, contrast drawcord",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26020",
      styleNo: "ST-142",
      styleName: "Long Sleeve Tee",
      buyer: "Zara",
      season: "AW26",
      garmentType: "T-Shirt",
      fabricType: "Cotton Jersey",
      color: "Espresso",
      sizeRange: "XS-XXL",
      ...sizeQty(200, 700, 1100, 1000, 450, 80),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26020"],
      deliveryDate: "2026-10-07",
      merchandiser: "Gayan Fernando",
      status: "In Finishing",
      remarks: "Dropped shoulder, garment wash",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26021",
      styleNo: "ST-630",
      styleName: "Knit Dress",
      buyer: "Next PLC",
      season: "AW26",
      garmentType: "Dress",
      fabricType: "Viscose",
      color: "Wine",
      sizeRange: "XS-XL",
      ...sizeQty(180, 520, 680, 520, 180, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26021"],
      deliveryDate: "2026-10-25",
      merchandiser: "Chathura Bandara",
      status: "Confirmed",
      remarks: "A-line, covered zip",
    },
    {
      companyId: skn.id,
      orderNo: "PO-26022",
      styleNo: "ST-150",
      styleName: "Baby Romper",
      buyer: "H&M",
      season: "SS26",
      garmentType: "Activewear",
      fabricType: "Interlock",
      color: "Mint",
      sizeRange: "2-12",
      ...sizeQty(300, 600, 500, 300, 100, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26022"],
      deliveryDate: "2026-11-02",
      merchandiser: "Gayan Fernando",
      status: "Confirmed",
      remarks: "Envelope neck, nickel-free snaps",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26005",
      styleNo: "ST-510",
      styleName: "Oxford Shirt",
      buyer: "Marks & Spencer",
      season: "AW26",
      garmentType: "Shirt",
      fabricType: "Cotton Poplin",
      color: "Light Blue",
      sizeRange: "S-XXL",
      ...sizeQty(0, 400, 900, 900, 400, 100),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26005"],
      deliveryDate: "2026-09-28",
      merchandiser: "Asela Cooray",
      status: "Packed",
      remarks: "Pearl buttons, extra spare button",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26007",
      styleNo: "ST-620",
      styleName: "Summer Dress",
      buyer: "Next PLC",
      season: "SS26",
      garmentType: "Dress",
      fabricType: "Viscose",
      color: "Coral Floral",
      sizeRange: "XS-XL",
      ...sizeQty(150, 500, 700, 550, 200, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26007"],
      deliveryDate: "2026-09-30",
      merchandiser: "Asela Cooray",
      status: "On Hold",
      remarks: "Waiting for trims approval",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26023",
      styleNo: "ST-540",
      styleName: "Chino Trouser",
      buyer: "Marks & Spencer",
      season: "SS26",
      garmentType: "Trousers",
      fabricType: "Cotton Twill",
      color: "Khaki",
      sizeRange: "28-38",
      ...sizeQty(0, 300, 700, 700, 350, 80),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26023"],
      deliveryDate: "2026-10-16",
      merchandiser: "Asela Cooray",
      status: "Confirmed",
      remarks: "Flat front, garment wash",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26024",
      styleNo: "ST-710",
      styleName: "Denim Jacket",
      buyer: "Levi's",
      season: "AW26",
      garmentType: "Jacket",
      fabricType: "Denim",
      color: "Indigo",
      sizeRange: "S-XXL",
      ...sizeQty(0, 250, 500, 500, 250, 80),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26024"],
      deliveryDate: "2026-10-21",
      merchandiser: "Asela Cooray",
      status: "In Cutting",
      remarks: "Vintage wash, metal buttons",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26025",
      styleNo: "ST-560",
      styleName: "Formal Blouse",
      buyer: "Zara",
      season: "AW26",
      garmentType: "Blouse",
      fabricType: "Cotton Poplin",
      color: "Ivory",
      sizeRange: "XS-XL",
      ...sizeQty(200, 500, 650, 500, 180, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26025"],
      deliveryDate: "2026-10-13",
      merchandiser: "Asela Cooray",
      status: "Confirmed",
      remarks: "Hidden placket, dart shaping",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26026",
      styleNo: "ST-430",
      styleName: "Cargo Shorts",
      buyer: "C&A",
      season: "SS26",
      garmentType: "Shorts",
      fabricType: "Cotton Twill",
      color: "Sand",
      sizeRange: "28-38",
      ...sizeQty(0, 280, 600, 580, 260, 60),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26026"],
      deliveryDate: "2026-10-17",
      merchandiser: "Asela Cooray",
      status: "In Sewing",
      remarks: "Utility pockets, matte snap",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26027",
      styleNo: "ST-530",
      styleName: "Work Shirt",
      buyer: "Walmart",
      season: "Core / Basic",
      garmentType: "Shirt",
      fabricType: "Cotton/Polyester",
      color: "Light Grey",
      sizeRange: "S-XXL",
      ...sizeQty(0, 500, 900, 900, 400, 120),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26027"],
      deliveryDate: "2026-10-24",
      merchandiser: "Asela Cooray",
      status: "Confirmed",
      remarks: "Easy-care finish, spare button",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26028",
      styleNo: "ST-640",
      styleName: "Panel Skirt",
      buyer: "Next PLC",
      season: "AW26",
      garmentType: "Skirt",
      fabricType: "Viscose",
      color: "Forest",
      sizeRange: "XS-XL",
      ...sizeQty(160, 420, 560, 420, 160, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26028"],
      deliveryDate: "2026-10-27",
      merchandiser: "Asela Cooray",
      status: "Confirmed",
      remarks: "Side zip, lined yoke",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26029",
      styleNo: "ST-720",
      styleName: "Twill Overshirt",
      buyer: "Tommy Hilfiger",
      season: "AW26",
      garmentType: "Jacket",
      fabricType: "Cotton Twill",
      color: "Navy",
      sizeRange: "S-XXL",
      ...sizeQty(0, 220, 480, 480, 220, 60),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26029"],
      deliveryDate: "2026-10-09",
      merchandiser: "Asela Cooray",
      status: "Packed",
      remarks: "Brushed twill, branded buttons",
    },
    {
      companyId: syw.id,
      orderNo: "PO-26030",
      styleNo: "ST-480",
      styleName: "Woven Pyjama",
      buyer: "Lidl",
      season: "Holiday",
      garmentType: "Underwear",
      fabricType: "Cotton Poplin",
      color: "Stripe Blue",
      sizeRange: "S-XL",
      ...sizeQty(0, 350, 600, 550, 220, 0),
      orderDate: DUMMY_ORDER_TREND_DATES["PO-26030"],
      deliveryDate: "2026-11-04",
      merchandiser: "Asela Cooray",
      status: "Confirmed",
      remarks: "Piping contrast, drawcord waist",
    },
  ];

  orderDefs.forEach((order) => {
    const exists = orderBookStore
      .getAll()
      .some((item) => item.orderNo === order.orderNo);
    if (!exists) orderBookStore.add(order);
  });
}

function sizeQty(
  qtyXS: number,
  qtyS: number,
  qtyM: number,
  qtyL: number,
  qtyXL: number,
  qtyXXL: number,
) {
  const orderQty = qtyXS + qtyS + qtyM + qtyL + qtyXL + qtyXXL;
  return {
    qtyXS: String(qtyXS),
    qtyS: String(qtyS),
    qtyM: String(qtyM),
    qtyL: String(qtyL),
    qtyXL: String(qtyXL),
    qtyXXL: String(qtyXXL),
    orderQty: String(orderQty),
  };
}

/**
 * Seeds groups, companies, sections, employees, production lines, and orders.
 * Safe to run on existing browsers: records are created only when missing.
 */
export function seedDummyProjectData() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(DUMMY_PROJECT_SEED_KEY)) {
    ensureDemoLinesAndOrders();
    patchDummyOrderTrendDates();
    return;
  }

  const apparelGroup = ensureByCode(groupStore.getAll(), "SAG01", () =>
    groupStore.add({
      name: "Saptha Apparel Group",
      code: "SAG01",
      description: "Main apparel manufacturing group",
    }),
  );
  const holdingsGroup = ensureByCode(groupStore.getAll(), "SYH01", () =>
    groupStore.add({
      name: "Syntara Holdings",
      code: "SYH01",
      description: "Woven and woven-blend manufacturing group",
    }),
  );

  const ssf = ensureByCode(companyStore.getAll(), "SSF01", () =>
    companyStore.add({
      groupId: apparelGroup.id,
      name: "Saptha Syntara Factory",
      code: "SSF01",
      location: "Colombo",
      contactPerson: "Chathura Bandara",
      phone: "0112345001",
      email: "ssf@sapthasyntara.com",
    }),
  );
  if (ssf.groupId !== apparelGroup.id) {
    companyStore.update(ssf.id, { groupId: apparelGroup.id });
  }
  const skn = ensureByCode(companyStore.getAll(), "SKN01", () =>
    companyStore.add({
      groupId: apparelGroup.id,
      name: "Saptha Knitwear",
      code: "SKN01",
      location: "Katunayake",
      contactPerson: "Gayan Fernando",
      phone: "0112345002",
      email: "skn@sapthasyntara.com",
    }),
  );
  const syw = ensureByCode(companyStore.getAll(), "SYW01", () =>
    companyStore.add({
      groupId: holdingsGroup.id,
      name: "Syntara Wovens",
      code: "SYW01",
      location: "Horana",
      contactPerson: "Asela Cooray",
      phone: "0112345003",
      email: "syw@sapthasyntara.com",
    }),
  );

  const companyByCode: Record<string, string> = {
    SSF01: ssf.id,
    SKN01: skn.id,
    SYW01: syw.id,
  };

  const sectionDefs = [
    { companyId: ssf.id, code: "CUT", name: "Cutting", description: "Fabric spreading and cutting" },
    { companyId: ssf.id, code: "SEW", name: "Sewing", description: "Garment sewing lines" },
    { companyId: ssf.id, code: "FIN", name: "Finishing", description: "Ironing, QC and packing prep" },
    { companyId: ssf.id, code: "PKG", name: "Packing", description: "Final packing and carton" },
    { companyId: skn.id, code: "CUT", name: "Cutting", description: "Knit fabric cutting" },
    { companyId: skn.id, code: "SEW", name: "Sewing", description: "Knit sewing lines" },
    { companyId: skn.id, code: "FIN", name: "Finishing", description: "Knit finishing" },
    { companyId: skn.id, code: "PKG", name: "Packing", description: "Knit packing" },
    { companyId: syw.id, code: "CUT", name: "Cutting", description: "Woven cutting" },
    { companyId: syw.id, code: "SEW", name: "Sewing", description: "Woven sewing lines" },
    { companyId: syw.id, code: "FIN", name: "Finishing", description: "Woven finishing" },
    { companyId: syw.id, code: "PKG", name: "Packing", description: "Woven packing" },
  ];

  sectionDefs.forEach((section) => {
    const exists = sectionStore
      .getAll()
      .some((item) => item.companyId === section.companyId && item.code === section.code);
    if (!exists) sectionStore.add(section);
  });

  DUMMY_EMPLOYEE_DATA.forEach((employee) => {
    if (!employeeByNo(employee.employeeNo)) {
      employeeStore.add({ ...employee, companyId: ssf.id });
    }
  });
  EXTRA_EMPLOYEE_DATA.forEach((employee) => {
    if (!employeeByNo(employee.employeeNo)) {
      employeeStore.add({
        ...employee,
        companyId: companyByCode[employee.companyCode] || ssf.id,
      });
    }
  });

  ensureDemoLinesAndOrders();
  patchDummyOrderTrendDates();

  window.localStorage.setItem(DUMMY_PROJECT_SEED_KEY, "1");
  window.localStorage.setItem(DUMMY_EMPLOYEES_SEED_KEY, "1");
}

/** Seeds 20 demo employees once (creates a demo company if none exist). */
export function seedDummyEmployees() {
  seedDummyProjectData();
}
