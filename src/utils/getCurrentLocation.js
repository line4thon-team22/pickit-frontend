export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("위치 정보를 지원하지 않는 브라우저입니다."));
      return;
    }

    let bestPosition = null;
    let finished = false;
    let watchId = null;
    let timeoutId = null;

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };

    const toLocation = ({ coords, timestamp }) => ({
      lat: coords.latitude,
      lng: coords.longitude,
      accuracyMeters: coords.accuracy,
      measuredAt: new Date(timestamp).toISOString(),
    });

    const finish = (position) => {
      if (finished) return;
      finished = true;
      cleanup();
      resolve(toLocation(position));
    };

    const fail = (error) => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(error);
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (
          !bestPosition ||
          position.coords.accuracy < bestPosition.coords.accuracy
        ) {
          bestPosition = position;
        }

        if (position.coords.accuracy <= 100) {
          finish(position);
        }
      },
      fail,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );

    timeoutId = setTimeout(() => {
      if (bestPosition && bestPosition.coords.accuracy <= 100) {
        finish(bestPosition);
      } else {
        fail(
          new Error(
            "GPS 정확도가 100m를 초과합니다. 모바일에서 다시 시도해 주세요.",
          ),
        );
      }
    }, 10000);
  });
