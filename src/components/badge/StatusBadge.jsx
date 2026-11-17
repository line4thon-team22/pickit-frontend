import styled, { css } from "styled-components";

// size: popup 타입에서만 사용. "large"는 팝업 상세용 큰 뱃지 (피그마 팝업 상세 257:3150)
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

const Badge = styled.span`
  width: fit-content;
  height: 24px;
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
      ? `0 0 0 2px #FF66A6 inset,
         0 -4px 4px rgba(255, 229, 240, 0.60) inset`
      : "none"};

  color: ${({ $status }) =>
    $status === "completed"
      ? "#727272"
      : $status === "ongoing"
        ? "#fafafa"
        : $status === "new"
          ? "#FF006A"
          : $status === "live"
            ? "#FF006A"
            : "transparent"};

  border: 2px solid
    ${({ $status }) =>
      $status === "completed"
        ? "#727272"
        : $status === "ongoing"
          ? "transparent"
          : $status === "new"
            ? "#FF006A"
            : $status === "live"
              ? "#FF006A"
              : "transparent"};

  /* 팝업 상태 뱃지는 아래 스타일로 덮어씀 (피그마 팝업 탭 293:7496) */
  ${({ $type }) => $type === "popup" && popupStyle}
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
