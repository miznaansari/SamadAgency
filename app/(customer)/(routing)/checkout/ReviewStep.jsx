import { useToast } from "@/app/admin/context/ToastProvider";

export default function ReviewStep({ cartData, onNext, onBack }) {
  const { showToast } = useToast();

  const handleContinue = () => {
    if (!cartData || cartData.length === 0) {
      showToast("Please add at least one item", "error");
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">

      <h2 className="text-lg font-semibold mb-6 text-black">
        REVIEW YOUR ORDER
      </h2>

      <div className="space-y-4">

        {cartData.map((item) => (

          <div
            key={item.id}
            className="flex items-center gap-4 border border-gray-200 rounded-xl p-4"
          >

            <img
              src={item.product.images?.[0]?.image_url}
              className="w-16 h-16 object-cover rounded"
            />

            <div className="flex-1">

              <p className="font-semibold text-black">
                {item.product.name}
              </p>
                
<p>Quantity: {item.quantity} </p>
            

            </div>

      
          </div>

        ))}

      </div>


      {(!cartData || cartData.length === 0) && (
        <>
          <div className="text-red-500 text-center mt-6 font-medium">
            Please add item for proceed
          </div>
          <a
            href="http://localhost:3000/shop"
            className="block w-full mt-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg text-center transition"
          >
            Shop Now
          </a>
        </>
      )}

      <button
        onClick={handleContinue}
        disabled={!cartData || cartData.length === 0}
        className="w-full mt-6 bg-[#347eb3] hover:bg-[#0284c7] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        CONTINUE TO ORDER
      </button>

    </div>
  );
}