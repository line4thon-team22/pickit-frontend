import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import RecommendBanner from "../../components/area/RecommendBanner";
import AppointmentCard from "../../components/card/AppointmentCard";
import ExchangeCard from "../../components/card/ExchangeCard";

import product1 from "../../assets/images/product/recommend1.png";
import product2 from "../../assets/images/product/recommend2.png";
import product3 from "../../assets/images/product/recommend3.png";
import product4 from "../../assets/images/product/recommend4.png";
import product5 from "../../assets/images/product/recommend5.png";

const products = [
  {
    image: product1,
    title: "베이비 쿠로미 인형",
    wanted: "베이비 헬로키티 인형",
    location: "용산 아이파크몰 6층",
    time: "채팅으로 정해요 :)",
    color: "#FF006A",
  },
  {
    image: product2,
    title: "턱시도 샘 인형",
    wanted: "마이멜로디 인형",
    location: "서울 용산",
    time: "채팅으로 정해요 :)",
    color: "#8BBAC7",
  },
  {
    image: product3,
    title: "캐릭터 굿즈",
    wanted: "다른 굿즈",
    location: "서울 영등포",
    time: "채팅으로 정해요 :)",
    color: "#E6C18C",
  },
  {
    image: product4,
    title: "산리오 마스코트",
    wanted: "산리오 굿즈",
    location: "서울 강남",
    time: "채팅으로 정해요 :)",
    color: "#A8D4D1",
  },
  {
    image: product5,
    title: "캐릭터 인형",
    wanted: "캐릭터 굿즈",
    location: "서울 홍대",
    time: "채팅으로 정해요 :)",
    color: "#D5C1A5",
  },
];

const appointment = {
  title: "케이, 토마 캔뱃지",
  want: "아무 캔뱃지",
  location: "용산 아이파크몰 6층 팝업 카페",
  date: "채팅으로 협의해요 :)",
};

const exchanges = [
  {
    id: 1,
    title: "우사기 미니 피규어",
    want: "치이카와 미니 피규어",
    likes: 12,
    comments: 2,
    status: "new",
  },
  {
    id: 2,
    title: "캐캐체 리마 캔뱃지",
    want: "토마 캔뱃지",
    likes: 9,
    comments: 0,
    status: "new",
  },
  {
    id: 3,
    title: "아무, 세라 인형",
    want: "토마 인형",
    likes: 7,
    comments: 0,
    status: "live",
  },
];

// TODO: 홈 화면 구현 전 빈 페이지
export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = false; // 로그인 여부를 나타내는 상태 (예시로 false로 설정)
  return (
    <>
      <Header variant="main" showLocationButton />

      <Wrapper>
        <Section>
          <SectionTitle>피킷 님이 관심 가질 아이템</SectionTitle>

          <RecommendArea>
            <RecommendBanner
              products={products}
              isLoggedIn={isLoggedIn}
              onLoginClick={() => navigate("/login")}
            />
          </RecommendArea>
        </Section>

        {appointment && (
          <Section>
            <SectionTitle>나의 약속</SectionTitle>

            <AppointmentCard {...appointment} />
          </Section>
        )}

        <Section>
          <SectionTitle>지금 올라온 교환글</SectionTitle>

          <ExchangeList>
            {exchanges.map((exchange) => (
              <ExchangeCard
                key={exchange.id}
                title={exchange.title}
                want={exchange.want}
                status={exchange.status}
                likes={exchange.likes}
                comments={exchange.comments}
              />
            ))}
          </ExchangeList>
        </Section>

        <Section>
          <SectionTitle>요즘 뜨는 팝업</SectionTitle>

          <PopupList>{/* 팝업 카드 */}</PopupList>
        </Section>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 20px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #000;
  padding: 0 12px;
`;

const RecommendArea = styled.div`
  width: 100%;
`;

const ExchangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PopupList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
`;
