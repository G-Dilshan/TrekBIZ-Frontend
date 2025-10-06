// // src/pages/cashier/order/pdf/thermalPrinterUtils.js
// import { formatDate, getPaymentModeLabel } from "../data";

// /**
//  * Print order receipt to thermal printer (80mm)
//  * @param {Object} order - Order object containing all order details
//  * @param {Function} toast - Toast notification function (optional)
//  */
// export const handlePrintThermalReceipt = async (order, toast) => {
//   try {
//     if (toast) {
//       toast({
//         title: "Printing Receipt",
//         description: "Sending to thermal printer...",
//       });
//     }

//     // Create hidden iframe for silent printing
//     const iframe = document.createElement('iframe');
//     iframe.style.display = 'none';
//     document.body.appendChild(iframe);

//     const receiptHTML = generateReceiptHTML(order);
    
//     const iframeDoc = iframe.contentWindow.document;
//     iframeDoc.open();
//     iframeDoc.write(receiptHTML);
//     iframeDoc.close();

//     // Wait for content to load, then print
//     setTimeout(() => {
//       iframe.contentWindow.focus();
//       iframe.contentWindow.print();
      
//       // Remove iframe after printing
//       setTimeout(() => {
//         document.body.removeChild(iframe);
        
//         if (toast) {
//           toast({
//             title: "Receipt Printed",
//             description: `Order #${order.id} sent to printer successfully`,
//           });
//         }
//       }, 1000);
//     }, 250);

//   } catch (error) {
//     console.error("Error printing receipt:", error);
//     if (toast) {
//       toast({
//         title: "Print Error",
//         description: "Failed to print receipt. Please try again.",
//         variant: "destructive",
//       });
//     }
//   }
// };

// /**
//  * Generate HTML for thermal receipt
//  * @param {Object} order - Order object
//  * @returns {string} Complete HTML document for receipt
//  */
// const generateReceiptHTML = (order) => {
//   const receiptDate = formatDate(order.createdAt);
//   const customerName = order.customer?.fullName || "Walk-in Customer";
//   const customerPhone = order.customer?.phone || "N/A";
//   const paymentMethod = getPaymentModeLabel(order.paymentType);
  
//   // Calculate selling price subtotal
//   const subtotal = order.items?.reduce((sum, item) => {
//     const price = item.product?.sellingPrice || 0;
//     const qty = item.quantity || 0;
//     return sum + (price * qty);
//   }, 0) || 0;

//   // Calculate marked price subtotal
//   const markedPriceSubtotal = order.items?.reduce((sum, item) => {
//     const mkprice = item.product?.mrp || 0;
//     const qty = item.quantity || 0;
//     return sum + (mkprice * qty);
//   }, 0) || 0;

//   const total = order.totalAmount || subtotal;
//   // Calculate total discount (savings)
//   const totalDiscount = markedPriceSubtotal - subtotal;

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <title>Receipt #${order.id}</title>
//       <style>
//         @media print {
//           @page {
//             size: 80mm auto;
//             margin: 0;
//           }
//           body {
//             margin: 0;
//             padding: 0;
//           }
//         }
        
//         body {
//           font-family: 'Courier New', monospace;
//           width: 80mm;
//           margin: 0 auto;
//           padding: 10px;
//           font-size: 16px;
//           line-height: 1.5;
//           font-weight: bold;
//         }
        
//         .header {
//           text-align: center;
//           margin-bottom: 12px;
//           border-bottom: 2px dashed #000;
//           padding-bottom: 12px;
//         }
        
//         .store-name {
//           font-size: 22px;
//           font-weight: bold;
//           margin-bottom: 8px;
//           text-transform: uppercase;
//         }
        
//         .store-info {
//           font-size: 14px;
//           line-height: 1.6;
//           font-weight: bold;
//         }
        
//         .receipt-info {
//           margin: 12px 0;
//           font-size: 15px;
//           border-bottom: 2px dashed #000;
//           padding-bottom: 10px;
//         }
        
//         .info-row {
//           display: flex;
//           justify-content: space-between;
//           margin: 5px 0;
//           font-weight: bold;
//         }
        
//         .label {
//           font-weight: bold;
//         }
        
//         .items {
//           margin: 12px 0;
//         }
        
//         .item {
//           margin: 10px 0;
//           padding-bottom: 8px;
//           border-bottom: 2px dotted #000;
//         }
        
