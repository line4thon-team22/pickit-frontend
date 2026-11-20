// 교환글 상태 규칙 모음 (카드·상세 공통)
// - 교환 상태(예약 중/교환 완료)가 있으면 교환 상태 태그만 보여준다
// - 교환 상태가 없으면 위치 기반 태그(Live/방금 전/New)를 보여준다
// tradeStatus·locationStatus는 서버 status·tag를 exchangeApi.js에서 바꾼 값 (프론트에서 다시 계산하지 않음)

// StatusBadge에 넘길 type/status
// "방금 전"은 StatusBadge에서 reservation 타입 안에 있어서 reservation/upcoming으로 넘긴다
export const getExchangeBadge = ({ tradeStatus, locationStatus }) => {
  if (tradeStatus === "reserved") {
    return { type: "reservation", status: "ongoing" };
  }
  if (tradeStatus === "completed") {
    return { type: "reservation", status: "completed" };
  }
  if (locationStatus === "justLeft") {
    return { type: "reservation", status: "upcoming" };
  }
  return { type: "exchange", status: locationStatus }; // live / new
};

// 예약 중·교환 완료 글: 사진을 어둡게 표시
export const isTradeClosed = (post) => post.tradeStatus != null;

// 교환글 데이터 → ExchangeCard props (전체 교환·교환 보드 목록 공통)
export const toExchangeCardProps = (post) => {
  const badge = getExchangeBadge(post);
  return {
    image: post.images[0], // 카드는 첫 장만 표시
    title: post.title,
    want: post.want,
    likes: post.likes,
    comments: post.comments,
    badgeType: badge.type,
    status: badge.status,
    isDimmed: isTradeClosed(post),
  };
};
