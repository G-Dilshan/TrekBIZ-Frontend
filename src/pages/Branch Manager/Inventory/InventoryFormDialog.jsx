// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Filter } from "lucide-react";
// import { useSelector } from "react-redux";

// const InventoryFormDialog = ({
//   open,
//   onOpenChange,
//   selectedProductId,
//   setSelectedProductId,
//   quantity,
//   setQuantity,
//   onSubmit,
//   mode = "add",
// }) => {
//   const products = useSelector((state) => state.product.products);
//   const isEdit = mode === "edit";
//   const selectedProduct = products.find(
//     (p) => String(p.id) === String(selectedProductId)
//   );
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Inventory" : "Add Inventory"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <label htmlFor="product" className="text-right">
//               Product
//             </label>
//             {isEdit ? (
//               <Input
//                 id="product"
//                 value={selectedProduct?.name || ""}
//                 disabled
//                 className="col-span-3"
//               />
//             ) : (
//               <>
//                 {/* <Select
//                   value={selectedProductId}
//                   onValueChange={(value) => setSelectedProductId(value)}
//                 >
//                   <SelectTrigger className="col-span-3">
//                     <SelectValue placeholder="Select a product" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {products.map((product) => (
//                       <SelectItem key={product.id} value={String(product.id)}>
//                         {product.name} ({product.sku})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select> */}
//                 <Select
//                   value={selectedProductId}
//                   onValueChange={(value) => setSelectedProductId(value)}
//                 >
//                   <SelectTrigger
//                     startIcon={<Filter className="h-4 w-4 text-gray-500" />}
//                     className="w-full col-span-3"
//                   >
//                     <SelectValue placeholder="Select a Product" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Products</SelectItem>
//                     {products.map((product) => (
//                       <SelectItem key={product.id} value={product.id}>
//                         {product.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </>
//             )}
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <label htmlFor="quantity" className="text-right">
//               Quantity
//             </label>
//             <Input
//               id="quantity"
//               type="number"
//               min={1}
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//               className="col-span-3"
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={onSubmit}>
//             {isEdit ? "Update Inventory" : "Add Inventory"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default InventoryFormDialog;


import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useSelector } from "react-redux";

const InventoryFormDialog = ({
  open,
  onOpenChange,
  selectedProductId,
  setSelectedProductId,
  quantity,
  setQuantity,
  onSubmit,
  mode = "add",
}) => {
  const products = useSelector((state) => state.product.products);
  const [searchSku, setSearchSku] = useState("");
  
  const isEdit = mode === "edit";
  const selectedProduct = products.find(
    (p) => String(p.id) === String(selectedProductId)
  );

  const filteredProducts = useMemo(() => {
    if (!searchSku.trim()) return products;
    return products.filter((product) =>
      product.sku?.toLowerCase().includes(searchSku.toLowerCase())
    );
  }, [products, searchSku]);

  // Reset search when dialog closes
  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setSearchSku("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Inventory" : "Add Inventory"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="product" className="text-right">
              Product
            </label>
            {isEdit ? (
              <Input
                id="product"
                value={selectedProduct?.name || ""}
                disabled
                className="col-span-3"
              />
            ) : (
              <Select
                value={selectedProductId}
                onValueChange={(value) => setSelectedProductId(value)}
              >
                <SelectTrigger
                  startIcon={<Filter className="h-4 w-4 text-gray-500" />}
                  className="w-full col-span-3"
                >
                  <SelectValue placeholder="Select a Product" />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex items-center gap-2 px-2 py-2 border-b sticky top-0 bg-white">
                    <Search className="h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by SKU..."
                      value={searchSku}
                      onChange={(e) => setSearchSku(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <SelectItem key={product.id} value={String(product.id)}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No products found matching "{searchSku}"
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="quantity" className="text-right">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {isEdit ? "Update Inventory" : "Add Inventory"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;
