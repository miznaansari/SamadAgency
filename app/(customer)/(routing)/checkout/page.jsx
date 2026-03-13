import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import CheckoutFlow from "./CheckoutFlow";


export default async function Page() {

  const user = await requireUser();
  if (!user) return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center max-w-md p-8 border border-white/20 rounded-2xl bg-white/5 backdrop-blur">
        
        <div className="flex justify-center mb-6">
          <LockClosedIcon className="w-16 h-16 text-white" />
        </div>

        <h1 className="text-2xl font-semibold mb-3">
          Login Required
        </h1>

        <p className="text-white/70 mb-6">
          Please login first to access this page.
        </p>

        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Go to Login
        </Link>

      </div>
    </div>
    </>
  );

  const customer = await prisma.customer_list.findUnique({
    where: { id: user.id },
    select: {
      customer_group_id: true,
      price_tier: true,
    },
  });

  const addresses = await prisma.customer_address.findMany({
    where: {
      customer_list_id: user.id,
      is_deleted: false,
    },
    orderBy: { created_at: "desc" },
  });

  const cartData = await prisma.customer_cart.findMany({
    where: {
      customer_list_id: user.id,
      is_deleted: false,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
      variant: true,
    },
  });

  const pricedCartData = cartData.map((item) => {

    const p = item.product;

    const price =
      p.sale_price ??
      p.regular_price;

    return {
      id: item.id,
      quantity: item.quantity,
      product: {
        id: p.id,
        name: p.name,
        sku: p.sku,
        images: p.images,
        size: item.variant?.size,
        price: Number(price),
      },
    };
  });

  return (
    <CheckoutFlow
      addresses={addresses}
      cartData={pricedCartData}
    />
  );
}