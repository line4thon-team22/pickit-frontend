import styled from "styled-components";

export default function Footer() {
  return (
    <Wrapper>
      <p>© 2026 PICKIT. All rights reserved.</p>
      <p>PICK YOUR FAVORITE, TRADE YOUR EXTRA.</p>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  flex-shrink: 0;

  padding: 120px 24px 36px;

  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3}
`;
