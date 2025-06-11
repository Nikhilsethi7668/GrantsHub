import { stripe } from "../lib/stripe.js";
import { sendEmail } from "../mailtrap/email.js";
import { User } from "../models/auth.model.js";
import { Payment } from "../models/payment.model.js";

// Create Checkout Session for Enrollment Fee
export const createCheckoutSession = async (req, res) => {
  try {
    const enrollmentFee = 12000; // 120 CAD in cents

    // Create session with proper metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Enrollment Fee",
              description: "Access the grants database.",
              images: [
                "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
              ],
            },
            unit_amount: enrollmentFee,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata: {
        userId: req.user?._id?.toString() || "guest",
      },
      payment_intent_data: {
        capture_method: "automatic",
        setup_future_usage: "off_session",
      },
      customer_email: req.user?.email,
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      message: "Error creating checkout session",
      error: error.message,
    });
  }
};

// Handle Successful Checkout
export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "Invalid user ID",
        userId: userId,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer"],
    });
    
    if (!session) {
      return res.status(400).json({ message: "Session Id is required" });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        message: "Payment not completed.",
        status: session.payment_status,
      });
    }

    const stripePaymentIntentId = session.payment_intent?.id || session.id;

    // Check if payment already exists for this intent and user
    const existingPayment = await Payment.findOne({
      userId,
      stripePaymentIntentId
    });

    if (existingPayment) {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        paymentId: stripePaymentIntentId,
        isPaid: true,
        payment: existingPayment,
      });
    }

    // Create payment record since it doesn't exist
    const payment = await Payment.create({
      userId,
      stripeCustomerId: session.customer?.id || session.customer_email,
      stripePaymentIntentId,
      stripeSessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      status: "succeeded",
      paymentMethod: session.payment_method_types?.[0] || "card",
      billingDetails: {
        name: session.customer_details?.name,
        email: session.customer_details?.email,
        address: session.customer_details?.address,
      },
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isPaid: true,
        stripeCustomerId: session.customer?.id || session.customer_email,
        lastPaymentDate: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        userId: userId,
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment successful, access granted.",
      paymentId: stripePaymentIntentId,
      isPaid: user.isPaid,
      payment: payment,
    });

  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};

// Get user's payment history
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.userId;
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "email name");

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({
      message: "Error fetching payment history",
      error: error.message,
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ _id: paymentId, userId });
    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Get user details for the email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Cancel the subscription in Stripe
    if (payment.subscriptionId) {
      await stripe.subscriptions.cancel(payment.subscriptionId);
    }

    // Update payment record
    payment.isActive = false;
    payment.status = "cancelled";
    payment.cancelledAt = new Date();
    await payment.save();

    // Update user's paid status
    await User.findByIdAndUpdate(userId, {
      isPaid: false,
    });

    // Send email to admin about subscription cancellation
    const adminEmail = process.env.ADMIN_EMAIL;
    const emailSubject = "Subscription Cancellation Notification";
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #dc3545; margin: 0;">Subscription Cancelled</h2>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">User Details:</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${user?.firstName}" "${user?.lastName} </p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
          <p style="margin: 5px 0;"><strong>User ID:</strong> ${user._id}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Payment Details:</h3>
          <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${payment._id}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${(payment.amount / 100).toFixed(2)} ${payment.currency.toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
          <p style="margin: 5px 0;"><strong>Cancelled At:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Billing Details:</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${payment.billingDetails?.name || 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${payment.billingDetails?.email || 'N/A'}</p>
          ${payment.billingDetails?.address ? `
            <p style="margin: 5px 0;"><strong>Address:</strong></p>
            <p style="margin: 5px 0;">${payment.billingDetails.address.line1 || ''}</p>
            ${payment.billingDetails.address.line2 ? `<p style="margin: 5px 0;">${payment.billingDetails.address.line2}</p>` : ''}
            <p style="margin: 5px 0;">${payment.billingDetails.address.city || ''}, ${payment.billingDetails.address.state || ''} ${payment.billingDetails.address.postal_code || ''}</p>
            <p style="margin: 5px 0;">${payment.billingDetails.address.country || ''}</p>
          ` : ''}
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      payment,
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({
      message: "Error cancelling subscription",
      error: error.message,
    });
  }
};
