import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, title, price, description, image_url, seller_name, status")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return <EditForm product={product} />;
}
