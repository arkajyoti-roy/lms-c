import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import { BASE_URL } from "./url"; // Ensure BASE_URL is correctly set

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { data, isLoading, isSuccess, isError, error }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession({ courseId: String(courseId) }); // Ensure courseId is passed as a string
  };

  useEffect(() => {
    if (isSuccess) {
      console.log('Server Response:', data); // Log the server response for debugging
      if (data?.orderId) {
        // Trigger Razorpay payment
        const options = {
          key: data.key, // Razorpay key
          amount: data.amount,
          currency: data.currency,
          name: data.courseTitle,
          order_id: data.orderId,
          handler: function (response) {
            // Handle payment success
            console.log('Payment successful:', response);
            // Redirect to payment verification endpoint
            axios.post(`${BASE_URL}/purchase/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(res => {
                const data = res.data;
                if (data.success) {
                  toast.success("Payment successful!");
                  // Log response instead of redirecting for now
                  console.log('Payment successful:', response);
                  console.log('Payment verification response:', data);
                  window.location.href = `/course-progress/${courseId}`; // Ensure this line is commented out or removed
                } else {
                  toast.error("Payment verification failed!");
                }
              })
              .catch(error => {
                console.error('Payment verification failed:', error);
                toast.error("Payment verification failed!");
              });
          },
          prefill: {
            name: "Your Name",
            email: "youremail@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#3399cc"
          }
        };

        console.log('Razorpay options:', options); // Log the Razorpay options for debugging

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response){
            console.error('Payment failed:', response.error);
            toast.error("Payment failed!");
        });
        razorpay.open();
      } else {
        toast.error("Invalid response from server.");
      }
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to create checkout session.");
    }
  }, [data, isSuccess, isError, error]);

  return (
    <Button disabled={isLoading} onClick={purchaseCourseHandler} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

// Add PropTypes validation
BuyCourseButton.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default BuyCourseButton;
// Compare this snippet from server/controllers/coursePurchase.controller.js: