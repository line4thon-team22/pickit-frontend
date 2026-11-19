import client, { toImageUrl } from "./client";
import { formatPeriod } from "../utils/date";

// 팝업 도메인 API (명세: docs/api/api-spec.md "팝업 popups")
// 응답은 화면 컴포넌트가 쓰는 모양으로 바꿔서 돌려준다 (UI는 더미 데이터 시절 필드명 그대로 사용)

// 서버 상태 → 화면 상태 (StatusBadge type="popup"이 쓰는 값)
const STATUS_MAP = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  ENDED: "completed",
};

// ===== 응답 변환 =====

// 목록 카드용 (PopupPosterCard, PopupCard)
const toPopupCard = (popup) => ({
  id: popup.popupId,
  title: popup.name,
  image: toImageUrl(popup.thumbnailUrl),
  status: STATUS_MAP[popup.status],
  location: popup.district,
  period: formatPeriod(popup.startDate, popup.endDate),
  isLiked: popup.isLiked,
  likes: popup.likeCount,
});

// 상세 화면용 (목록 카드 필드 + 주소·설명·카테고리)
// 상세 응답에는 isLiked·likeCount가 없음
const toPopupDetail = (popup) => ({
  id: popup.popupId,
  title: popup.name,
  image: toImageUrl(popup.thumbnailUrl),
  status: STATUS_MAP[popup.status],
  location: popup.district,
  period: formatPeriod(popup.startDate, popup.endDate),
  address: popup.address,
  description: popup.description,
  categoryId: popup.categoryId,
  categoryName: popup.categoryName,
});

// 필터 바텀시트 선택지
// - 진행 상태: 피그마 순서(진행 전 → 진행 중 → 진행 완료)로 정렬 (서버는 진행 중이 먼저)
// - 지역 scope: 지역 칩 선택 규칙용 (popupFilterUtils.js 참고). 서버가 주지 않아서 프론트에서 붙임
//   all(전국) / seoul(서울 세부 지역) / other(서울 전체, 서울 외 지역)
const STATUS_ORDER = ["UPCOMING", "ONGOING", "ENDED"];

const SEOUL_DETAIL_REGIONS = [
  "GANGNAM_SEOCHO",
  "HONGDAE_SINCHON",
  "JONGNO_GWANGHWAMUN",
  "SEONGSU",
  "YONGSAN",
  "YEOUIDO",
  "JAMSIL",
];

const getRegionScope = (value) => {
  if (value === "NATIONWIDE") return "all";
  if (SEOUL_DETAIL_REGIONS.includes(value)) return "seoul";
  return "other";
};

const toFilterGroups = ({ statuses = [], regions = [], categories = [] }) => [
  {
    key: "status",
    title: "진행 상태",
    options: [...statuses]
      .sort((a, b) => STATUS_ORDER.indexOf(a.value) - STATUS_ORDER.indexOf(b.value))
      .map(({ value, label }) => ({ value, label })),
  },
  {
    key: "region",
    title: "지역",
    options: regions.map(({ value, label }) => ({
      value,
      label,
      scope: getRegionScope(value),
    })),
  },
  {
    key: "category",
    title: "카테고리",
    options: categories.map(({ categoryId, name }) => ({
      value: categoryId,
      label: name,
    })),
  },
];

// 화면 필터 상태 → 쿼리 파라미터 (여러 개는 쉼표로, 빈 값은 생략)
const toPopupListParams = ({ keyword = "", filters = {} }) => {
  const params = {};
  const join = (values) => (values?.length ? values.join(",") : undefined);

  if (keyword.trim()) params.q = keyword.trim();
  params.statuses = join(filters.status);
  params.regions = join(filters.region);
  params.categoryIds = join(filters.category);

  return params;
};

// ===== 요청 함수 =====

// 팝업 목록 (검색·필터, 페이지 없이 전체)
// 정렬은 서버 기준: 내 찜 → 진행 상태 → 찜 수 → 시작일 최신순
export const getPopups = async ({ keyword, filters } = {}) => {
  const data = await client.get("/api/popups", {
    params: toPopupListParams({ keyword, filters }),
  });
  return data.map(toPopupCard);
};

// 필터 바텀시트 선택지
export const getPopupFilters = async () => {
  const data = await client.get("/api/popups/filters");
  return toFilterGroups(data);
};

// 팝업 상세 (없는 팝업이면 error.status 404)
export const getPopupDetail = async (popupId) => {
  const data = await client.get(`/api/popups/${popupId}`);
  return toPopupDetail(data);
};

// 찜하기 / 찜 취소 (로그인 필요, 토큰 없으면 error.status 401)
// 반환: { isLiked, likes } (서버 기준 최신 찜 여부·찜 수)
export const likePopup = async (popupId) => {
  const data = await client.put(`/api/popups/${popupId}/like`);
  return { isLiked: data.isLiked, likes: data.likeCount };
};

export const unlikePopup = async (popupId) => {
  const data = await client.delete(`/api/popups/${popupId}/like`);
  return { isLiked: data.isLiked, likes: data.likeCount };
};
