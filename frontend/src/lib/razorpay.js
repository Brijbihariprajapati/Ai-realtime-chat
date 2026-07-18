"use client";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(options) {
  const ready = await loadRazorpayScript();
  if (!ready || !window.Razorpay) {
    throw new Error("Failed to load payment checkout");
  }

  const rzp = new window.Razorpay(options);
  rzp.open();
  return rzp;
}
