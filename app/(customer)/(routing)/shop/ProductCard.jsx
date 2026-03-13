"use client";

import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";

import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const { reloadCart } = useCart();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleAddToCart = async () => {
    if (!selectedSize) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedSize,
          quantity: qty,
        }),
      });

      if (!res.ok) throw new Error();

      reloadCart();
      setOpen(false);
      setSelectedSize(null);
      setQty(1);
    } finally {
      setLoading(false);
    }
  };

  const badge = product.badge || "NEW";

  const badgeColors = {
    HOT: "bg-red-500 text-white",
    NEW: "bg-green-400 text-black",
    BESTSELLER: "bg-[#347eb3] text-white",
    LIMITED: "bg-yellow-400 text-black",
  };

  const Content = () => (
    <div className="space-y-6 p-5">

      <div className="flex gap-4">
        <img
          src={product.image || "/images/not-found.png"}
          className="w-20 h-20 rounded-xl object-cover border border-gray-200"
        />

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-black">
            {product.name}
          </h3>

          <p className="text-gray-500 text-sm font-semibold line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-3 h-3" />
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <span className="text-black font-semibold">
              ₹{product.price}
            </span>

            {product.regular_price && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.regular_price}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SIZE */}
      <div>
        <p className="text-sm mb-2 text-black">Select Size</p>

        <div className="flex gap-2 flex-wrap">
          {product.variants?.map((v) => {
            const active = selectedSize === v.id;

            return (
              <button
                key={v.id}
                onClick={() => setSelectedSize(v.id)}
                className={`px-4 py-2 rounded-lg text-sm border transition
                  ${
                    active
                      ? "bg-[#347eb3] text-white border-[#347eb3]"
                      : "border-gray-300 text-gray-600 hover:border-[#347eb3]"
                  }
                `}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      {/* QTY */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQty((p) => Math.max(1, p - 1))}
          className="w-9 h-9 rounded-lg bg-gray-200"
        >
          -
        </button>

        <span className="text-black">{qty}</span>

        <button
          onClick={() => setQty((p) => p + 1)}
          className="w-9 h-9 rounded-lg bg-gray-200"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || loading}
        className="w-full py-3 rounded-xl bg-[#347eb3] text-white font-semibold disabled:bg-gray-300 transition"
      >
        {loading ? "Adding..." : "Add To Cart"}
      </button>
    </div>
  );

  return (
    <>
      {/* CARD */}

      <div className="group relative rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition">

        <Link href={`/product/${product.slug}`}>

          <div className="relative">

            <img
              src={product.image || "/images/not-found.png"}
              className="w-full aspect-square object-cover"
            />

            {/* BADGE */}
            <span
              className={`absolute top-3 left-3 text-xs px-2 py-1 rounded font-semibold ${badgeColors[badge]}`}
            >
              {badge}
            </span>

            {/* WISHLIST */}
            <button
              onClick={(e) => e.preventDefault()}
              className="absolute top-3 right-3 bg-white shadow p-1.5 rounded-full"
            >
              <HeartIcon className="w-4 h-4 text-gray-700" />
            </button>

            {/* DESKTOP ADD CART */}
            {!isMobile && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                  }}
                  className="flex items-center gap-2 bg-[#347eb3] text-white px-4 py-2 rounded-full text-xs font-semibold"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  ADD TO CART
                </button>

              </div>
            )}
          </div>

        </Link>

        {/* CONTENT */}

        <div className="p-3 space-y-1">

          <p className="text-[10px] uppercase text-[#347eb3]">
            {product.category || "ACCESSORIES"}
          </p>

          <h3 className="text-sm font-semibold text-black line-clamp-1">
            {product.name}
          </h3>

          <p className="text-gray-500 text-sm font-semibold line-clamp-1">
            {product.description}
          </p>

          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-3 h-3" />
            ))}

            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews || 0})
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">

            <span className="text-black font-semibold">
              ₹{product.price}
            </span>

            {product.regular_price && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.regular_price}
              </span>
            )}

          </div>

        </div>

        {/* MOBILE ADD CART */}

        {isMobile && (
          <button
            onClick={() => setOpen(true)}
            className="w-full py-2 bg-[#347eb3] text-white text-sm font-semibold"
          >
            Add to Cart
          </button>
        )}

      </div>

      {/* MODAL */}

      {isMobile ? (
        <SwipeableDrawer height={"60vh"} open={open} onClose={() => setOpen(false)}>
          <Content />
        </SwipeableDrawer>
      ) : (
        open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-2xl"
            >
              <Content />
            </div>
          </div>
        )
      )}
    </>
  );
}