//         .item-name {
//           font-weight: bold;
//           margin-bottom: 4px;
//           font-size: 16px;
//         }
        
//         .item-sku {
//           font-size: 13px;
//           color: #333;
//           margin-bottom: 4px;
//           font-weight: bold;
//         }
        
//         .item-details {
//           display: flex;
//           justify-content: space-between;
//           font-size: 15px;
//           margin-top: 4px;
//           font-weight: bold;
//         }
        
//         .item-price-row {
//           display: flex;
//           justify-content: space-between;
//           width: 100%;
//           font-weight: bold;
//         }
        
//         .item-discount-row {
//           display: flex;
//           justify-content: space-between;
//           width: 100%;
//           color: #333;
//           font-size: 14px;
//           margin-top: 3px;
//           font-weight: bold;
//         }
        
//         .totals {
//           margin: 12px 0;
//           border-top: 3px dashed #000;
//           padding-top: 10px;
//         }
        
//         .total-row {
//           display: flex;
//           justify-content: space-between;
//           margin: 5px 0;
//           font-size: 14px;
//           font-weight: bold;
//         }
        
//         .subtotal-row {
//           font-size: 15px;
//           font-weight: bold;
//         }
        
//         .grand-total {
//           font-weight: bold;
//           font-size: 16px;
//           border-top: 3px solid #000;
//           padding-top: 10px;
//           margin-top: 10px;
//         }
        
//         .savings-row {
//           font-weight: bold;
//           font-size: 16px;
//           color: #000;
//           margin-top: 8px;
//           padding: 8px;
//           background-color: #e0e0e0;
//           border-radius: 3px;
//           border: 2px solid #000;
//         }
        
//         .payment-info {
//           margin: 12px 0;
//           padding: 10px 0;
//           border-top: 2px dashed #000;
//           border-bottom: 2px dashed #000;
//           text-align: center;
//           font-size: 15px;
//           font-weight: bold;
//         }
        
//         .footer {
//           text-align: center;
//           margin-top: 15px;
//           border-top: 3px dashed #000;
//           padding-top: 12px;
//           font-size: 14px;
//           line-height: 1.7;
//           font-weight: bold;
//         }
        
//         .thank-you {
//           font-size: 18px;
//           font-weight: bold;
//           margin-bottom: 8px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <div class="store-name">Walakubura Supermarket</div>
//         <div class="store-info">
//           Anuradhapura road, Kahatagasdigiliya<br>
//           Tel: +94 25-222-8597<br>
//         </div>
//       </div>
      
//       <div class="receipt-info">
//         <div class="info-row">
//           <span class="label">Receipt #:</span>
//           <span>${order.id}</span>
//         </div>
//         <div class="info-row">
//           <span class="label">Date:</span>
//           <span>${receiptDate}</span>
//         </div>
//       </div>
      
//       <div class="items">
//         ${order.items?.map(item => {
//           const itemName = item.productName || item.product?.name || 'Product';
//           const itemSku = item.product?.sku || '';
//           const sellingPrice = item.product?.sellingPrice || 0;
//           const markedPrice = item.product?.mrp || 0;
//           const qty = item.quantity || 0;
//           const itemTotal = sellingPrice * qty;
//           const markedPriceItemTotal = markedPrice * qty;
//           const itemDiscount = (markedPrice - sellingPrice) * qty;
          
//           return `
//             <div class="item">
//               <div class="item-name">${itemName}</div>
//               <div class="item-details">
//                 <div class="item-price-row">
//                   <span>${qty} x Rs. ${sellingPrice.toFixed(2)}</span>
//                   <span>Rs. ${itemTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//               ${itemDiscount > 0 ? `
//                 <div class="item-discount-row">
//                   <span>Was: ${qty} x Rs. ${markedPrice.toFixed(2)}</span>
//                   <span>Saved: Rs. ${itemDiscount.toFixed(2)}</span>
//                 </div>
//               ` : ''}
//             </div>
//           `;
//         }).join('')}
//       </div>
      
//       <div class="totals">
//         <div class="total-row subtotal-row">
//           <span>Subtotal:</span>
//           <span>Rs. ${subtotal.toFixed(2)}</span>
//         </div>
//         <div class="total-row grand-total">
//           <span>TOTAL:</span>
//           <span>Rs. ${total.toFixed(2)}</span>
//         </div>
//         ${totalDiscount > 0 ? `
//           <div class="total-row savings-row">
//             <span>ඔබට ලැබුණු ලාභය!</span>
//             <span>Rs. ${totalDiscount.toFixed(2)}</span>
//           </div>
//         ` : ''}
//       </div>
      
