import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, title, price, image_url, seller_name, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-screen-sm mx-auto">
        {/* 배너 */}
        <div className="mx-4 mt-4 mb-2 px-4 py-3 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3">
          <span className="text-2xl">🍠</span>
          <div>
            <p className="text-sm font-semibold text-orange-700">고구마마켓에 오신 걸 환영해요!</p>
            <p className="text-xs text-orange-500 mt-0.5">우리 동네 중고거래, 지금 시작해보세요.</p>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="bg-white rounded-2xl mx-4 my-3 overflow-hidden shadow-sm">
          {!products || products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="text-6xl">🍠</span>
              <p className="text-base font-semibold text-gray-500">등록된 상품이 없습니다</p>
              <p className="text-sm text-gray-400">첫 번째 상품을 등록해보세요!</p>
              <Link
                href="/products/new"
                className="mt-2 px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors"
              >
                상품 등록하기
              </Link>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
