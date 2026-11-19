import client, { toImageUrl } from "./client";
import { formatDate, formatPeriod } from "../utils/date";

// 교환 도메인 API (명세: docs/api/api-spec.md "교환게시글 posts", "찜 likes", "채팅 chats")
// 응답은 화면 컴포넌트가 쓰는 모양으로 바꿔서 돌려준다 (UI는 더미 데이터 시절 필드명 그대로 사용)

// 목록은 페이지 없이 한 번에 넉넉히 받음
// TODO: 무한 스크롤 붙일 때 page 처리 추가 (응답에 마지막 페이지 판단 값 없음)
const PAGE_SIZE = 50;

// 장소·시간을 비워서 쓴 글에 보여줄 문구
const EMPTY_MEETING_TEXT = "채팅으로 협의해요 :)";

// 서버 교환 상태(status) → 화면 tradeStatus (exchangeUtils 태그 규칙이 쓰는 값)
const TRADE_STATUS_MAP = {
  OPEN: null,
  RESERVED: "reserved",
  COMPLETED: "completed",
};

// 서버 tag → 화면 locationStatus (교환 완료 등 교환 상태는 status로 판단)
// TODO(API): 백엔드 수정 후 반영 예정 - tag 전체 값 명세 받으면 보완 (교환 API 요청 3번)
const LOCATION_STATUS_MAP = {
  LIVE: "live",
  JUST_NOW: "justLeft",
  NEW: "new",
};

// 내 현장 팝업 카드용 팝업 상태 (인증 목록은 status가 아니라 popupStatus)
const POPUP_STATUS_MAP = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  ENDED: "completed",
};

// ===== 응답 변환 =====

// 작성자 정보 (상세 응답에만 있음)
const toAuthor = (writer) =>
  writer
    ? {
        nickname: writer.username,
        profileImage: toImageUrl(writer.profileImageUrl),
        rating: writer.mannerScore,
      }
    : null;

// 교환글 → 화면 필드 (목록 카드·상세·찜한 아이템 공통)
export const toExchangePost = (post) => ({
  id: post.postId,
  popupId: post.popupId,
  title: post.haveItemName,
  want: post.wantItemName,
  images: (post.images ?? []).map(toImageUrl),
  tradeStatus: TRADE_STATUS_MAP[post.status] ?? null,
  locationStatus: LOCATION_STATUS_MAP[post.tag] ?? "new",
  likes: post.likeCount ?? 0,
  comments: post.chatCount ?? 0,
  isLiked: post.isLiked ?? false,
  date: formatDate(post.createdAt),
  place: post.preferredLocation || EMPTY_MEETING_TEXT,
  time: post.preferredTime || EMPTY_MEETING_TEXT,
  description: post.description ?? "",
  author: toAuthor(post.writer),
});

// 위치 인증 목록 항목 → PopupCard props
const toVerifiedPopupCard = (popup) => ({
  id: popup.popupId,
  title: popup.name,
  image: toImageUrl(popup.thumbnailUrl),
  status: POPUP_STATUS_MAP[popup.popupStatus],
  location: popup.district,
  period: formatPeriod(popup.startDate, popup.endDate),
  likes: popup.likeCount,
});

// 선택 입력값: 비어 있으면 null로 보냄
const toOptionalText = (text) => text?.trim() || null;

// ===== 요청 함수 =====

// 교환글 목록 (전체 교환·교환 보드, 로그인 없이 조회 가능)
// - tab: "ONSITE"(현장 교환, popupId 필수) / "GENERAL"(일반 교환) / 생략(전체)
export const getPosts = async ({ tab, popupId, keyword } = {}) => {
  const data = await client.get("/api/posts", {
    params: {
      tab,
      popupId,
      keyword: keyword?.trim() || undefined,
      size: PAGE_SIZE,
    },
  });
  return data.content.map(toExchangePost);
};

// 교환글 상세 (로그인 없이 조회 가능, 로그인하면 isLiked 포함 / 없는 글 404)
export const getPostDetail = async (postId) => {
  const data = await client.get(`/api/posts/${postId}`);
  return toExchangePost(data);
};

// 찜하기 / 찜 취소 (로그인 필요)
// 찜하기 중복(409)은 이미 찜한 상태라 성공으로 처리
export const likePost = async (postId) => {
  try {
    await client.post(`/api/posts/${postId}/likes`);
  } catch (error) {
    if (error.status !== 409) throw error;
  }
  return { isLiked: true };
};

export const unlikePost = async (postId) => {
  await client.delete(`/api/posts/${postId}/likes`);
  return { isLiked: false };
};

// 채팅방 생성 → 채팅방 id (이미 있으면 기존 방, 본인 글이면 400)
export const createChatRoom = async (postId) => {
  const data = await client.post("/api/chat-rooms", { postId });
  return data.roomId;
};

// 사진 업로드 → 서버 이미지 경로 배열 (배열 순서 = 사진 순서)
export const uploadPostImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const data = await client.post("/api/posts/images", formData);
  return data.imageUrls;
};

// 교환글 작성 → 새 글 id
export const createPost = async ({
  popupId,
  categoryId,
  haveItemName,
  wantItemName,
  preferredLocation,
  preferredTime,
  description,
  imageUrls,
}) => {
  const data = await client.post("/api/posts", {
    popupId,
    categoryId,
    haveItemName: haveItemName.trim(),
    wantItemName: wantItemName.trim(),
    preferredLocation: toOptionalText(preferredLocation),
    preferredTime: toOptionalText(preferredTime),
    description: toOptionalText(description),
    imageUrls,
  });
  return data.postId;
};

// 내 현장 팝업 (현재 유효한 위치 인증 팝업 목록)
// TODO(위치 인증): 담당 팀원 코드로 교체 (인증 여부·내 현장 팝업 목록)
// 인증 여부는 임시로 verifiedCount > 0 기준
export const getMyVerifiedPopups = async () => {
  const data = await client.get("/api/me/popup-verifications");
  return {
    isVerified: data.verifiedCount > 0,
    popups: data.content
      .filter((popup) => popup.isVerified)
      .map(toVerifiedPopupCard),
  };
};