//       <div class="footer">
//         <div class="thank-you">THANK YOU!</div>
//         Please visit us again<br>
//         For support: walakuburasupermarket@gmail.com
//       </div>
//     </body>
//     </html>
//   `;
// };

// /**
//  * Preview receipt in a new window (for testing)
//  * @param {Object} order - Order object
//  */
// export const previewThermalReceipt = (order) => {
//   const receiptHTML = generateReceiptHTML(order);
//   const previewWindow = window.open('', 'Receipt Preview', 'width=400,height=700');
//   previewWindow.document.write(receiptHTML);
//   previewWindow.document.close();
// };



// src/pages/cashier/order/pdf/thermalPrinterUtils.js
// import { formatDate, getPaymentModeLabel } from "../data";

// /**
//  * Print order receipt to thermal printer (80mm)
//  * @param {Object} order - Order object containing all order details
//  * @param {Function} toast - Toast notification function (optional)
//  */
// export const handlePrintThermalReceipt = async (order, toast) => {
//   try {
//     if (toast) {
//       toast({
//         title: "Printing Receipt",
//         description: "Sending to thermal printer...",
//       });
//     }

//     // Create hidden iframe for silent printing
//     const iframe = document.createElement('iframe');
//     iframe.style.display = 'none';
//     document.body.appendChild(iframe);

//     const receiptHTML = generateReceiptHTML(order);
    
//     const iframeDoc = iframe.contentWindow.document;
//     iframeDoc.open();
//     iframeDoc.write(receiptHTML);
//     iframeDoc.close();

//     // Wait for content to load, then print
//     setTimeout(() => {
//       iframe.contentWindow.focus();
//       iframe.contentWindow.print();
      
//       // Remove iframe after printing
//       setTimeout(() => {
//         document.body.removeChild(iframe);
        
//         if (toast) {
//           toast({
//             title: "Receipt Printed",
//             description: `Order #${order.id} sent to printer successfully`,
//           });
//         }
//       }, 1000);
//     }, 250);

//   } catch (error) {
//     console.error("Error printing receipt:", error);
//     if (toast) {
//       toast({
//         title: "Print Error",
//         description: "Failed to print receipt. Please try again.",
//         variant: "destructive",
//       });
//     }
//   }
// };

// /**
//  * Generate HTML for thermal receipt
//  * @param {Object} order - Order object
//  * @returns {string} Complete HTML document for receipt
//  */
// const generateReceiptHTML = (order) => {
//   const receiptDate = formatDate(order.createdAt);
//   const customerName = order.customer?.fullName || "Walk-in Customer";
//   const customerPhone = order.customer?.phone || "N/A";
//   const paymentMethod = getPaymentModeLabel(order.paymentType);
  
//   // Calculate selling price subtotal
//   const subtotal = order.items?.reduce((sum, item) => {
//     const price = item.product?.sellingPrice || 0;
//     const qty = item.quantity || 0;
//     return sum + (price * qty);
//   }, 0) || 0;

//   // Calculate marked price subtotal
//   const markedPriceSubtotal = order.items?.reduce((sum, item) => {
//     const mkprice = item.product?.mrp || 0;
//     const qty = item.quantity || 0;
//     return sum + (mkprice * qty);
//   }, 0) || 0;

//   const total = order.totalAmount || subtotal;
//   // Calculate total discount (savings)
//   const totalDiscount = markedPriceSubtotal - subtotal;

//   // Get the logo path - use absolute path from public folder
//   const logoPath = window.location.origin + '/logo.png';

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <title>Receipt #${order.id}</title>
//       <style>
//         @media print {
//           @page {
//             size: 80mm auto;
//             margin: 0;
//           }
//           body {
//             margin: 0;
//             padding: 0;
//           }
//         }
        
//         body {
//           font-family: 'Courier New', monospace;
//           width: 80mm;
//           margin: 0 auto;
//           padding: 5px;
//           font-size: 16px;
//           line-height: 0.5;
//           font-weight: bold;
//         }
        
//         .header {
//           text-align: center;
//           margin-bottom: 4px;
//           border-bottom: 2px dashed #000;
//           padding-bottom: 4px;
//         }
        
//         .store-logo {
//           max-width: 280px;
//           height: auto;
//           margin: 0 auto 4px;
//           display: block;
//         }
        
