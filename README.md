# PIERCING & CO 피어싱앤코

피어싱만 전문으로 다루는 온라인 쇼핑몰입니다. 개발 연습용으로 만든 프로젝트예요.

## 쓰는 기술

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4) — 화면과 서버 로직
- **Supabase** — 회원가입/로그인, 데이터 저장 (테이블 이름은 모두 `shop_` 으로 시작)
- **토스페이먼츠 V2 결제위젯** — 결제 (테스트 키라 실제로 결제되지 않습니다)
- **Vercel** — 배포

## 화면

| 주소 | 설명 |
| --- | --- |
| `/` | 홈 — 브랜드 소개와 추천 상품 |
| `/products` | 상품 목록 (부위별 카테고리 필터) |
| `/products/[id]` | 상품 상세, 장바구니 담기 |
| `/cart` | 장바구니 |
| `/checkout` | 배송지 입력 + 토스 결제위젯 |
| `/orders`, `/orders/[id]` | 주문내역 / 주문 상세 |
| `/login`, `/signup` | 로그인 / 회원가입 |

## 시작하기

```bash
npm install
npm run dev
```

`.env.local.example` 을 참고해서 `.env.local` 파일을 만들어야 합니다.

| 환경변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 주소 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 브라우저에서 쓰는 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용** 관리자 키 (주문 저장·결제 완료 처리용) |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스 결제위젯 클라이언트 키 |
| `TOSS_SECRET_KEY` | **서버 전용** 토스 시크릿 키 |

## 결제가 처리되는 순서

```
장바구니 → /checkout
  → createOrder() : 서버가 장바구니를 다시 읽어 금액을 계산하고 주문서를 먼저 저장 (pending)
  → 토스 결제창에서 인증
  → /api/payments/confirm : 금액을 서버 값과 대조한 뒤 토스 승인 API 호출
  → 성공하면 paid 로 변경 + 재고 차감 + 장바구니 비우기
  → /orders/[id]
```

금액과 결제 성공 여부는 **전부 서버가 판단**합니다. 브라우저가 보낸 금액은 신뢰하지 않습니다.
주문 테이블(`shop_orders`)은 보안 규칙(RLS)상 브라우저에서 수정할 수 없고, 서버 전용 키로만 기록됩니다.
