"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    image_url: "",
    seller_name: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "상품명을 입력해주세요.";
    if (!form.price.trim()) next.price = "가격을 입력해주세요.";
    else if (isNaN(Number(form.price)) || Number(form.price) < 0) next.price = "올바른 가격을 입력해주세요.";
    if (!form.seller_name.trim()) next.seller_name = "판매자 이름을 입력해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("products").insert({
      title: form.title.trim(),
      price: Number(form.price),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      seller_name: form.seller_name.trim(),
    });

    setLoading(false);
    if (error) {
      setErrors({ submit: "저장 중 오류가 발생했습니다. 다시 시도해주세요." });
      return;
    }
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-screen-sm mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-base font-bold text-gray-900">상품 등록</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-screen-sm mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* 상품명 */}
          <Field label="상품명" required error={errors.title}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="상품명을 입력하세요"
              className={inputClass(!!errors.title)}
            />
          </Field>

          {/* 가격 */}
          <Field label="가격" required error={errors.price}>
            <div className="relative">
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min={0}
                className={inputClass(!!errors.price) + " pr-8"}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </Field>

          {/* 상품 설명 */}
          <Field label="상품 설명" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="상품 상태, 구매 시기, 사용감 등을 자세히 적어주세요"
              rows={5}
              className={inputClass(false) + " resize-none leading-relaxed"}
            />
          </Field>

          {/* 이미지 URL */}
          <Field label="이미지 URL" error={errors.image_url}>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass(!!errors.image_url)}
            />
            {form.image_url && (
              <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image_url}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </Field>

          {/* 판매자 이름 */}
          <Field label="판매자 이름" required error={errors.seller_name}>
            <input
              name="seller_name"
              value={form.seller_name}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              className={inputClass(!!errors.seller_name)}
            />
          </Field>

          {/* 서버 에러 */}
          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 py-3.5 text-center text-sm font-bold text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 text-sm font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "등록 중..." : "등록하기"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-colors",
    "placeholder:text-gray-300",
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-400"
      : "border-gray-200 bg-white focus:border-orange-400",
  ].join(" ");
}

function Field({
  label, required, error, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}