//         .store-info {
//           font-size: 14px;
//           line-height: 1.0;
//           font-weight: bold;
//         }
        
//         .receipt-info {
//           margin: 12px 0;
//           font-size: 15px;
//           border-bottom: 2px dashed #000;
//           padding-bottom: 5px;
//         }
        
//         .info-row {
//           display: flex;
//           justify-content: space-between;
//           margin: 5px 0;
//           font-weight: bold;
//         }
        
//         .label {
//           font-weight: bold;
//         }
        
//         .items {
//           margin: 12px 0;
//         }
        
//         .item {
//           margin: 10px 0;
//           padding-bottom: 4px;
//           border-bottom: 2px dotted #000;
//         }
        
//         .item-name {
//           font-weight: bold;
//           margin-bottom: 4px;
//           font-size: 16px;
//         }
        
//         .item-sku {
//           font-size: 13px;
//           color: #333;
//           margin-bottom: 4px;
//           font-weight: bold;
//         }
        
//         .item-details {
//           display: flex;
//           justify-content: space-between;
//           font-size: 15px;
//           margin-top: 2px;
//           font-weight: bold;
//         }
        
//         .item-price-row {
//           display: flex;
//           justify-content: space-between;
//           width: 100%;
//           font-weight: bold;
//         }
        
//         .item-discount-row {
//           display: flex;
//           justify-content: space-between;
//           width: 100%;
//           color: #111;
//           font-size: 14px;
//           margin-top: 3px;
//           font-weight: bold;
//         }
        
//         .totals {
          
//         }
        
//         .total-row {
//           display: flex;
//           justify-content: space-between;
//           margin: 5px 0;
//           font-size: 14px;
//           font-weight: bold;
//         }
        
//         .subtotal-row {
//           font-size: 15px;
//           font-weight: bold;
//         }
        
//         .grand-total {
//           font-weight: bold;
//           font-size: 16px;
//           border-top: 3px solid #000;
//           padding-top: 6px;
//           margin-top: 6px;
//         }
        
//         .savings-row {
//           font-weight: bold;
//           font-size: 16px;
//           color: #000;
//           margin-top: 8px;
//           padding: 8px;
//           background-color: #e0e0e0;
//           border-radius: 3px;
//           border: 2px solid #000;
//         }
        
//         .payment-info {
//           margin: 12px 0;
//           padding: 10px 0;
//           border-top: 2px dashed #000;
//           border-bottom: 2px dashed #000;
//           text-align: center;
//           font-size: 15px;
//           font-weight: bold;
//         }
        
//         .footer {
//           text-align: center;
//           margin-top: 5px;
//           border-top: 3px dashed #000;
//           padding-top: 6px;
//           font-size: 14px;
//           line-height: 1.0;
//           font-weight: bold;
//         }
        
//         .thank-you {
//           font-size: 18px;
//           font-weight: bold;
          
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <img src="${logoPath}" alt="Walakubura Supermarket" class="store-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
//         <div class="store-name" style="display: none; font-size: 22px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Walakubura Supermarket</div>
//         <div class="store-info">
//           Anuradhapura road, Kahatagasdigiliya<br>
//           Tel: +94 25-222-8597
//         </div>
//       </div>
      
//       <div class="receipt-info">
//         <div class="info-row">
//           <span class="label">Receipt #:</span>
//           <span>${order.id}</span>
//         </div>
//         <div class="info-row">
//           <span class="label">Date:</span>
//           <span>${receiptDate}</span>
//         </div>
//       </div>
      
//       <div class="items">
//         ${order.items?.map(item => {
//           const itemName = item.productName || item.product?.name || 'Product';
//           const itemSku = item.product?.sku || '';
//           const sellingPrice = item.product?.sellingPrice || 0;
//           const markedPrice = item.product?.mrp || 0;
//           const qty = item.quantity || 0;
//           const itemTotal = sellingPrice * qty;
//           const markedPriceItemTotal = markedPrice * qty;
//           const itemDiscount = (markedPrice - sellingPrice) * qty;
          
//           return `
//             <div class="item">
//               <div class="item-name">${itemName}</div>
//               <div class="item-details">
//                 <div class="item-price-row">
//                   <span>${qty} x Rs. ${sellingPrice.toFixed(2)}</span>
//                   <span>Rs. ${itemTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//               ${itemDiscount > 0 ? `
//                 <div class="item-discount-row">
//                   <span>Was: ${qty} x Rs. ${markedPrice.toFixed(2)}</span>
//                   <span>Saved: Rs. ${itemDiscount.toFixed(2)}</span>
//                 </div>
//               ` : ''}
//             </div>
//           `;
//         }).join('')}
//       </div>
      
