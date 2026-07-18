import User from "../models/User.js";
import Payment from "../models/Payment.js";
import razorpayService from "../services/razorpayService.js";
import { getIO } from "../socket/io.js";

class PaymentController {
  createOrder = async (req, res) => {
    try {
      if (req.user.isPremium) {
        return res.status(400).json({
          success: false,
          message: "You already have premium access",
        });
      }

      const amountInr = Number(process.env.PREMIUM_AMOUNT_INR) || 49;
      const amountPaise = amountInr * 100;
      const receipt = `prem_${Date.now()}`;
      const order = await razorpayService.createOrder(amountPaise, receipt);

      await Payment.create({
        user: req.user._id,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: "created",
      });

      return res.status(201).json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          amountInr,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
          user: {
            name: req.user.name,
            email: req.user.email,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create payment order",
      });
    }
  };

  verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Missing payment verification fields",
        });
      }

      const payment = await Payment.findOne({
        razorpayOrderId: razorpay_order_id,
        user: req.user._id,
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const isValid = razorpayService.verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        payment.status = "failed";
        await payment.save();

        return res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
      }

      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = "paid";
      await payment.save();

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { isPremium: true },
        { new: true }
      ).select("-__v");

      const io = getIO();
      if (io) {
        io.emit("premium:unlocked", {
          userId: user._id.toString(),
          name: user.name,
          isPremium: true,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified. Premium unlocked.",
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isPremium: user.isPremium,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Payment verification failed",
      });
    }
  };
}

export default new PaymentController();
