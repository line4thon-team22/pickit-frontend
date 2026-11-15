import { css } from "styled-components";

const theme = {
  layout: {
    maxWidth: "402px",
    // 하단 내비 높이와 화면 아래 간격 (피그마 홈 157:2203, 팝업 252:2331)
    navHeight: "74px",
    navBottom: "32px",
  },

  // 피그마 변수 이름 기준 (헤더 290:7203, 내비 239:1806, 푸터 228:4147에서 확인)
  colors: {
    primary: {
      100: "#ffcce1",
      500: "#ff006a",
    },
    gray: {
      700: "#727272",
      800: "#434343",
      900: "#141414",
    },
  },

  // 피그마 텍스트 스타일 기준 (헤더 290:7203, 푸터 228:4147에서 확인)
  // 사용: ${({ theme }) => theme.typography.h4}
  typography: {
    // Font/H4.Headline
    h4: css`
      font-size: 16px;
      font-weight: 600;
      line-height: normal;
    `,
    // Font/H5.Headline_SB
    h5SemiBold: css`
      font-size: 14px;
      font-weight: 600;
      line-height: normal;
    `,
    // Font/B3.Body_R
    body3: css`
      font-size: 12px;
      font-weight: 400;
      line-height: normal;
    `,
  },
};

export default theme;
