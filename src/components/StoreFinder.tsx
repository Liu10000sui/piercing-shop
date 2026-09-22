"use client";

import { useEffect, useRef, useState } from "react";
import type { NearbyStore } from "@/app/api/stores/nearby/route";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

type Status = "idle" | "locating" | "loading" | "ready" | "error";
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
    return "위치 권한이 거부되었습니다. 주소창 왼쪽의 자물쇠 아이콘을 눌러 위치 권한을 허용해주세요.";
  if (code === 2) return "현재 위치를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.";
  return "위치 확인이 너무 오래 걸립니다. 다시 시도해주세요.";
}

export default function StoreFinder() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
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

        // 내 위치 표시
        new kakao.maps.Circle({
          center: new kakao.maps.LatLng(center.lat, center.lng),
          radius: 60,
          strokeWeight: 2,
          strokeColor: "#d6d9e0",
          fillColor: "#8b8e98",
          fillOpacity: 0.7,
        }).setMap(map);

        // 매장 마커
        const bounds = new kakao.maps.LatLngBounds();
        bounds.extend(new kakao.maps.LatLng(center.lat, center.lng));

        for (const store of stores) {
          const position = new kakao.maps.LatLng(store.lat, store.lng);
          const marker = new kakao.maps.Marker({ position, map });
          bounds.extend(position);
          kakao.maps.event.addListener(marker, "click", () => setSelectedId(store.id));
        }

        if (stores.length > 0) map.setBounds(bounds);
      })
      .catch(() => {
        if (!cancelled) setError("지도를 불러오지 못했습니다. 목록은 그대로 보실 수 있어요.");
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
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && status === "idle") findStores();
  }

  return (
    <>
      {open && (
        <div className="fixed inset-x-4 bottom-24 z-50 sm:inset-x-auto sm:right-6 sm:w-[380px]">
          <div className="chrome-border flex max-h-[70vh] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-silver-bright">가까운 피어싱샵</h2>
                <p className="mt-0.5 text-xs text-silver-dim">내 위치 기준 5km 이내</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="rounded-full px-2 py-1 text-silver-dim transition hover:text-silver"
              >
                ✕
              </button>
            </div>

            {(status === "locating" || status === "loading") && (
              <p className="px-5 py-10 text-center text-sm text-silver-dim">
                {status === "locating" ? "현재 위치를 확인하는 중…" : "주변 매장을 찾는 중…"}
              </p>
            )}

            {status === "error" && (
              <div className="px-5 py-8 text-center">
                <p className="text-sm leading-relaxed text-red-300">{error}</p>
                <button
                  onClick={findStores}
                  className="chrome-button mt-5 rounded-lg px-5 py-2.5 text-sm font-semibold transition"
                >
                  다시 시도
                </button>
              </div>
            )}

            {status === "ready" && (
              <>
                <div ref={mapBoxRef} className="h-44 w-full shrink-0 bg-panel-2" />

                {stores.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm text-silver-dim">
                    5km 안에 등록된 피어싱샵이 없습니다.
                  </p>
                ) : (
                  <ul className="divide-y divide-line overflow-y-auto">
                    {stores.map((store) => (
                      <li key={store.id}>
                        <button
                          onClick={() => focusStore(store)}
                          className={`w-full px-5 py-4 text-left transition ${
                            selectedId === store.id ? "bg-panel-2" : "hover:bg-panel-2"
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="truncate text-sm font-medium text-silver-bright">
                              {store.name}
                            </span>
                            <span className="shrink-0 font-mono text-xs text-silver">
                              {formatDistance(store.distance)}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-silver-dim">
                            {store.roadAddress || store.address}
                          </p>
                          <div className="mt-2 flex gap-3 text-xs">
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
                )}
              </>
            )}
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        aria-label="가까운 피어싱샵 찾기"
        className="chrome-button fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/50 transition hover:scale-105"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
    </>
  );
}
