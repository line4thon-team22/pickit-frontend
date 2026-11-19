// 날짜 표시 형식 함수 모음 (서버 날짜 "YYYY-MM-DD" → 화면 문구)

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// "2026-11-19" → Date (시간대 영향 없이 그 날짜 그대로)
const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const pad = (number) => String(number).padStart(2, "0");

// Date → "11.19(목)" / withYear면 "26.11.19(목)"
const formatDay = (date, withYear) => {
  const monthDay = `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  const weekday = `(${WEEKDAYS[date.getDay()]})`;
  if (!withYear) return `${monthDay}${weekday}`;
  return `${String(date.getFullYear()).slice(2)}.${monthDay}${weekday}`;
};

// 기간 문구: ("2026-11-19", "2026-11-21") → "26.11.19(목) - 11.21(토)"
// 끝나는 해가 다르면 뒤쪽에도 연도 표시: "26.12.20(일) - 27.01.10(일)"
export const formatPeriod = (startDate, endDate) => {
  if (!startDate) return "";

  const start = parseDate(startDate);
  if (!endDate) return formatDay(start, true);

  const end = parseDate(endDate);
  const isSameYear = start.getFullYear() === end.getFullYear();
  return `${formatDay(start, true)} - ${formatDay(end, !isSameYear)}`;
};
