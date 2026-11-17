import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ModalBase from "./ModalBase";
import CommonButton from "../button/CommonButton";
import alertIcon from "../../assets/images/icon/alert.svg";

export default function LoginRequiredModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} $width={300}>
      <Content>
        <AlertIcon src={alertIcon} alt="" />

        <Title>로그인이 필요한 서비스입니다.</Title>

        <Description>
          로그인하고 PICKIT의 다양한 기능을 이용해 보세요!
        </Description>

        <CommonButton
          $width={142}
          $height={28}
          $fontSize={12}
          $borderRadius={16}
          onClick={() => {
            onClose();
            navigate("/login");
          }}
        >
          로그인하러 가기
        </CommonButton>
      </Content>
    </ModalBase>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const AlertIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-bottom: 10px;
`;

const Title = styled.p`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #141414;
`;

const Description = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  color: #727272;
  white-space: nowrap;
`;
