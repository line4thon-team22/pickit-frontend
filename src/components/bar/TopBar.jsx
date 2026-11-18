import styled from "styled-components";

// 페이지 안의 텍스트 탭 바 (피그마 교환 293:9930, 찜 474:23015, 채팅 293:11804 공통)
// - 활성 탭: aria-selected="true" (바깥에서 스타일을 덮어쓸 때도 이 속성으로 구분 가능)
export default function TopBar({ tabs, activeTab, onChange, ...props }) {
  return (
    <Container role="tablist" {...props}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.value}
          $active={activeTab === tab.value}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </TabButton>
      ))}
    </Container>
  );
}

// 피그마: 높이 44 (위아래 10 + 글자 24), 좌우 24, 탭 간격 15
const Container = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 10px 24px;
  gap: 15px;
`;

// 피그마: 활성 SemiBold #141414 / 비활성 Medium #727272
const TabButton = styled.button`
  border: none;

  background-color: transparent;
  color: ${({ $active }) => ($active ? "#141414" : "#727272")};

  font-family: inherit;
  font-size: 20px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
`;
