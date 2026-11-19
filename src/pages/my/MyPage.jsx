import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Header from "../../components/header/Header";
import defaultProfile from "../../assets/images/profile/default-profile.jpg";
import starIcon from "../../assets/images/icon/star.svg";
import editIcon from "../../assets/images/icon/edit.svg";
import pickitLogo from "../../assets/images/logo/logo.svg";

const menus = [
  { label: "관심 설정", path: "/my/interest" },
  { label: "교환 내역" },
  { label: "계정 설정" },
  { label: "알림 설정" },
  { label: "공지 사항" },
  { label: "고객 센터" },
];

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header variant="back" />

      <ProfileSection>
        <ProfileImage src={defaultProfile} alt="프로필" />

        <ProfileInfo>
          <Nickname>
            피킷
            <img src={editIcon} alt="프로필 편집" />
          </Nickname>

          <Rating>
            <img src={starIcon} alt="" />
            <span>4.5</span>
          </Rating>
        </ProfileInfo>
      </ProfileSection>

      <PremiumSection>
        <PremiumButton type="button">
          <PremiumLogo src={pickitLogo} alt="Pickit" />
          <span>Premium 가입하기</span>
        </PremiumButton>
      </PremiumSection>

      <MenuList>
        {menus.map((menu) => (
          <MenuItem key={menu.label}>
            <MenuButton
              type="button"
              onClick={() => {
                if (menu.path) navigate(menu.path);
              }}
            >
              {menu.label}
            </MenuButton>
          </MenuItem>
        ))}
      </MenuList>
    </>
  );
}

const ProfileSection = styled.section`
  display: flex;
  align-items: center;
  gap: 32px;

  padding: 20px 24px;
`;

const ProfileImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Nickname = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  font-size: 20px;
  font-weight: 600;

  color: #141414;

  img {
    width: 14px;
    height: 14px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  color: #141414;
  font-size: 16px;
  font-weight: 600;

  img {
    width: 24px;
    height: 24px;
  }
`;

const PremiumSection = styled.section`
  padding: 24px;
`;

const PremiumButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  height: 58px;
  padding: 16px;

  border: 2px solid #ff99c3;
  border-radius: 12px;
  background: #ffffff;

  box-shadow: 0 0 4px 0 rgba(255, 0, 106, 1);
  cursor: pointer;

  color: #141414;
  font-size: 16px;
  font-weight: 600;
`;

const PremiumLogo = styled.img`
  width: 63px;
  height: 22px;
`;

const MenuList = styled.div`
  border-top: 1px solid #e3e3e3;
`;

const MenuItem = styled.section`
  border-bottom: 1px solid #e3e3e3;
`;

const MenuButton = styled.button`
  width: 100%;
  height: 39px;
  padding: 10px 24px;

  display: flex;
  align-items: center;

  background: #ffffff;
  border: none;
  text-align: left;

  font-size: 16px;
  font-weight: 500;
  color: #141414;

  cursor: pointer;
`;
