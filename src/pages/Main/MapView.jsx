import React, { useEffect } from "react";

export default function MapView() {
  useEffect(() => {
    function loadKakaoMap() {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        new window.kakao.maps.Map(container, options);
      } else {
        // kakao 객체가 아직 로드되지 않았으면 100ms 후 재시도
        setTimeout(loadKakaoMap, 100);
      }
    }
    loadKakaoMap();
  }, []);

  return (
    <div id="map" style={{ width: "100%", height: "400px" }}></div>
  );
}
