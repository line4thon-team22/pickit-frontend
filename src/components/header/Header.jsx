import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getLocationStatus,
  getCurrentVerifications,
} from "../../api/locationApi";

import styled from "styled-components";
import LocationButton from "../button/LocationButton";
import logo from "../../assets/images/logo/logo.svg";
import bellIcon from "../../assets/images/icon/bell.svg";
import myIcon from "../../assets/images/icon/my.svg";
import backIcon from "../../assets/images/icon/back.svg";
import starIcon from "../../assets/images/icon/star.svg";
import defaultProfile from "../../assets/images/profile/default-profile.jpg";

import LoginRequiredModal from "../modal/LoginRequiredModal";
import LocationVerifyModal from "../modal/LocationVerifyModal";
import VerifiedPopupModal from "../modal/VerifiedPopupModal";

// variant
// - "main": 로고 + 알림 + MY (showLocationButton이면 위치 버튼 추가)
//   위치 버튼은 isLocationVerified에 따라 "위치 인증" / "팝업 확인"으로 바뀜
// - "chat": 뒤로가기 + 상대 프로필·닉네임·평점
// - "back": 뒤로가기만
export default function Header({
  variant = "main",
  showLocationButton = false,
  // TODO: 위치 인증 상태를 전역 상태로 관리
  // (홈/교환/찜이 같은 상태를 쓰므로, 옮기면 prop 대신 헤더 안에서 바로 읽기)
  isLocationVerified = false,
  user,
  onBack,
  onLocationClick,
  // TODO: 현재 인증한 팝업 상세로 이동
  onPopupCheckClick,
  // TODO: 알림·MY 동작이 정해지면 prop 대신 헤더 안에서 바로 이동하도록 변경
  // (어느 페이지에서 눌러도 같은 곳으로 가므로 페이지마다 넘길 필요 없음)
  onNotificationClick,
  onMyClick,
}) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { isLoggedIn, isAuthLoading } = useAuth();

  const [locationVerified, setLocationVerified] = useState(false);
  const [verifiedPopups, setVerifiedPopups] = useState([]);
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [isPopupLoading, setIsPopupLoading] = useState(false);

  useEffect(() => {
    if (variant !== "main" || !showLocationButton || !isLoggedIn) {
      return;
    }

    let active = true;

    const loadLocationStatus = async () => {
      try {
        const data = await getLocationStatus();

        if (active) {
          setLocationVerified(data.isLocationVerified);
        }
      } catch (error) {
        console.error("위치 인증 상태 조회 실패:", error);
      }
    };

    loadLocationStatus();

    return () => {
      active = false;
    };
  }, [variant, showLocationButton, isLoggedIn]);

  const handleLocationClick = () => {
    if (isAuthLoading) return;

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLocationModalOpen(true);
  };

  const handlePopupCheck = async () => {
    if (isPopupLoading) return;

    setIsPopupLoading(true);
    setIsPopupModalOpen(true);

    try {
      const data = await getCurrentVerifications();
      setVerifiedPopups(data.content ?? []);
    } catch (error) {
      console.error("인증된 팝업 조회 실패:", error);
      alert("인증된 팝업을 불러오지 못했습니다.");
      setIsPopupModalOpen(false);
    } finally {
      setIsPopupLoading(false);
    }
  };

  const handleLocationVerified = () => {
    setLocationVerified(true);
  };

  const handleMyClick = () => {
    if (isAuthLoading) return;

    if (isLoggedIn) {
      navigate("/my");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  if (variant === "main") {
    return (
      <>
        <Wrapper>
          <Link to="/" aria-label="홈으로">
            <Logo src={logo} alt="PICKIT" />
          </Link>

          <Actions>
            {showLocationButton && (
              <LocationButton
                isVerified={isLoggedIn && locationVerified}
                onClick={
                  isLoggedIn && locationVerified
                    ? handlePopupCheck
                    : handleLocationClick
                }
              />
            )}

            <IconButton
              type="button"
              onClick={onNotificationClick}
              aria-label="알림"
            >
              <img src={bellIcon} alt="" />
            </IconButton>

            <IconButton
              type="button"
              onClick={onMyClick ?? handleMyClick}
              aria-label="마이페이지"
            >
              <img src={myIcon} alt="" />
            </IconButton>
          </Actions>
        </Wrapper>

        <LoginRequiredModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />

        {isLocationModalOpen && (
          <LocationVerifyModal
            isOpen={isLocationModalOpen}
            onClose={() => setIsLocationModalOpen(false)}
            onVerified={handleLocationVerified}
          />
        )}

        <VerifiedPopupModal
          isOpen={isPopupModalOpen}
          onClose={() => setIsPopupModalOpen(false)}
          popups={verifiedPopups}
          isLoading={isPopupLoading}
        />
      </>
    );
  }

  return (
    <Wrapper>
      <IconButton type="button" onClick={handleBack} aria-label="뒤로가기">
        <img src={backIcon} alt="" />
      </IconButton>

      {variant === "chat" && user && (
        <>
          <UserInfo>
            <Profile src={user.profileImage || defaultProfile} alt="" />
            <Nickname>{user.nickname}</Nickname>
            {user.rating != null && (
              <Rating>
                <img src={starIcon} alt="평점" />
                {Number(user.rating).toFixed(1)}
              </Rating>
            )}
          </UserInfo>
          {/* 가운데 정렬용 빈 칸 (뒤로가기 버튼과 같은 크기) */}
          <Spacer />
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 48px;
  padding: 12px 20px;

  background-color: #ffffff;
`;

const Logo = styled.img`
  width: 63px;
  height: 22px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Profile = styled.img`
  width: 24px;
  height: 24px;

  border-radius: 50%;
  object-fit: cover;
`;

const Nickname = styled.span`
  color: ${({ theme }) => theme.colors.gray[900]};
  ${({ theme }) => theme.typography.h4}
`;

const Rating = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;

  color: ${({ theme }) => theme.colors.gray[900]};
  ${({ theme }) => theme.typography.h5SemiBold}
`;

const Spacer = styled.div`
  width: 24px;
  height: 24px;
`;
