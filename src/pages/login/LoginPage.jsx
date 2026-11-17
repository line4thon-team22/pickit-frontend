import { useState } from "react";
import styled from "styled-components";

import CommonInput from "../../components/input/CommonInput";
import CommonButton from "../../components/button/CommonButton";

import logo from "../../assets/images/logo/logo.svg";
import googleIcon from "../../assets/images/icon/google.svg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 로그인 API 연결
  };

  return (
    <Page>
      <Logo src={logo} alt="PICKIT" />

      <LoginForm onSubmit={handleSubmit}>
        <InputGroup>
          <CommonInput
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            $width={338}
            $height={37}
            $borderRadius={16}
            $fontSize={14}
          />

          <CommonInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            $width={338}
            $height={37}
            $borderRadius={16}
            $fontSize={14}
          />
        </InputGroup>

        <ButtonGroup>
          <CommonButton
            type="submit"
            $width={338}
            $height={60}
            $borderRadius={12}
            $fontSize={20}
          >
            로그인
          </CommonButton>

          <CommonButton
            type="submit"
            variant="secondary"
            $width={338}
            $height={60}
            $borderRadius={12}
            $fontSize={20}
          >
            회원 가입
          </CommonButton>
        </ButtonGroup>
      </LoginForm>

      <PasswordFind type="button">이메일/비밀번호를 잊으셨나요?</PasswordFind>

      <Divider>
        <DividerText>또는</DividerText>
      </Divider>

      <GoogleButton type="button">
        <GoogleIcon src={googleIcon} alt="" />
        Google 로그인
      </GoogleButton>

      <FooterText>서비스 이용약관 / pickit@gmail.com</FooterText>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: 100dvh;

  padding: 72px 32px 28px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #ffffff;
`;

const Logo = styled.img`
  width: 126px;
  height: auto;

  margin: 0 auto 70px;
`;

const LoginForm = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputGroup = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  width: 100%;

  margin-top: 36px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const PasswordFind = styled.button`
  margin: 41px auto 0;
  padding: 0;

  border: none;
  background: none;

  color: #8e8e8e;
  font-size: 14px;
  font-weight: 400;

  cursor: pointer;
`;

const Divider = styled.div`
  margin: 20px auto 78px;

  justify-content: center;
  display: flex;
  align-items: center;
`;

const DividerText = styled.span`
  justify-content: center;
  color: #8e8e8e;
  font-size: 14px;
  font-weight: 400;
`;

const GoogleButton = styled.button`
  width: 338px;
  max-width: 100%;
  height: 60px;

  box-sizing: border-box;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e3e3e3;
  border-radius: 12px;
  background-color: #fafafa;

  color: #141414;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;
`;

const GoogleIcon = styled.img`
  position: absolute;
  left: 24px;

  width: 20px;
  height: 20px;
`;

const FooterText = styled.p`
  margin: auto 0 0;

  color: #727272;
  font-size: 14px;
  text-align: center;
`;
