import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const statusStyle: Record<string, string> = {
    판매중: "bg-orange-100 text-orange-600",
    예약중: "bg-gray-100 text-gray-600",
    판매완료: "bg-gray-100 text-gray-400",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-screen-sm mx-auto">
        {/* 상품 이미지 */}
        <div className="w-full aspect-square bg-gray-100 overflow-hidden">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">
              🍠
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="bg-white px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">
              🍠
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{product.seller_name}</p>
              <p className="text-xs text-gray-400">판매자</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[product.status] ?? "bg-gray-100 text-gray-500"}`}>
              {product.status}
            </span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-1">
            {product.title}
          </h1>
          <p className="text-xs text-gray-400 mb-4">
            {new Date(product.created_at).toLocaleDateString("ko-KR", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}
        </div>

        {/* 가격 + 채팅 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-xl font-bold text-gray-900">
            {product.price.toLocaleString("ko-KR")}원
          </p>
          <button
            disabled={product.status !== "판매중"}
            className="flex-1 max-w-[180px] py-3 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {product.status === "판매중" ? "채팅으로 거래하기" : product.status}
          </button>
        </div>

        {/* 하단 액션 */}
        <div className="px-5 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
            ← 목록으로
          </Link>
          <Link
            href={`/products/${product.id}/edit`}
            className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
          >
            수정하기
          </Link>
        </div>
      </main>
    </div>
  );
}
