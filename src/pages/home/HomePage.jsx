import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import RecommendBanner from "../../components/area/RecommendBanner";
import AppointmentCard from "../../components/card/AppointmentCard";
import ExchangeCard from "../../components/card/ExchangeCard";
import PopupCard from "../../components/card/PopupCard";

import {
  products,
  exchanges,
  appointment,
  popups,
} from "../../data/homeDummyData";

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

          <PopupList>
            {popups.map((popup) => (
              <PopupCard key={popup.id} {...popup} />
            ))}
          </PopupList>
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
  column-gap: 10px;
  row-gap: 32px;
`;
