"use client";

import { useEffect, useState } from "react";

export default function WhatsAppPage() {
  const [status, setStatus] = useState(null);

  async function loadStatus() {
    const res = await fetch("/admin/api/whatsapp/status");
    const data = await res.json();
    setStatus(data);
  }

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="p-10">Loading...</div>;

  if (status.is_connected) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-green-600">
          WhatsApp Connected
        </h1>

        <p className="mt-4">
          Number: +{status.phone_number}
        </p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Connect WhatsApp
      </h1>

      {status.last_qr ? (
        <img
          src={status.last_qr}
          className="w-72 border rounded-lg"
        />
      ) : (
        <p>Generating QR...</p>
      )}
    </div>
  );
}