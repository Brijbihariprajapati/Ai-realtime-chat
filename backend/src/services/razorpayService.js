import crypto from "crypto";
import Razorpay from "razorpay";

class RazorpayService {
  getClient() {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amountPaise, receipt) {
    try {
      return await this.getClient().orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt,
        payment_capture: 1,
      });
    } catch (error) {
      throw new Error(
        error?.error?.description || error.message || "Failed to create order"
      );
    }
  }

  verifySignature(orderId, paymentId, signature) {
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return expected === signature;
  }
}

export default new RazorpayService();
