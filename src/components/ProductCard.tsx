import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  seller_name: string;
  status: string;
  created_at: string;
};

function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`;
}

function formatTime(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

const statusStyle: Record<string, string> = {
  "예약중": "bg-gray-700 text-white",
  "판매완료": "bg-gray-400 text-white",
};

export default function ProductCard({ product }: { product: Product }) {
  const isSold = product.status !== "판매중";

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex gap-4 px-4 py-4 hover:bg-orange-50/50 transition-colors border-b border-gray-100 last:border-b-0"
    >
      {/* 썸네일 */}
      <div className="relative w-[100px] h-[100px] rounded-2xl overflow-hidden bg-gray-100 shrink-0">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className={`w-full h-full object-cover ${isSold ? "brightness-50" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-orange-50">
            🍠
          </div>
        )}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusStyle[product.status] ?? "bg-gray-500 text-white"}`}>
              {product.status}
            </span>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">
        <div>
          <p className={`text-[15px] font-medium leading-snug line-clamp-2 ${isSold ? "text-gray-400" : "text-gray-800"}`}>
            {product.title}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {product.seller_name} · {formatTime(product.created_at)}
          </p>
        </div>
        <p className={`text-[15px] font-bold mt-2 ${isSold ? "text-gray-400" : "text-gray-900"}`}>
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
