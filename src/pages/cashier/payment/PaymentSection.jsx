import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../../../components/ui/use-toast";
import {
  holdOrder,
  selectCartItems,
  selectSelectedCustomer,
  selectTotal,
} from "../../../Redux Toolkit/features/cart/cartSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { CreditCard, Pause } from "lucide-react";

const PaymentSection = ({
  setShowPaymentDialog,
  setPaidAmount: setParentPaidAmount,
  setBalance: setParentBalance,
}) => {
  const cartItems = useSelector(selectCartItems);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const total = useSelector(selectTotal);

  const [paidAmount, setPaidAmount] = useState("");
  const { toast } = useToast();
  const dispatch = useDispatch();

  const balance = paidAmount ? parseFloat(paidAmount) - total : 0;

  // Reset paidAmount when total becomes 0 (order completed)
  useEffect(() => {
    if (total === 0) {
      setPaidAmount("");
    }
  }, [total]);

  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before proceeding to payment",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCustomer) {
      toast({
        title: "Customer Required",
        description: "Please select a customer before proceeding to payment",
        variant: "destructive",
      });
      return;
    }

    if (!paidAmount || parseFloat(paidAmount) < total) {
      toast({
        title: "Insufficient Payment",
        description: "Paid amount must be at least the total amount",
        variant: "destructive",
      });
      return;
    }

    if (setParentPaidAmount) {
      setParentPaidAmount(parseFloat(paidAmount));
    }
    if (setParentBalance) {
      setParentBalance(balance);
    }

    setShowPaymentDialog(true);
  };

  const handleHoldOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "No items in cart to hold",
        variant: "destructive",
      });
      return;
    }

    dispatch(holdOrder());
    setPaidAmount(""); // Reset paid amount when holding order

    toast({
      title: "Order On Hold",
      description: "Order placed on hold",
    });
  };

  const handleQuickAmount = (amount) => {
    setPaidAmount(amount.toString());
  };

  const handlePaidAmountChange = (e) => {
    setPaidAmount(e.target.value);
  };

  // ✅ Handle Enter key in paid amount input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePayment();
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col justify-start">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            Rs. {total.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
        </div>

        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div>
            <label className="text-sm font-medium mb-2 block">Amount Paid</label>
            <Input
              type="number"
              placeholder="0.00"
              value={paidAmount}
              onChange={handlePaidAmountChange}
              onKeyDown={handleKeyDown} // ✅ ENTER key triggers payment
              className="text-lg font-semibold"
              step="0.01"
              min="0"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 2000, 5000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(amount)}
                className="text-xs"
              >
                {amount}
              </Button>
            ))}
          </div>

          {paidAmount && (
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Balance:</span>
                <span
                  className={`text-lg font-bold ${
                    balance >= 0
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Rs. {balance.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            className="w-full py-3 text-lg font-semibold"
            onClick={handlePayment}
            disabled={cartItems.length === 0}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Process Payment
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleHoldOrder}
            disabled={cartItems.length === 0}
          >
            <Pause className="w-4 h-4 mr-2" />
            Hold Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
