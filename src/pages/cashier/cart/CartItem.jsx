// import { Card, CardContent } from "../../../components/ui/card";
// import { Badge } from "../../../components/ui/badge";
// import { Button } from "../../../components/ui/button";
// import { Minus } from "lucide-react";
// import { Plus } from "lucide-react";
// import { Trash2 } from "lucide-react";


// const CartItem = ({item,updateCartItemQuantity,removeFromCart}) => {
  
//   return (
//       <Card key={item.id} className="border-l-4 border-l-green-700">
//                 <CardContent className="p-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex-1">
//                       <h3 className="font-medium">{item.name}</h3>
//                       <p className="text-sm text-muted-foreground">{item.sku}</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="flex items-center border rounded">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0"
//                           onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
//                         >
//                           <Minus className="w-4 h-4" />
//                         </Button>

                      
//                         <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
//                           {item.quantity}
//                         </span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0"
//                           onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
//                         >
//                           <Plus className="w-4 h-4" />
//                         </Button>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium">Rs. {item.sellingPrice}</p>
//                         <p className="text-sm font-bold text-green-600">
//                           Rs. {(item.sellingPrice * item.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
//                         onClick={() => removeFromCart(item.id)}
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//   )
// }

// export default CartItem;


import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const CartItem = ({item, updateCartItemQuantity, removeFromCart}) => {
  const [quantity, setQuantity] = useState(item.quantity.toString());
  
  // Sync local state with prop changes
  useEffect(() => {
    setQuantity(item.quantity.toString());
  }, [item.quantity]);
  
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string, numbers, and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };
  
  const handleQuantityBlur = () => {
    const numValue = parseFloat(quantity);
    
    // If invalid or zero, reset to 1
    if (isNaN(numValue) || numValue <= 0) {
      setQuantity('1');
      updateCartItemQuantity(item.id, 1);
    } else {
      // Update with the valid decimal value
      const roundedValue = Math.round(numValue * 100) / 100; // Round to 2 decimals
      setQuantity(roundedValue.toString());
      updateCartItemQuantity(item.id, roundedValue);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Trigger blur event on Enter
    }
  };
  
  return (
    <Card key={item.id} className="border-l-4 border-l-green-700">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.sku}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded">
              <input
                type="text"
                inputMode="decimal"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                onKeyDown={handleKeyDown}
                className="h-8 w-20 px-3 py-1 text-sm font-medium text-center border-0 focus:outline-none focus:ring-2 focus:ring-green-600 rounded"
                placeholder="Qty"
              />
            </div>
            <div className="text-right">
              <p className="font-medium">Rs. {item.sellingPrice}</p>
              <p className="text-sm font-bold text-green-600">
                Rs. {(item.sellingPrice * item.quantity).toFixed(2)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;