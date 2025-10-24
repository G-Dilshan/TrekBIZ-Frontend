import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { getInventoryByBranch, createInventory, updateInventory, deleteInventory } from "@/Redux Toolkit/features/inventory/inventoryThunks";
import { getProductsByStore } from "@/Redux Toolkit/features/product/productThunks";
import InventoryTable from "./InventoryTable";
import InventoryFilters from "./InventoryFilters";
import InventoryFormDialog from "./InventoryFormDialog";

const Inventory = () => {
  const dispatch = useDispatch();
  const branch = useSelector((state) => state.branch.branch);
  const inventories = useSelector((state) => state.inventory.inventories);
  const products = useSelector((state) => state.product.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editInventory, setEditInventory] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);

  useEffect(() => {
    if (branch?.id) dispatch(getInventoryByBranch(branch.id));
    if (branch?.storeId) dispatch(getProductsByStore(branch.storeId));
  }, [branch, dispatch]);

  // Map inventory to table rows
  const inventoryRows = inventories.map(inv => {
    const product = products.find(p => p.id === inv.productId) || {};
    return {
      id: inv.id,
      sku: product.sku || inv.productId,
      name: product.name || "Unknown",
      quantity: inv.quantity,
      category: product.category || "",
      productId: inv.productId,
    };
  });

  // Filter inventory
  const filteredRows = inventoryRows.filter(row => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = row.sku.toLowerCase().includes(search) || row.name.toLowerCase().includes(search);
    const matchesCategory = category === "all" || row.category === category;
    return matchesSearch && matchesCategory;
  });

  // Add inventory
  const handleAddInventory = async () => {
    if (!selectedProductId || !quantity) return;
    await dispatch(createInventory({ branchId: branch.id, productId: selectedProductId, quantity: Number(quantity) }));
    setIsAddDialogOpen(false);
    setSelectedProductId("");
    setQuantity(1);
  };

  // Edit inventory
  const handleOpenEditDialog = (row) => {
    setEditInventory(row);
    setEditQuantity(row.quantity);
    setIsEditDialogOpen(true);
  };
  const handleUpdateInventory = async () => {
    if (!editInventory) return;
    await dispatch(updateInventory({ id: editInventory.id, dto: { branchId: branch.id, productId: editInventory.productId, quantity: Number(editQuantity) } }));
    setIsEditDialogOpen(false);
    setEditInventory(null);
  };

  // Delete inventory
  const handleDeleteInventory = async (id) => {
  if (!window.confirm('Are you sure you want to delete this item?')) return;

  // Dispatch delete thunk
  const result = await dispatch(deleteInventory(Number(id)));

  if (result.meta.requestStatus === 'fulfilled') {
    console.log('Inventory deleted successfully');
  } else {
    alert('Failed to delete inventory: ' + result.payload);
  }
};


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Add Inventory
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" /> Import CSV
          </Button>
        </div>
      </div>

      <InventoryFilters
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
        category={category}
        onCategoryChange={setCategory}
        products={products}
        inventoryRows={inventoryRows}
      />

      <InventoryTable
        rows={filteredRows}
        onEdit={handleOpenEditDialog}
        onDelete={handleDeleteInventory}
      />

      <InventoryFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        quantity={quantity}
        setQuantity={setQuantity}
        onSubmit={handleAddInventory}
        mode="add"
      />

      <InventoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedProductId={editInventory?.productId}
        setSelectedProductId={() => {}}
        quantity={editQuantity}
        setQuantity={setEditQuantity}
        onSubmit={handleUpdateInventory}
        mode="edit"
      />
    </div>
  );
};

export default Inventory;
