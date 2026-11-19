import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/useAuth";
import { useEffect, useState } from "react";
import { getPosts, getRecommendedPosts } from "../../api/postApi";
import { toImageUrl } from "../../api/client";
import { getPopups } from "../../api/popupApi";
import { getMyAppointments } from "../../api/appointmentApi";

import Header from "../../components/header/Header";
import RecommendBanner from "../../components/area/RecommendBanner";
import AppointmentCard from "../../components/card/AppointmentCard";
import ExchangeCard from "../../components/card/ExchangeCard";
import PopupCard from "../../components/card/PopupCard";

// TODO: 홈 화면 구현 전 빈 페이지
export default function HomePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [popups, setPopups] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      try {
        const data = await getPosts({
          sort: "LATEST",
          page: 0,
          size: 3,
        });

        if (active) setExchanges(data.content ?? []);
      } catch (error) {
        console.error("교환글 목록 조회 실패:", error);
      }
    };

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadPopups = async () => {
      try {
        const data = await getPopups();

        console.log("팝업 목록:", data);
        console.log(
          "팝업 ID:",
          data.map((popup) => popup.id),
        );

        if (active) {
          setPopups(data.slice(0, 4));
        }
      } catch (error) {
        console.error("팝업 목록 조회 실패:", error);
      }
    };

    loadPopups();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let active = true;

    const loadAppointment = async () => {
      try {
        const data = await getMyAppointments({
          status: "CONFIRMED",
          page: 0,
          size: 1,
        });

        console.log("📅 나의 약속 API 응답:", data);
        console.log("📅 약속 목록:", data.content);

        const latest = data.content?.[0];

        if (active && latest) {
          setAppointment({
            image: toImageUrl(latest.post.images?.[0]),
            title: latest.post.haveItemName,
            want: latest.post.wantItemName,
            location: latest.meetingPlace,
            date: latest.post.preferredTime || "시간 미정",
          });
        }
      } catch (error) {
        console.error("나의 약속 조회 실패:", error);
      }
    };

    loadAppointment();

    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    let active = true;

    const loadRecommendedPosts = async () => {
      try {
        const data = await getRecommendedPosts(5);

        console.log("💗 추천 게시글 API 응답:", data);

        if (active) {
          setProducts(
            (Array.isArray(data) ? data : []).map((post) => ({
              id: post.postId,
              image: toImageUrl(post.images?.[0]),
              title: post.haveItemName,
              wanted: post.wantItemName,
              location: post.preferredLocation,
              time: post.preferredTime,
            })),
          );
        }
      } catch (error) {
        console.error("추천 게시글 조회 실패:", error);
      }
    };

    loadRecommendedPosts();

    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  return (
    <>
      <Header variant="main" showLocationButton />

      <Wrapper>
        <Section>
          <SectionTitle>
            {isLoggedIn && user?.username
              ? `${user.username} 님이 관심 가질 아이템`
              : "피킷 님이 관심 가질 아이템"}
          </SectionTitle>

          <RecommendArea>
            <RecommendBanner
              products={isLoggedIn ? products : []}
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
                key={exchange.postId}
                image={toImageUrl(exchange.images?.[0])}
                title={exchange.haveItemName}
                want={exchange.wantItemName}
                status="new"
                likes={exchange.likeCount}
                comments={exchange.chatCount}
                onClick={() => navigate(`/posts/${exchange.postId}`)}
              />
            ))}
          </ExchangeList>
        </Section>

        <Section>
          <SectionTitle>요즘 뜨는 팝업</SectionTitle>

          <PopupList>
            {popups.map((popup) => (
              <PopupCard
                key={popup.id}
                {...popup}
                onClick={() => navigate(`/popups/${popup.id}`)}
              />
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
