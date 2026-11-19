// 날짜 표시 형식 함수 모음 (서버 날짜 "YYYY-MM-DD"·"YYYY-MM-DDTHH:mm:ss" → 화면 문구)

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

// 작성일 문구: "2026-11-19T23:51:15.565677" → "2026. 11. 19"
// 서버 시간이 한국 시간 기준이라 날짜 부분만 잘라서 씀 (시간대 변환 안 함)
export const formatDate = (dateTime) => {
  if (!dateTime) return "";

  const [year, month, day] = dateTime.slice(0, 10).split("-");
  return `${year}. ${month}. ${day}`;
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
