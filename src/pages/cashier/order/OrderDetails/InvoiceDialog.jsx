import React, { useState, useEffect } from "react";
import { handleDownloadOrderPDF } from "../pdf/pdfUtils";
import { handlePrintThermalReceipt } from "../pdf/thermalPrinterUtils";
import { useToast } from "../../../../components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, PrinterIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import OrderDetails from "./OrderDetails";
import { resetOrder } from "../../../../Redux Toolkit/features/cart/cartSlice";

const InvoiceDialog = ({ showInvoiceDialog, setShowInvoiceDialog, paidAmount, balance }) => {
  const { selectedOrder } = useSelector((state) => state.order);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [isPrinted, setIsPrinted] = useState(false);

  const handlePrintInvoice = async () => {
    if (!selectedOrder) return;

    try {
      await handlePrintThermalReceipt(selectedOrder, toast, paidAmount, balance);
      toast({
        title: "Printed",
        description: "Invoice printed successfully",
      });
      setIsPrinted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to print invoice",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedOrder) return;

    try {
      await handleDownloadOrderPDF(selectedOrder, toast);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const startNewOrder = () => {
    if (!isPrinted) {
      toast({
        title: "Action Denied",
        description: "You must print the invoice before starting a new order",
        variant: "destructive",
      });
      return;
    }

    setShowInvoiceDialog(false);
    dispatch(resetOrder());
    toast({
      title: "Order Completed",
      description: "You can now start a new order",
    });

    window.location.reload();
  };

  // Handle Enter key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && isPrinted) {
        startNewOrder();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPrinted]); // Run effect whenever isPrinted changes

  return (
    <Dialog
      open={showInvoiceDialog}
      onOpenChange={() => {}}
    >
      {selectedOrder && (
        <DialogContent className="w-5xl">
          <DialogHeader>
            <DialogTitle>Order Details - Invoice</DialogTitle>
          </DialogHeader>

          <OrderDetails selectedOrder={selectedOrder} />

          <DialogFooter className="gap-2 sm:gap-0 space-x-3">
            <Button variant="outline" onClick={handlePrintInvoice}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
            
            <Button variant="secondary" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>

            <Button onClick={startNewOrder} disabled={!isPrinted}>
              Start New Order
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default InvoiceDialog;
