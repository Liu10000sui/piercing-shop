import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 상품 사진은 Pexels(무료 이미지) CDN에서 불러옵니다.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
};

export default nextConfig;
