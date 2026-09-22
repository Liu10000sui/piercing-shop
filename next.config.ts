import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 상품 사진은 Pexels CDN이 이미 알맞은 크기로 압축해 보내줍니다.
    // Next가 한 번 더 최적화하면 첫 로딩만 수십 초 느려지므로 그대로 사용합니다.
    unoptimized: true,
  },
};

export default nextConfig;
