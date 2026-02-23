export interface SchedulesParams {
  search_date: string;
  b_idx: string;
  mp_idx?: string[];
  ss_idx?: string[];
}
export interface TimeSlot {
  time: string;
}
export interface ScheduleDateScheme {
  dates: string;
}
export interface ScheduleTimeScheme {
  times: string;
}
