import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
let sdkPromise;

function loadKakaoMaps() {
  if (!KAKAO_KEY) {
    return Promise.reject(new Error("카카오맵 JavaScript 키가 설정되지 않았습니다."));
  }
  if (window.kakao?.maps) {
    return new Promise((resolve) => window.kakao.maps.load(resolve));
  }
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(KAKAO_KEY)}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        if (!window.kakao?.maps) {
          reject(new Error("카카오 지도 SDK를 불러오지 못했습니다."));
          return;
        }
        window.kakao.maps.load(resolve);
      };
      script.onerror = () => reject(new Error("카카오 지도 SDK 로딩에 실패했습니다. 도메인과 키를 확인해 주세요."));
      document.head.appendChild(script);
    }).catch((error) => {
      sdkPromise = null;
      throw error;
    });
  }
  return sdkPromise;
}

export default function LocationMap({ location, onAddressChange }) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!location?.lat || !location?.lng) return undefined;

    let cancelled = false;
    setError("");
    onAddressChange?.("");

    loadKakaoMaps()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        const { kakao } = window;
        const center = new kakao.maps.LatLng(location.lat, location.lng);
        const map = new kakao.maps.Map(containerRef.current, { center, level: 3 });
        new kakao.maps.Marker({ map, position: center });

        // 모달이 나타난 직후 지도 크기를 다시 계산한다.
        requestAnimationFrame(() => {
          if (!cancelled) {
            map.relayout();
            map.setCenter(center);
          }
        });

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(location.lng, location.lat, (result, status) => {
          if (cancelled || status !== kakao.maps.services.Status.OK || !result?.length) return;
          const address = result[0].road_address?.address_name
            || result[0].address?.address_name
            || "";
          onAddressChange?.(address);
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => { cancelled = true; };
  }, [location?.lat, location?.lng, onAddressChange]);

  return (
    <MapContainer>
      <MapCanvas ref={containerRef} />
      {error && <MapError role="alert">{error}</MapError>}
    </MapContainer>
  );
}

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: #e3e3e3;
  overflow: hidden;
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
`;

const MapError = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: #f5f5f5;
  color: #727272;
  font-size: 12px;
  text-align: center;
`;
