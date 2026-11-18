import styled from "styled-components";
import CommonButton from "../button/CommonButton";
import alertIcon from "../../assets/images/icon/alert.svg";

// 배경(children)을 흐리게 깔고 그 위에 안내 문구·버튼을 띄우는 영역
// - 흐림 방식: 홈 로그인 오버레이(RecommendBanner)와 같은 값
// - 문구·버튼 수치: 피그마 위치 인증 안내 693:8288 (모달 박스는 빼고 내용만 사용)
// - 배경은 클릭·포커스·스크린리더 모두 막음
export default function BlurOverlay({
  children,
  title,
  description,
  buttonText,
  onButtonClick,
  $buttonWidth = 168,
}) {
  return (
    <Container>
      <Background aria-hidden="true" inert>
        {children}
      </Background>

      <Overlay>
        <img src={alertIcon} alt="" />

        <TextArea>
          {title && <Title>{title}</Title>}
          {description && <Description>{description}</Description>}
        </TextArea>

        {buttonText && (
          <CommonButton
            $width={$buttonWidth}
            $height={28}
            $fontSize={12}
            $borderRadius={16}
            onClick={onButtonClick}
          >
            {buttonText}
          </CommonButton>
        )}
      </Overlay>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const Background = styled.div`
  pointer-events: none;
  user-select: none;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;

  /* 전체는 반투명 흰색, 가운데 문구 뒤는 거의 불투명한 흰색이 바깥으로 갈수록 옅어짐
     (피그마 홈 로그인 안내 257:4066의 가운데 흰색 원형 그라데이션 참고) */
  background:
    radial-gradient(
      220px 120px at 50% 50%,
      rgba(255, 255, 255, 0.95) 40%,
      rgba(255, 255, 255, 0) 100%
    ),
    rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  word-break: keep-all;
`;

const Title = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  ${({ theme }) => theme.typography.h4}
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
`;
