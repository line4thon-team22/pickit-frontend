import styled, { css } from "styled-components";

// size: "large"는 상세 화면용 큰 뱃지
// - popup: 팝업 상세 (피그마 257:3150)
// - reservation·exchange: 교환글 상세 (피그마 방금 전 293:12534, 교환 완료 439:21577)
export default function StatusBadge({
  type = "popup",
  status = "upcoming",
  size = "small",
  ...props
}) {
  const labels = {
    popup: {
      upcoming: "진행 전",
      ongoing: "진행 중",
      completed: "진행 완료",
    },
    reservation: {
      upcoming: "방금 전",
      ongoing: "예약 중",
      completed: "교환 완료",
    },
    exchange: {
      new: "New",
      live: "Live",
    },
  };

  return (
    <Badge $type={type} $status={status} $size={size} {...props}>
      {labels[type]?.[status] || "상태 없음"}
    </Badge>
  );
}

// 교환글 뱃지 수치: 피그마 홈 254:2721, 교환 보드 293:12409, 전체 교환 447:22088
const Badge = styled.span`
  width: fit-content;
  height: auto;
  padding: 2px 6px;
  box-sizing: border-box;
  border-radius: 10000px;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  font-family: inherit;
  font-size: 10px;
  font-weight: ${({ $status }) => ($status === "ongoing" ? 600 : 500)};
  white-space: nowrap;

  background-color: ${({ $status }) =>
    $status === "ongoing" ? "#FF006A" : "transparent"};

  box-shadow: ${({ $status }) =>
    $status === "ongoing"
      ? "0 -4px 4px rgba(255, 229, 240, 0.60) inset"
      : "none"};

  /* 예약 중: 피그마에서 투명도 80% (popup 타입 진행 중에는 적용 안 함) */
  opacity: ${({ $type, $status }) =>
    $type === "reservation" && $status === "ongoing" ? 0.8 : 1};

  /* upcoming: 방금 전 (피그마 교환 보드 293:12409) */
  color: ${({ $status }) =>
    $status === "completed"
      ? "#727272"
      : $status === "ongoing"
        ? "#fafafa"
        : $status === "new"
          ? "#FF006A"
          : $status === "live"
            ? "#FF006A"
            : $status === "upcoming"
              ? "#ff99c3"
              : "transparent"};

  border: 1.5px solid
    ${({ $status }) =>
      $status === "completed"
        ? "#727272"
        : $status === "ongoing"
          ? "#ff66a6"
          : $status === "new"
            ? "#FF006A"
            : $status === "live"
              ? "#FF006A"
              : $status === "upcoming"
                ? "#ff99c3"
                : "transparent"};

  /* 교환글 상세용 큰 뱃지 */
  ${({ $type, $size }) => $type !== "popup" && $size === "large" && largeStyle}

  /* 팝업 상태 뱃지는 아래 스타일로 덮어씀 (피그마 팝업 탭 293:7496) */
  ${({ $type }) => $type === "popup" && popupStyle}
`;

// 교환글 상세용 큰 뱃지
// 방금 전·교환 완료는 피그마 기준, 예약 중·Live·New는 작은 뱃지와 같은 색으로 크기만 키움
const largeStyle = css`
  padding: 2px 16px;
  font-size: 16px;
  font-weight: 600;

  /* 교환 완료: 팝업 '진행 완료' 큰 뱃지와 같은 회색 배경 스타일 */
  ${({ $status }) =>
    $status === "completed" &&
    css`
      padding: 3px 16px;
      border: 1px solid #e3e3e3;
      background-color: #fafafa;
    `}
`;

const popupColors = {
  upcoming: { background: "#fafafa", border: "#ff66a6", color: "#ff66a6" },
  ongoing: { background: "#ff006a", border: "#ff66a6", color: "#fafafa" },
  completed: { background: "#fafafa", border: "#e3e3e3", color: "#727272" },
};

const popupStyle = css`
  height: auto;
  padding: ${({ $size }) => ($size === "large" ? "3px 16px" : "3px 10px")};
  font-size: ${({ $size }) => ($size === "large" ? 16 : 10)}px;
  border: 1px solid ${({ $status }) => popupColors[$status]?.border};
  background-color: ${({ $status }) => popupColors[$status]?.background};
  color: ${({ $status }) => popupColors[$status]?.color};
  font-weight: 600;
  box-shadow: ${({ $status }) =>
    $status === "ongoing"
      ? "inset 0 -4px 8px rgba(255, 229, 240, 0.6)"
      : "none"};
`;
