

import DiscountSection from "./DiscountSection";
import NoteSection from "./NoteSection";
import CustomerSection from "./CustomerSection";
import PaymentSection from "./PaymentSection";

const CustomerPaymentSection = ({ setShowCustomerDialog, setShowPaymentDialog }) => {



  return (
    <div className="w-1/5 flex flex-col bg-card overflow-y-auto">
      {/* Customer Section */}
      {/* <CustomerSection setShowCustomerDialog={setShowCustomerDialog} /> */}

      {/* Payment Section */}
      <PaymentSection setShowPaymentDialog={setShowPaymentDialog}/>

      {/* Discount Section */}
      <DiscountSection />

      {/* Customer Section */}
      <CustomerSection setShowCustomerDialog={setShowCustomerDialog} />

      {/* Discount Section
      <DiscountSection /> */}

      {/* Note Section */}
      {/* <NoteSection /> */}

    </div>
  );
};

export default CustomerPaymentSection;
