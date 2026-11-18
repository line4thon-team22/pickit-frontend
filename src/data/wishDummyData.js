import { popups } from "./popupDummyData";
import { exchangePosts } from "./exchangeDummyData";

// TODO(API): 찜 목록 조회 API 연동 시 교체
// 찜 데이터를 따로 만들지 않고 팝업·교환글 더미 데이터에서 isLiked인 항목을 걸러 씀
// → 팝업 상세·교환글 상세의 하트 상태와 같은 데이터를 바라봄
// 피그마 찜한 팝업(474:23011) 2개, 찜한 아이템(474:23025) New·교환 완료 구성과 맞춤

// 찜한 팝업 (팝업 데이터 그대로)
export const wishPopups = popups.filter((popup) => popup.isLiked);

// 찜한 교환글 (교환 완료된 글도 목록에 남김)
export const wishPosts = exchangePosts.filter((post) => post.isLiked);
