import { NextResponse, type NextRequest } from "next/server";

const KAKAO_KEYWORD_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
const RADIUS_METERS = 5000;

export type NearbyStore = {
  id: string;
  name: string;
  category: string;
  roadAddress: string;
  address: string;
  phone: string;
  distance: number;
  placeUrl: string;
  lat: number;
  lng: number;
};

// 브라우저가 알려준 현재 위치를 받아, 카카오 지도에서 5km 안의 피어싱샵을 찾아줍니다.
// 카카오 REST 키는 서버에만 있으므로 브라우저에 노출되지 않습니다.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "위치 정보가 올바르지 않습니다." }, { status: 400 });
  }

  const restKey = process.env.KAKAO_REST_API_KEY;
  if (!restKey) {
    return NextResponse.json(
      { error: "매장 찾기 설정이 아직 준비되지 않았습니다." },
      { status: 503 }
    );
  }

  const url = new URL(KAKAO_KEYWORD_URL);
  url.searchParams.set("query", "피어싱");
  url.searchParams.set("x", String(lng));
  url.searchParams.set("y", String(lat));
  url.searchParams.set("radius", String(RADIUS_METERS));
  url.searchParams.set("sort", "distance");
  url.searchParams.set("size", "15");

  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${restKey}` },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "주변 매장을 불러오지 못했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 }
    );
  }

  const data = await response.json();

  const stores: NearbyStore[] = (data.documents ?? []).map(
    (d: Record<string, string>) => ({
      id: d.id,
      name: d.place_name,
      category: d.category_name?.split(">").pop()?.trim() ?? "",
      roadAddress: d.road_address_name ?? "",
      address: d.address_name ?? "",
      phone: d.phone ?? "",
      distance: Number(d.distance ?? 0),
      placeUrl: d.place_url ?? "",
      lat: Number(d.y),
      lng: Number(d.x),
    })
  );

  return NextResponse.json({ stores });
}
