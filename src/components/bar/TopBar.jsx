import styled from "styled-components";

export default function TopBar({ tabs, activeTab, onChange, ...props }) {
  return (
    <Container {...props}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          type="button"
          $active={activeTab === tab.value}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </TabButton>
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  margin: 10px 24px;
  gap: 15px;
`;

const TabButton = styled.button`
  border: none;

  background-color: transparent;
  color: ${({ $active }) => ($active ? "#141414" : "#727272")};

  font-family: inherit;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
`;