//       <div class="totals">
//         <div class="total-row grand-total">
//           <span>TOTAL:</span>
//           <span>Rs. ${total.toFixed(2)}</span>
//         </div>
//         ${totalDiscount > 0 ? `
//           <div class="total-row savings-row">
//             <span>ඔබට ලැබුණු ලාභය!</span>
//             <span>Rs. ${totalDiscount.toFixed(2)}</span>
//           </div>
//         ` : ''}
//       </div>
      
//       <div class="footer">
//         <div class="thank-you">THANK YOU!</div>
//         Please visit us again<br>
//         For support: walakuburasupermarket@gmail.com
//       </div>
//     </body>
//     </html>
//   `;
// };

// /**
//  * Preview receipt in a new window (for testing)
//  * @param {Object} order - Order object
//  */
// export const previewThermalReceipt = (order) => {
//   const receiptHTML = generateReceiptHTML(order);
//   const previewWindow = window.open('', 'Receipt Preview', 'width=400,height=700');
//   previewWindow.document.write(receiptHTML);
//   previewWindow.document.close();
// };


import { formatDate, getPaymentModeLabel } from "../data";

export const handlePrintThermalReceipt = async (order, toast, paidAmount = null, balance = null) => {
  try {
    if (toast) {
      toast({
        title: "Printing Receipt",
        description: "Sending to thermal printer...",
      });
    }

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const receiptHTML = generateReceiptHTML(order, paidAmount, balance);
    
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(receiptHTML);
    iframeDoc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      setTimeout(() => {
        document.body.removeChild(iframe);
        
        if (toast) {
          toast({
            title: "Receipt Printed",
            description: `Order #${order.id} sent to printer successfully`,
          });
        }
      }, 1000);
    }, 250);

  } catch (error) {
    console.error("Error printing receipt:", error);
    if (toast) {
      toast({
        title: "Print Error",
        description: "Failed to print receipt. Please try again.",
        variant: "destructive",
      });
    }
  }
};

