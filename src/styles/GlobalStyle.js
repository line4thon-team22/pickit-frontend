import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  /* body는 고정하고, 스크롤은 앱 레이아웃의 본문 영역이 담당한다 */
  html,
  body,
  #root {
    height: 100%;
    overflow: hidden;
    overscroll-behavior: none;
  }

  body {
    margin: 0;
    background: #ffffff;
    color: #000000;
    font-family:
      "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
      system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol {
    margin: 0;
    padding: 0;
  }

  ul,
  ol {
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  input,
  textarea {
    font: inherit;
  }

  img,
  svg {
    display: block;
    max-width: 100%;
  }

  /* 길게 눌렀을 때 텍스트 선택 방지 (본문 글은 선택 가능하게 둔다) */
  button,
  a,
  img,
  nav {
    user-select: none;
    -webkit-user-select: none;
  }
`;

export default GlobalStyle;
