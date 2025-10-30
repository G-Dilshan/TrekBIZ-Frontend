import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Barcode, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsByStore,
  searchProducts,
} from "../../../Redux Toolkit/features/product/productThunks";
import { getBranchById } from "../../../Redux Toolkit/features/branch/branchThunks";
import { clearSearchResults } from "@/Redux Toolkit/features/product/productSlice";
import { addToCart } from "../../../Redux Toolkit/features/cart/cartSlice";
import { getInventoryByBranch } from "../../../Redux Toolkit/features/inventory/inventoryThunks";

// 🆕 If your order slice exists, import it to watch for payment success
// import { resetPaymentStatus } from "@/Redux Toolkit/features/order/orderSlice";

const ProductSection = ({ searchInputRef }) => {
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);
  const { inventories } = useSelector((state) => state.inventory);
  const { products, searchResults, loading, error: productsError } =
    useSelector((state) => state.product);

  // 🆕 Payment success flag from your order slice
  const { paymentSuccess } = useSelector((state) => state.order || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [isBarcodeMode, setIsBarcodeMode] = useState(false);
  const { toast } = useToast();

  // ✅ Helper to filter products that exist in inventory
  const filterProductsByInventory = (productList) => {
    if (!inventories || inventories.length === 0) return productList;
    const inventoryProductIds = inventories.map(
      (inv) => inv.product?.id || inv.productId
    );
    return productList.filter((p) => inventoryProductIds.includes(p.id));
  };

  // ✅ Updated getDisplayProducts
  const getDisplayProducts = () => {
    let baseList =
      searchTerm.trim() && searchResults.length > 0
        ? searchResults
        : products || [];
    return filterProductsByInventory(baseList);
  };

  // ✅ Fetch branch, products, and inventory initially
  useEffect(() => {
    const fetchData = async () => {
      if (branch?.storeId && localStorage.getItem("jwt")) {
        try {
          await dispatch(getProductsByStore(branch.storeId)).unwrap();
          await dispatch(getInventoryByBranch(branch.id)).unwrap();
        } catch (error) {
          console.error("Fetch failed:", error);
          toast({
            title: "Error",
            description: error || "Failed to fetch data",
            variant: "destructive",
          });
        }
      } else if (
        userProfile?.branchId &&
        localStorage.getItem("jwt") &&
        !branch
      ) {
        try {
          await dispatch(
            getBranchById({
              id: userProfile.branchId,
              jwt: localStorage.getItem("jwt"),
            })
          ).unwrap();
        } catch (error) {
          console.error("Failed to fetch branch:", error);
          toast({
            title: "Error",
            description: "Failed to load branch information",
            variant: "destructive",
          });
        }
      }
    };
    fetchData();
  }, [dispatch, branch, userProfile, toast]);

  // ✅ Auto-refresh inventory after successful payment
  useEffect(() => {
    if (paymentSuccess && branch?.id) {
      dispatch(getInventoryByBranch(branch.id))
        .unwrap()
        .then(() => {
          toast({
            title: "Inventory Updated",
            description: "Stock levels refreshed after payment.",
          });
        })
        .catch((error) => {
          console.error("Failed to refresh inventory:", error);
        });
      // Optionally reset payment status after refresh
      // dispatch(resetPaymentStatus());
    }
  }, [paymentSuccess, branch, dispatch, toast]);

  // ✅ Barcode parser
  const parseScaleBarcode = (barcode) => {
    const cleanBarcode = barcode.trim();
    if (cleanBarcode.length === 10 && /^\d+$/.test(cleanBarcode)) {
      const productCode = cleanBarcode.substring(0, 5);
      const weightValue = cleanBarcode.substring(5);
      const weight = parseInt(weightValue) / 1000;
      if (weight > 0 && weight < 100) {
        return {
          canParseAsScale: true,
          productCode,
          weight,
          rawBarcode: cleanBarcode,
        };
      }
    }
    if (cleanBarcode.length === 13 && cleanBarcode.startsWith("2")) {
      const productCode = cleanBarcode.substring(2, 7);
      const weightValue = cleanBarcode.substring(7, 12);
      const weight = parseInt(weightValue) / 1000;
      if (weight > 0 && weight < 100) {
        return {
          canParseAsScale: true,
          productCode,
          weight,
          rawBarcode: cleanBarcode,
        };
      }
    }
    return { canParseAsScale: false, productCode: cleanBarcode, weight: null };
  };

  // ✅ Barcode search
  const handleBarcodeSearch = useCallback(
    async (barcode) => {
      if (!barcode.trim() || !branch?.storeId || !localStorage.getItem("jwt"))
        return;

      try {
        const fullBarcodeResult = await dispatch(
          searchProducts({ query: barcode.trim(), storeId: branch.storeId })
        ).unwrap();

        if (fullBarcodeResult?.length > 0) {
          const product = fullBarcodeResult[0];
          dispatch(addToCart(product));
          toast({
            title: "Added to cart",
            description: `${product.name} (1 unit) added to cart`,
            duration: 1500,
          });
          setSearchTerm("");
          dispatch(clearSearchResults());
          searchInputRef?.current?.focus();
          return;
        }

        const parsedBarcode = parseScaleBarcode(barcode);
        if (parsedBarcode.canParseAsScale) {
          const scaleResult = await dispatch(
            searchProducts({
              query: parsedBarcode.productCode,
              storeId: branch.storeId,
            })
          ).unwrap();

          if (scaleResult?.length === 1) {
            const product = scaleResult[0];
            const productWithWeight = {
              ...product,
              scannedWeight: parsedBarcode.weight,
              quantity: parsedBarcode.weight,
              isWeightedItem: true,
            };
            dispatch(addToCart(productWithWeight));
            toast({
              title: "Added to cart",
              description: `${product.name} (${parsedBarcode.weight.toFixed(
                3
              )} kg) added to cart`,
              duration: 2000,
            });
          } else {
            toast({
              title: "Product Not Found",
              description: `No product found with code: ${parsedBarcode.productCode}`,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Product Not Found",
            description: "No product found with this barcode",
            variant: "destructive",
          });
        }

        setSearchTerm("");
        dispatch(clearSearchResults());
      } catch (error) {
        console.error("Barcode search failed:", error);
        toast({
          title: "Search Error",
          description: error || "Failed to search product",
          variant: "destructive",
        });
        setSearchTerm("");
        dispatch(clearSearchResults());
      }
    },
    [dispatch, branch, toast, searchInputRef]
  );

  // ✅ Debounced text search
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim() && branch?.storeId && localStorage.getItem("jwt")) {
            dispatch(
              searchProducts({ query: query.trim(), storeId: branch.storeId })
            ).catch((error) => {
              console.error("Search failed:", error);
              toast({
                title: "Search Error",
                description: error || "Failed to search products",
                variant: "destructive",
              });
            });
          }
        }, 500);
      };
    })(),
    [dispatch, branch, toast]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isBarcodeMode) {
      if (e.target.value.trim()) debouncedSearch(e.target.value);
      else dispatch(clearSearchResults());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isBarcodeMode && searchTerm.trim()) {
      handleBarcodeSearch(searchTerm);
    }
  };

  const toggleBarcodeMode = () => {
    setIsBarcodeMode(!isBarcodeMode);
    setSearchTerm("");
    dispatch(clearSearchResults());
    toast({
      title: isBarcodeMode ? "Barcode Mode Disabled" : "Barcode Mode Enabled",
      description: isBarcodeMode
        ? "Normal search mode activated"
        : "Scan product or scale barcode and press Enter",
    });
    searchInputRef?.current?.focus();
  };

  useEffect(() => {
    if (productsError) {
      toast({
        title: "Error",
        description: productsError,
        variant: "destructive",
      });
    }
  }, [productsError, toast]);

  // ✅ Render section
  return (
    <div className="w-2/5 flex flex-col bg-card border-r">
      <div className="p-4 border-b bg-muted">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={
              isBarcodeMode
                ? "Scan barcode and press Enter..."
                : "Search products or scan barcode (F1)"
            }
            className={`pl-10 pr-4 py-3 text-lg ${
              isBarcodeMode ? "border-green-500 focus:border-green-600" : ""
            }`}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">
            {loading
              ? "Loading products..."
              : `${getDisplayProducts().length} products available in inventory`}
          </span>
          <div className="flex gap-2">
            {searchTerm.trim() && !isBarcodeMode && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setSearchTerm("");
                  dispatch(clearSearchResults());
                }}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
            <Button
              variant={isBarcodeMode ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={toggleBarcodeMode}
              disabled={loading}
            >
              <Barcode className="w-4 h-4 mr-1" />
              {isBarcodeMode ? "Scanning..." : "Scan Mode"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : getDisplayProducts().length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm
                  ? "No products found matching your search"
                  : "No products found in inventory"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
            {getDisplayProducts().map((product) => {
              const inv = inventories.find(
                (i) =>
                  i.product?.id === product.id || i.productId === product.id
              );
              const quantity = inv ? inv.quantity : 0;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantity}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
