// 교환글 상태 규칙 모음 (카드·상세 공통)
// - 교환 상태(예약 중/교환 완료)가 있으면 교환 상태 태그만 보여준다
// - 교환 상태가 없으면 위치 기반 태그(Live/방금 전/New)를 보여준다
// TODO(API): locationStatus는 서버가 계산한 값을 그대로 쓴다 (docs/notes/location-status.md)

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
    image: post.image,
    title: post.title,
    want: post.want,
    likes: post.likes,
    comments: post.comments,
    badgeType: badge.type,
    status: badge.status,
    isDimmed: isTradeClosed(post),
  };
};

// 교환 보드 탭 구분: 현장 교환(live, 방금 전) / 일반 교환(new)
export const isOnSiteExchange = (post) =>
  post.locationStatus === "live" || post.locationStatus === "justLeft";
