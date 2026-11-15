import styled from "styled-components";

export default function StatusBadge({
  type = "popup",
  status = "upcoming",
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
  };

  return (
    <Badge $status={status} {...props}>
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
        : "#ff99c3"};

  border: 2px solid
    ${({ $status }) =>
      $status === "completed"
        ? "#727272"
        : $status === "ongoing"
          ? "#none"
          : "#ff99c3"};
`;
