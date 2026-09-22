"use client";

import {
  loadTossPayments,
  type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useRef, useState } from "react";
import { createOrder } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/types";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

type Props = {
  amount: number;
  customerKey: string;
  customerEmail: string;
};

export default function CheckoutWidget({ amount, customerKey, customerEmail }: Props) {
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const initRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 결제 UI는 딱 한 번만 그립니다. (개발모드에서 두 번 실행되는 것을 막아요)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey });

        await widgets.setAmount({ currency: "KRW", value: amount });
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
        ]);

        widgetsRef.current = widgets;
        setReady(true);
      } catch {
        setError("결제 화면을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.");
      }
    })();
  }, [amount, customerKey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const widgets = widgetsRef.current;
    if (!widgets) return;

    setPending(true);
    setError(null);

    // 1) 서버가 장바구니를 다시 읽어 금액을 계산하고 주문서를 먼저 저장합니다.
    const result = await createOrder({ receiverName, phone, address });

    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }

    // 2) 서버가 확정한 금액으로 다시 맞춘 뒤 결제창을 띄웁니다.
    try {
      await widgets.setAmount({ currency: "KRW", value: result.amount });
      await widgets.requestPayment({
        orderId: result.orderCode,
        orderName: result.orderName,
        successUrl: `${window.location.origin}/api/payments/confirm`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerName: result.customerName,
        ...(result.customerEmail ? { customerEmail: result.customerEmail } : {}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "결제를 시작하지 못했습니다.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="chrome-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-silver-bright">배송지</h2>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm text-silver-dim">받는 분</span>
            <input
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              required
              placeholder="홍길동"
              className="mt-1.5 w-full rounded-lg border border-line bg-panel-2 px-4 py-3 text-silver-bright outline-none transition placeholder:text-silver-dim/50 focus:border-silver-dim"
            />
          </label>

          <label className="block">
            <span className="text-sm text-silver-dim">연락처</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="010-1234-5678"
              className="mt-1.5 w-full rounded-lg border border-line bg-panel-2 px-4 py-3 text-silver-bright outline-none transition placeholder:text-silver-dim/50 focus:border-silver-dim"
            />
          </label>

          <label className="block">
            <span className="text-sm text-silver-dim">주소</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="서울시 마포구 …"
              className="mt-1.5 w-full rounded-lg border border-line bg-panel-2 px-4 py-3 text-silver-bright outline-none transition placeholder:text-silver-dim/50 focus:border-silver-dim"
            />
          </label>
        </div>
      </section>

      {/* 토스 결제위젯이 그려지는 자리. 항상 화면에 있어야 합니다. */}
      <section className="chrome-border overflow-hidden rounded-2xl">
        <div id="payment-method" />
        <div id="agreement" />
      </section>

      {error && (
        <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!ready || pending}
        className="chrome-button w-full rounded-lg py-4 text-base font-semibold transition"
      >
        {pending ? "결제창을 여는 중…" : `${formatPrice(amount)} 결제하기`}
      </button>

      <p className="text-center text-xs text-silver-dim">
        토스페이먼츠 테스트 모드입니다. 실제로 결제되지 않아요.
        {customerEmail && ` · ${customerEmail}`}
      </p>
    </form>
  );
}
