import product1 from "../assets/images/product/recommend1.png";
import product2 from "../assets/images/product/recommend2.png";
import product3 from "../assets/images/product/recommend3.png";
import product4 from "../assets/images/product/recommend4.png";
import product5 from "../assets/images/product/recommend5.png";

// TODO(API): 내 현재 위치에 있는 팝업 목록 조회 API 연동 시 교체
// popupDummyData의 팝업 id (피그마 내 현장 팝업 293:9930 순서)
export const myLocationPopupIds = [1, 3, 4, 2];

// TODO(API): 교환글 목록·상세 조회 API 연동 시 더미 데이터 교체
// - popupId: 교환글이 속한 팝업 (교환 보드 기준)
// - locationStatus: 위치 기반 상태 live / justLeft(방금 전) / new(일반 교환)
//   TODO(API): 서버가 계산해서 내려준 값을 그대로 표시 (docs/notes/location-status.md)
// - tradeStatus: 교환 상태 null(교환 가능) / reserved(예약 중) / completed(교환 완료)
// - images: 사진 URL 배열 (배열 순서 = 사진 순서, 카드·상세는 첫 장 사용)
// - date, place, time, description, author: 상세 화면용
//   TODO(API): 날짜 형식(문자열/ISO) 확인
// 제목·구함·찜·댓글 수는 피그마 교환 보드(293:12390, 669:7709), 전체 교환(447:21626), 상세(293:12527) 기준
export const exchangePosts = [
  {
    id: 1,
    popupId: 1,
    title: "아무, 세라 인형",
    want: "토마 인형",
    images: [product1, product4],
    locationStatus: "live",
    tradeStatus: "reserved",
    likes: 7,
    comments: 0,
    isLiked: false,
    date: "2026. 11. 15",
    place: "용산 아이파크몰 6층 팝퍼블 카페",
    time: "채팅으로 협의해요 :)",
    description:
      "캐캐체 팝업 [교환]\n아무, 세라 인형 교환 원해요! 토마 인형 있으신 분 연락 주세요 :)",
    author: { nickname: "피킷", profileImage: null, rating: 4.8 },
  },
  {
    id: 2,
    popupId: 1,
    title: "캐캐체 리마 캔뱃지",
    want: "토마 캔뱃지",
    images: [product2],
    locationStatus: "live",
    tradeStatus: null,
    likes: 9,
    comments: 0,
    isLiked: false,
    date: "2026. 11. 15",
    place: "용산 아이파크몰 6층 팝퍼블 카페",
    time: "오후 3시 ~ 5시",
    description:
      "캐캐체 팝업 [교환]\n리마 캔뱃지 2개 있어요. 토마 캔뱃지랑 교환해요!",
    author: { nickname: "치이카와", profileImage: null, rating: 4.2 },
  },
  {
    id: 3,
    popupId: 1,
    title: "케이, 토마 캔뱃지",
    want: "히나모리 아무 캔뱃지",
    images: [product3, product1, product2],
    locationStatus: "justLeft",
    tradeStatus: null,
    likes: 10,
    comments: 0,
    isLiked: false,
    date: "2026. 11. 15",
    place: "용산 아이파크몰 6층 팝퍼블 카페",
    time: "채팅으로 협의해요 :)",
    description:
      "캐캐체 팝업 [교환]\n히나모리 아무 캔뱃지 원하고 있습니다!\n꼭 같은 걸로 교환이 아니어도 되니 편히 이야기해주세요 🥺",
    author: { nickname: "우사기", profileImage: null, rating: 4.5 },
  },
  {
    id: 4,
    popupId: 1,
    title: "캐캐체 리마 캔뱃지",
    want: "토마 캔뱃지",
    images: [product4],
    locationStatus: "new",
    tradeStatus: null,
    likes: 9,
    comments: 0,
    isLiked: true,
    date: "2026. 11. 14",
    place: "용산역 근처",
    time: "주말 오후",
    description: "캐캐체 팝업 [교환]\n리마 캔뱃지 토마 캔뱃지랑 교환 원해요.",
    author: { nickname: "하치와레", profileImage: null, rating: 4.9 },
  },
  {
    id: 5,
    popupId: 1,
    title: "케이, 토마 캔뱃지",
    want: "아무 캔뱃지",
    images: [product5],
    locationStatus: "new",
    tradeStatus: "completed",
    likes: 10,
    comments: 0,
    isLiked: false,
    date: "2026. 11. 13",
    place: "용산 아이파크몰 6층",
    time: "채팅으로 협의해요 :)",
    description:
      "캐캐체 팝업 [교환]\n케이, 토마 캔뱃지 아무 캔뱃지랑 교환해요!",
    author: { nickname: "우사기", profileImage: null, rating: 4.5 },
  },
  {
    id: 6,
    popupId: 2,
    title: "우사기 미니 피규어",
    want: "치이카와 미니 피규어",
    images: [product1],
    locationStatus: "new",
    tradeStatus: null,
    likes: 12,
    comments: 2,
    isLiked: false,
    date: "2026. 11. 12",
    place: "롯데월드몰 B1",
    time: "평일 저녁",
    description: "우사기 미니 피규어 치이카와랑 교환 원해요!",
    author: { nickname: "모몽가", profileImage: null, rating: 4.0 },
  },
  {
    id: 7,
    popupId: 2,
    title: "우사기 미니 피규어",
    want: "치이카와 미니 피규어",
    images: [product2],
    locationStatus: "new",
    tradeStatus: "completed",
    likes: 12,
    comments: 2,
    isLiked: true, // 교환 완료 + 이미 찜한 경우 확인용
    date: "2026. 11. 10",
    place: "잠실역 8번 출구",
    time: "채팅으로 협의해요 :)",
    description: "교환 완료된 글이에요.",
    author: { nickname: "쿠리만쥬", profileImage: null, rating: 3.8 },
  },
  {
    id: 8,
    popupId: 2,
    title: "쿠로미 키링",
    want: "마이멜로디 키링",
    images: [product3],
    locationStatus: "live",
    tradeStatus: null,
    likes: 5,
    comments: 1,
    isLiked: false,
    date: "2026. 11. 15",
    place: "롯데월드 아쿠아리움 입구",
    time: "지금 바로 가능해요",
    description: "산리오 팝업 [교환]\n쿠로미 키링 마이멜로디 키링이랑 바꿔요!",
    author: { nickname: "시사", profileImage: null, rating: 4.6 },
  },
];