const generateReceiptHTML = (order, paidAmount, balance) => {
  const receiptDate = formatDate(order.createdAt);
  const customerName = order.customer?.fullName || "Walk-in Customer";
  const customerPhone = order.customer?.phone || "N/A";
  const paymentMethod = getPaymentModeLabel(order.paymentType);
  
  const subtotal = order.items?.reduce((sum, item) => {
    const price = item.product?.sellingPrice || 0;
    const qty = item.quantity || 0;
    return sum + (price * qty);
  }, 0) || 0;

  const markedPriceSubtotal = order.items?.reduce((sum, item) => {
    const mkprice = item.product?.mrp || 0;
    const qty = item.quantity || 0;
    return sum + (mkprice * qty);
  }, 0) || 0;

  const total = order.totalAmount || subtotal;
  const totalDiscount = markedPriceSubtotal - subtotal;
  const logoPath = window.location.origin + '/logo.png';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Receipt #${order.id}</title>
      <style>
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
        
        body {
          font-family: 'Courier New', monospace;
          width: 80mm;
          margin: 0 auto;
          padding: 5px;
          font-size: 16px;
          line-height: 0.5;
          font-weight: bold;
        }
        
        .header {
          text-align: center;
          margin-bottom: 4px;
          border-bottom: 2px dashed #000;
          padding-bottom: 4px;
        }
        
        .store-logo {
          max-width: 280px;
          height: auto;
          margin: 0 auto 4px;
          display: block;
        }
        
        .store-info {
          font-size: 14px;
          line-height: 1.0;
          font-weight: bold;
        }
        
        .receipt-info {
          margin: 12px 0;
          font-size: 15px;
          border-bottom: 2px dashed #000;
          padding-bottom: 5px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          font-weight: bold;
        }
        
        .label {
          font-weight: bold;
        }
        
        .items {
          margin: 12px 0;
        }
        
        .item {
          margin: 10px 0;
          padding-bottom: 4px;
          border-bottom: 2px dotted #000;
        }
        
        .item-name {
          font-weight: bold;
          margin-bottom: 4px;
          font-size: 16px;
        }
        
        .item-details {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          margin-top: 2px;
          font-weight: bold;
        }
        
        .item-price-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-weight: bold;
        }
        
        .item-discount-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          color: #111;
          font-size: 14px;
          margin-top: 3px;
          font-weight: bold;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          font-size: 14px;
          font-weight: bold;
        }
        
        .grand-total {
          font-weight: bold;
          font-size: 16px;
          border-top: 3px solid #000;
          padding-top: 6px;
          margin-top: 6px;
        }
        
        .savings-row {
          font-weight: bold;
          font-size: 16px;
          color: #000;
          margin-top: 8px;
          padding: 8px;
          background-color: #e0e0e0;
          border-radius: 3px;
          border: 2px solid #000;
        }
        
        .payment-section {
          margin-top: 12px;
          border-top: 2px dashed #000;
          padding-top: 8px;
        }
        
        .payment-row {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          font-size: 15px;
          font-weight: bold;
        }
        
        .paid-amount {
          font-size: 16px;
          font-weight: bold;
        }
        
        .balance-row {
          font-weight: bold;
          font-size: 18px;
          color: #000;
          margin-top: 8px;
          padding: 8px;
          background-color: #d4edda;
          border-radius: 3px;
          border: 2px solid #000;
        }
        
        .footer {
          text-align: center;
          margin-top: 5px;
          border-top: 3px dashed #000;
          padding-top: 6px;
          font-size: 14px;
          line-height: 1.0;
          font-weight: bold;
        }
        
        .thank-you {
          font-size: 18px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${logoPath}" alt="Walakubura Supermarket" class="store-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
        <div class="store-name" style="display: none; font-size: 22px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Walakubura Supermarket</div>
        <div class="store-info">
          Anuradhapura road, Kahatagasdigiliya<br>
          Tel: +94 25-222-8597
        </div>
      </div>
      
      <div class="receipt-info">
        <div class="info-row">
          <span class="label">Receipt #:</span>
          <span>${order.id}</span>
        </div>
        <div class="info-row">
          <span class="label">Date:</span>
          <span>${receiptDate}</span>
        </div>
      </div>
      
      <div class="items">
        ${order.items?.map(item => {
          const itemName = item.productName || item.product?.name || 'Product';
          const sellingPrice = item.product?.sellingPrice || 0;
          const markedPrice = item.product?.mrp || 0;
          const qty = item.quantity || 0;
          const itemTotal = sellingPrice * qty;
          const itemDiscount = (markedPrice - sellingPrice) * qty;
          
          return `
            <div class="item">
              <div class="item-name">${itemName}</div>
              <div class="item-details">
                <div class="item-price-row">
                  <span>${qty} x Rs. ${sellingPrice.toFixed(2)}</span>
                  <span>Rs. ${itemTotal.toFixed(2)}</span>
                </div>
              </div>
              ${itemDiscount > 0 ? `
                <div class="item-discount-row">
                  <span>Saved: Rs. ${itemDiscount.toFixed(2)}</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
      
      <div class="totals">
        <div class="total-row grand-total">
          <span>TOTAL:</span>
          <span>Rs. ${total.toFixed(2)}</span>
        </div>
        ${totalDiscount > 0 ? `
          <div class="total-row savings-row">
            <span>ඔබට ලැබුණු ලාභය!</span>
            <span>Rs. ${totalDiscount.toFixed(2)}</span>
          </div>
        ` : ''}
      </div>
      
      ${paidAmount !== null ? `
        <div class="payment-section">
          <div class="payment-row paid-amount">
            <span>Paid Amount:</span>
            <span>Rs. ${paidAmount.toFixed(2)}</span>
          </div>
          ${balance !== null && balance > 0 ? `
            <div class="payment-row balance-row">
              <span>Balance :</span>
              <span>Rs. ${balance.toFixed(2)}</span>
            </div>
          ` : ''}
        </div>
      ` : ''}
      
      <div class="footer">
        <div class="thank-you">THANK YOU!</div>
        Please visit us again<br>
        For support: walakuburasupermarket@gmail.com
      </div>
    </body>
    </html>
  `;
};

export const previewThermalReceipt = (order, paidAmount = null, balance = null) => {
  const receiptHTML = generateReceiptHTML(order, paidAmount, balance);
  const previewWindow = window.open('', 'Receipt Preview', 'width=400,height=700');
  previewWindow.document.write(receiptHTML);
  previewWindow.document.close();
};