"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  CheckIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/admin/context/ToastProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CategoryShowProduct({ categories }) {
  const router = useRouter();
  const { reloadCart } = useCart();
  const { showToast } = useToast();

  const [openCategory, setOpenCategory] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(null);
  const [qty, setQty] = useState({});
  const [adding, setAdding] = useState({}); // 👈 loader state

  const fetchProducts = async (slug) => {
    if (products[slug]) return;

    setLoading(slug);

    const res = await fetch(`/api/category-products?category=${slug}`);
    const data = await res.json();

    setProducts((prev) => ({
      ...prev,
      [slug]: data,
    }));

    setLoading(null);
  };

  const toggleCategory = (slug) => {
    const newOpen = openCategory === slug ? null : slug;

    setOpenCategory(newOpen);

    if (newOpen) {
      fetchProducts(slug);
    }
  };

  const handleQtyChange = (id, value) => {
    setQty((prev) => ({
      ...prev,
      [id]: Math.max(1, value),
    }));
  };

  const handleAddToCart = async (product) => {
    const quantity = qty[product.id] || 1;

    // start loader
    setAdding((prev) => ({ ...prev, [product.id]: true }));

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (res.status === 401) {
        showToast({
          type: "error",
          message: "Please login to add to cart",
        });
        router.push("/auth/login");
        return;
      }

      if (!res.ok) {
        showToast({
          type: "error",
          message: "Failed to add to cart",
        });
        return;
      }

      showToast({
        type: "success",
        message: "Added to cart",
      });

      await reloadCart();
    } catch (err) {
      showToast({
        type: "error",
        message: "Something went wrong",
      });
    } finally {
      // stop loader
      setAdding((prev) => ({ ...prev, [product.id]: false }));
    }
  };
useEffect(() => {
  const preloadProducts = async () => {
    if (!categories?.length) return;

    try {
      const results = await Promise.all(
        categories.map(async (cat) => {
          const res = await fetch(
            `/api/category-products?category=${cat.slug}`
          );
          const data = await res.json();

          return {
            slug: cat.slug,
            products: data,
          };
        })
      );

      const formatted = {};
      results.forEach((item) => {
        formatted[item.slug] = item.products;
      });

      setProducts(formatted);
    } catch (err) {
      console.error("Preload failed", err);
    }
  };

  preloadProducts();
}, [categories]);
  return (
    <div className="max-w-7xl mx-auto bg-white px-4 py-10">
      <div className="space-y-3">
        {categories.map((cat) => {
          const active = openCategory === cat.slug;

          return (
            <div
              key={cat.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* HEADER */}
              <button
                onClick={() => toggleCategory(cat.slug)}
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <span className="font-semibold text-gray-800">
                  {cat.name}
                </span>

                <motion.div
                  animate={{ rotate: active ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="border-t border-gray-200"
                  >
                    {/* SKELETON */}
                    {loading === cat.slug && (
                      <div className="p-6 space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-8 bg-gray-200 rounded animate-pulse"
                          />
                        ))}
                      </div>
                    )}

                    {/* EMPTY */}
                    {products[cat.slug] &&
                      products[cat.slug].length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                          <InboxIcon className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="text-sm font-medium">
                            No products available in this category
                          </p>
                        </div>
                      )}

                    {/* PRODUCTS */}
                    {products[cat.slug] &&
                      products[cat.slug].length > 0 && (
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-3 text-left">S.No</th>
                              <th className="p-3 text-left">Item</th>
                              <th className="p-3 text-left">Name</th>
                              <th className="p-3 text-left">Qty</th>
                              <th className="p-3 text-left">Add</th>
                            </tr>
                          </thead>

                          <tbody>
                            {products[cat.slug].map((product, index) => {
                              const image =
                                product.images?.[0]?.image_url;

                              const isAdding = adding[product.id];

                              return (
                                <tr
                                  key={product.id}
                                  className="border-t border-gray-100"
                                >
                                  <td className="p-3">{index + 1}</td>

                                  <td className="p-3">
                                    <img
                                      src={image}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  </td>
<Link href={`/product/${product.slug}`}>
                                  <td className="p-3 font-medium">
                                    {product.name}
                                  </td>
                                  </Link>

                                  <td className="p-3">
                                    <input
                                      type="number"
                                      min={1}
                                      value={qty[product.id] || 1}
                                      onChange={(e) =>
                                        handleQtyChange(
                                          product.id,
                                          Number(e.target.value)
                                        )
                                      }
                                      className="w-16 border text-base rounded px-2 py-1"
                                    />
                                  </td>

                                  <td className="p-3">
                                    <button
                                      onClick={() =>
                                        handleAddToCart(product)
                                      }
                                      disabled={isAdding}
                                      className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded disabled:opacity-50"
                                    >
                                      {isAdding ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <CheckIcon className="w-4 h-4" />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}