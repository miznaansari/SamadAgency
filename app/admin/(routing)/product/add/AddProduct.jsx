"use client";

import React, { useEffect } from "react";
import { addProduct } from "./actions";
import { useToast } from "@/app/admin/context/ToastProvider";
import UploadImage from "@/app/component/UploadImage";
import CategorySelect from "./CategorySelect";
import { useRouter } from "next/navigation";
import FormInput from "./FormInput";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const initialState = {
  success: false,
  errors: {},
  values: {},
};

export default function AddProductForm({ categories }) {
  const router = useRouter();

  const [state, action, pending] = React.useActionState(
    addProduct,
    initialState
  );

  const [category, setCategory] = React.useState(
    state.values?.category || ""
  );

  const [images, setImages] = React.useState([]);

  const { showToast } = useToast();

  useEffect(() => {
    if (state.success) {
      showToast({
        type: "success",
        message: "Product added successfully",
      });

      router.push(`/admin/product/add/${state.productId}/tier-price`);
    }

    if (state.errors && Object.keys(state.errors).length > 0) {
      showToast({
        type: "error",
        message: state.errors.general || "Failed to add product",
      });
    }
  }, [state.success, state.errors, showToast, router]);

  return (
    <Card className=" mx-auto">
      <CardHeader>
        <CardTitle>Add Product</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-10" noValidate>

          {/* BASIC INFORMATION */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <Separator className="mt-2" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Product Name"
                name="name"
                required
                defaultValue={state.values?.name}
                error={state.errors?.name}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>

                <CategorySelect
                  categories={categories}
                  value={category}
                  onChange={setCategory}
                  error={state.errors?.category}
                />

                <input type="hidden" name="category" value={category} />
              </div>
            </div>

            <FormInput
              label="Model"
              name="sku"
              defaultValue={state.values?.sku}
              error={state.errors?.sku}
            />

            <FormInput
              label="Description"
              name="description"
              textarea
              defaultValue={state.values?.description}
            />
          </section>

          {/* PRICING */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Pricing</h2>
              <Separator className="mt-2" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Regular Price"
                name="regular_price"
                type="number"
                required
                defaultValue={state.values?.regular_price}
                error={state.errors?.regular_price}
              />

              <FormInput
                label="Sale Price"
                name="sale_price"
                type="number"
                defaultValue={state.values?.sale_price}
              />
            </div>
          </section>

          {/* PRODUCT IMAGES */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Product Images</h2>
              <Separator className="mt-2" />
            </div>

            <UploadImage
              uploadType="productImage"
              onSuccess={(urls) => {
                setImages((prev) => [
                  ...prev,
                  ...urls.map((url) => ({
                    url,
                    is_default: prev.length === 0,
                  })),
                ]);
              }}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative rounded-md overflow-hidden border cursor-pointer transition
                      ${
                        img.is_default
                          ? "ring-2 ring-primary"
                          : "hover:border-gray-400"
                      }`}
                    onClick={() =>
                      setImages((prev) =>
                        prev.map((p, i) => ({
                          ...p,
                          is_default: i === index,
                        }))
                      )
                    }
                  >
                    <img
                      src={img.url}
                      alt="Product"
                      className="h-32 w-full object-cover"
                    />

                    {img.is_default && (
                      <span className="absolute bottom-2 left-2 text-xs bg-primary text-white px-2 py-1 rounded">
                        Primary
                      </span>
                    )}

                    <button
                      type="button"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="hidden"
              name="images"
              value={JSON.stringify(images)}
            />
          </section>

          {/* SEO */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">SEO Metadata</h2>
              <Separator className="mt-2" />
            </div>

            <FormInput
              label="Meta Title"
              name="meta_title"
              required
              defaultValue={state.values?.meta_title}
              error={state.errors?.meta_title}
            />

            <FormInput
              label="Meta Description"
              name="meta_description"
              textarea
              required
              defaultValue={state.values?.meta_description}
              error={state.errors?.meta_description}
            />

            <FormInput
              label="Focus Keyword"
              name="focus_keyword"
              required
              defaultValue={state.values?.focus_keyword}
              error={state.errors?.focus_keyword}
            />
          </section>

          {/* FOOTER */}
          <div className="pt-4 border-t flex justify-end">
            <Button disabled={pending}>
              {pending ? "Saving..." : "Save Product"}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}