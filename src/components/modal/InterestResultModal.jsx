import styled from "styled-components";

import ModalBase from "./ModalBase";
import CommonButton from "../button/CommonButton";

export default function InterestResultModal({ isOpen, onClose }) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} $width={328}>
      <Content>
        <Title>
          <Highlight>K-POP, 애니메이션, 뷰티</Highlight> 에
          <br />
          관심있는 피킷 님,
          <br />
          환영합니다.
        </Title>

        <Description>
          관심사로 설정한 IP의 새로운 팝업 소식과
          <br />
          교환 게시글을 알려드릴게요.
        </Description>
      </Content>
      <CommonButton $width={288} $height={48} $fontSize={16} onClick={onClose}>
        지금 교환글 보러가기
      </CommonButton>
    </ModalBase>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  padding: 102px 0 81px;

  margin: 0 0 16px;
`;

const Title = styled.h2`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #141414;
`;

const Highlight = styled.span`
  color: #ff006a;
`;

const Description = styled.p`
  font-size: 14px;
  color: #727272;
  font-weight: 300;
`;
