import styled from "styled-components";

export default function LocationMap() {
  return (
    <MapContainer>{/* TODO: 지도 API 연결 후 현재 위치 표시 */}</MapContainer>
  );
}

const MapContainer = styled.div`
  width: 100%;
  height: 200px;

  border-radius: 12px;
  background-color: #e3e3e3;
  overflow: hidden;
`;
