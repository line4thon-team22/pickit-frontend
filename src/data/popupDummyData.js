// TODO(API): 서버 이미지 URL로 교체 (popup1.jpg는 1.5MB라 더미용으로만 사용)
import popup1 from "../assets/images/popup/popup1.jpg";
import popup2 from "../assets/images/popup/popup2.png";
import popup3 from "../assets/images/popup/popup3.jpg";
import popup4 from "../assets/images/popup/popup4.jpg";

// TODO(API): 팝업 목록·상세 조회 API 연동 시 더미 데이터 교체
// - status: upcoming(진행 전) / ongoing(진행 중) / completed(진행 완료)
//   TODO(API): 상태를 서버가 내려주는지, 날짜로 계산하는지 확인
// - location: 카드에 표시하는 지역 문구 (홈 popups와 같은 필드명)
// - likes: 찜 수 (교환 탭 내 현장 팝업의 PopupCard용, 피그마 293:9930 기준)
// - region: 지역 값 (팝업 탭은 API 연동됨, 남은 더미 사용처에서는 표시용 아님)
// - category: TODO(API): 카테고리가 여러 개일 수 있는지 확인
// - address, description: 상세 화면용
// 제목·상태·찜·이미지는 피그마 팝업 탭(293:7496) 기준, 지역·카테고리는 필터 시연용 임의 값
export const popups = [
  {
    id: 1,
    title: "캐릭캐릭체인지 X 팝퍼블 콜라보 카페",
    image: popup1,
    status: "ongoing",
    location: "서울 용산",
    region: "용산",
    category: "애니메이션",
    period: "26.08.14(금) - 11.29(일)",
    isLiked: true,
    likes: 12,
    address:
      "서울 용산구 한강대로23길 55 용산 아이파크몰 6층 팝콘D스퀘어 팝퍼블 카페",
    description:
      "인기 애니메이션 캐릭캐릭체인지가 팝퍼블과 함께 특별한 콜라보 카페를 오픈해요 ✨ 캐릭캐릭체인지의 설레는 순간을 팝퍼블 용산점에서 직접 만나보세요! 🌸",
  },
  {
    id: 2,
    title: "산리오캐릭터즈 X 롯데월드 아쿠아리움 - 머메이드 파티",
    image: popup2,
    status: "ongoing",
    location: "서울 잠실",
    region: "잠실",
    category: "라이프스타일",
    period: "26.08.14(금) - 11.29(일)",
    isLiked: true,
    likes: 12,
    address: "서울 송파구 올림픽로 300 롯데월드몰 B1 롯데월드 아쿠아리움",
    description:
      "산리오캐릭터즈와 롯데월드 아쿠아리움이 함께하는 머메이드 파티 🧜‍♀️ 바닷속 친구들이 된 산리오캐릭터즈를 만나보세요!",
  },
  {
    id: 3,
    title: "연도문구 팝업 - 우주정거장점",
    image: popup3,
    status: "upcoming",
    location: "서울 홍대",
    region: "홍대/신촌",
    category: "팬시/문구",
    period: "26.08.14(금) - 11.29(일)",
    isLiked: false,
    likes: 12,
    address: "서울 마포구 양화로 188 AK PLAZA 홍대 3층",
    description:
      "연도문구가 우주정거장 콘셉트로 팝업 스토어를 열어요 🚀 우주정거장점에서만 만날 수 있는 한정 문구를 놓치지 마세요!",
  },
  {
    id: 4,
    title: "애니메이션 주술회전展 ‘회옥•옥절’, ‘시부야사변’",
    image: popup4,
    status: "completed",
    location: "서울 용산",
    region: "용산",
    category: "애니메이션",
    period: "26.08.14(금) - 11.29(일)",
    isLiked: false,
    likes: 12,
    address: "서울 용산구 한강대로23길 55 용산 아이파크몰 6층",
    description:
      "애니메이션 주술회전의 ‘회옥•옥절’, ‘시부야사변’ 장면을 만나볼 수 있는 전시예요. 원화와 설정 자료, 한정 굿즈를 함께 즐겨보세요!",
  },
  // 5·6: 교환글 작성 팝업 선택 목록의 "내 현장이 아닌 팝업" 시연용 (피그마 711:8483 제목)
  // 포스터는 더미 이미지 재사용
  {
    id: 5,
    title: "글램팜 팝업 - 백스테이지 인 성수",
    image: popup3,
    status: "ongoing",
    location: "서울 성수",
    region: "성수",
    category: "뷰티",
    period: "26.09.01(화) - 12.14(월)",
    isLiked: false,
    likes: 8,
    address: "서울 성동구 연무장길 20",
    description:
      "글램팜이 성수에서 백스테이지 콘셉트 팝업을 열어요 💄 헤어 스타일링 체험과 한정 굿즈를 만나보세요!",
  },
  {
    id: 6,
    title: "올리브영 어드밴스드 더마 팝업 in 트렌드팟 바이 올리브영 성수",
    image: popup2,
    status: "upcoming",
    location: "서울 성수",
    region: "성수",
    category: "뷰티",
    period: "26.12.01(화) - 12.31(목)",
    isLiked: false,
    likes: 5,
    address: "서울 성동구 성수이로 78 트렌드팟 바이 올리브영",
    description:
      "올리브영이 더마 화장품 브랜드와 함께하는 팝업이에요 🧴 피부 진단과 샘플링 이벤트가 준비되어 있어요!",
  },
];
