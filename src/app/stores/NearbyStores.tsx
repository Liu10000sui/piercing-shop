"use client";

import { useEffect, useRef, useState } from "react";
import type { NearbyStore } from "@/app/api/stores/nearby/route";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

type Status = "locating" | "loading" | "ready" | "error";
type Coords = { lat: number; lng: number };

// 카카오 지도 SDK는 처음 한 번만 불러옵니다.
let sdkPromise: Promise<void> | null = null;
function loadKakaoSdk(): Promise<void> {
  if (window.kakao?.maps) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`;
    script.onload = () => window.kakao.maps.load(() => resolve());
    script.onerror = () => reject(new Error("지도를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

function formatDistance(meters: number) {
  return meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`;
}

function geolocationMessage(code: number) {
  if (code === 1)
    return "위치 권한이 거부되었습니다. 주소창 왼쪽의 자물쇠 아이콘을 눌러 위치 권한을 허용한 뒤 다시 시도해주세요.";
  if (code === 2) return "현재 위치를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.";
  return "위치 확인이 너무 오래 걸립니다. 다시 시도해주세요.";
}

export default function NearbyStores() {
  const [status, setStatus] = useState<Status>("locating");
  const [error, setError] = useState("");
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [center, setCenter] = useState<Coords | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mapBoxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  function findStores() {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("이 브라우저에서는 위치 찾기를 쓸 수 없습니다.");
      return;
    }

    setStatus("locating");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(coords);
        setStatus("loading");

        try {
          const res = await fetch(`/api/stores/nearby?lat=${coords.lat}&lng=${coords.lng}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "매장을 불러오지 못했습니다.");
          setStores(data.stores);
          setStatus("ready");
        } catch (e) {
          setStatus("error");
          setError(e instanceof Error ? e.message : "매장을 불러오지 못했습니다.");
        }
      },
      (err) => {
        setStatus("error");
        setError(geolocationMessage(err.code));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // 페이지에 들어오면 바로 현재 위치를 찾습니다.
  useEffect(() => {
    findStores();
  }, []);

  // 결과가 준비되면 지도를 그립니다.
  useEffect(() => {
    if (status !== "ready" || !center || !mapBoxRef.current) return;

    let cancelled = false;
    loadKakaoSdk()
      .then(() => {
        if (cancelled || !mapBoxRef.current) return;
        const kakao = window.kakao;

        const map = new kakao.maps.Map(mapBoxRef.current, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 6,
        });
        mapRef.current = map;

        // 내 위치
        new kakao.maps.Circle({
          center: new kakao.maps.LatLng(center.lat, center.lng),
          radius: 70,
          strokeWeight: 2,
          strokeColor: "#d6d9e0",
          fillColor: "#8b8e98",
          fillOpacity: 0.75,
        }).setMap(map);

        // 5km 반경
        new kakao.maps.Circle({
          center: new kakao.maps.LatLng(center.lat, center.lng),
          radius: 5000,
          strokeWeight: 1,
          strokeColor: "#8b8e98",
          strokeOpacity: 0.5,
          fillColor: "#8b8e98",
          fillOpacity: 0.05,
        }).setMap(map);

        const bounds = new kakao.maps.LatLngBounds();
        bounds.extend(new kakao.maps.LatLng(center.lat, center.lng));

        for (const store of stores) {
          const position = new kakao.maps.LatLng(store.lat, store.lng);
          const marker = new kakao.maps.Marker({ position, map, title: store.name });
          bounds.extend(position);
          kakao.maps.event.addListener(marker, "click", () => {
            setSelectedId(store.id);
            map.panTo(position);
          });
        }

        if (stores.length > 0) map.setBounds(bounds);
      })
      .catch(() => {
        if (!cancelled)
          setError("지도를 불러오지 못했습니다. 아래 목록은 그대로 보실 수 있어요.");
      });

    return () => {
      cancelled = true;
    };
  }, [status, center, stores]);

  function focusStore(store: NearbyStore) {
    setSelectedId(store.id);
    if (mapRef.current && window.kakao?.maps) {
      mapRef.current.panTo(new window.kakao.maps.LatLng(store.lat, store.lng));
    }
    mapBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (status === "locating" || status === "loading") {
    return (
      <p className="py-32 text-center text-sm text-silver-dim">
        {status === "locating" ? "현재 위치를 확인하는 중…" : "주변 매장을 찾는 중…"}
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="py-24 text-center">
        <p className="mx-auto max-w-md text-sm leading-relaxed text-red-300">{error}</p>
        <button
          onClick={findStores}
          className="chrome-button mt-6 rounded-lg px-6 py-3 text-sm font-semibold transition"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div
        ref={mapBoxRef}
        className="chrome-border h-[320px] w-full overflow-hidden rounded-2xl bg-panel-2 lg:sticky lg:top-24 lg:h-[560px]"
      />

      <div>
        <p className="text-sm text-silver-dim">
          {stores.length > 0
            ? `가까운 순으로 ${stores.length}곳`
            : "5km 안에 등록된 피어싱샵이 없습니다."}
        </p>

        <ul className="mt-4 space-y-3">
          {stores.map((store) => (
            <li key={store.id}>
              <button
                onClick={() => focusStore(store)}
                className={`chrome-border w-full rounded-2xl p-4 text-left transition ${
                  selectedId === store.id ? "ring-1 ring-silver-dim" : "hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-semibold text-silver-bright">
                    {store.name}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-silver">
                    {formatDistance(store.distance)}
                  </span>
                </div>

                {store.category && (
                  <p className="mt-1 text-xs text-silver-dim/80">{store.category}</p>
                )}
                <p className="mt-1.5 text-xs text-silver-dim">
                  {store.roadAddress || store.address}
                </p>

                <div className="mt-3 flex gap-3 text-xs">
                  {store.phone && (
                    <a
                      href={`tel:${store.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-silver underline underline-offset-4"
                    >
                      {store.phone}
                    </a>
                  )}
                  <a
                    href={store.placeUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-silver-dim underline underline-offset-4 hover:text-silver"
                  >
                    길찾기
                  </a>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
