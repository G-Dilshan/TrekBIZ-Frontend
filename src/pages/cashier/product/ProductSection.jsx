// import React, { useCallback, useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Search, Barcode, Loader2, X } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import ProductCard from "./ProductCard";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import {
//   getProductsByStore,
//   searchProducts,
// } from "../../../Redux Toolkit/features/product/productThunks";
// import { getBranchById } from "../../../Redux Toolkit/features/branch/branchThunks";
// import { clearSearchResults } from '@/Redux Toolkit/features/product/productSlice';

// const ProductSection = ({searchInputRef}) => {
//   const dispatch = useDispatch();
//   const { branch } = useSelector((state) => state.branch);
//   const { userProfile } = useSelector((state) => state.user);
//   const [searchTerm, setSearchTerm] = useState("");
//   const {
//     products,
//     searchResults,
//     loading,
//     error: productsError
//   } = useSelector((state) => state.product);

//   const { toast } = useToast();

   

//   const getDisplayProducts = () => {
//     if (searchTerm.trim() && searchResults.length > 0) {
//       return searchResults;
//     }
//     return products || [];
//   };

//   // Fetch products when component mounts or when branch changes
//   useEffect(() => {
//     const fetchProducts = async () => {
//       console.log("Fetching products...", { branch, userProfile });

//       // Wait for branch to be loaded
//       if (branch?.storeId && localStorage.getItem("jwt")) {
//         console.log("Fetching products for branch:", branch.storeId);
//         try {
//           await dispatch(
//             getProductsByStore(branch.storeId)
//           ).unwrap();
//         } catch (error) {
//           console.error("Failed to fetch products:", error);
//           toast({
//             title: "Error",
//             description: error || "Failed to fetch products",
//             variant: "destructive",
//           });
//         }
//       } else if (
//         userProfile?.branchId &&
//         localStorage.getItem("jwt") &&
//         !branch
//       ) {
//         // If branch is not loaded but we have branchId in userProfile, fetch branch first
//         console.log("Fetching branch first:", userProfile.branchId);
//         try {
//           await dispatch(
//             getBranchById({
//               id: userProfile.branchId,
//               jwt: localStorage.getItem("jwt"),
//             })
//           ).unwrap();
//         } catch (error) {
//           console.error("Failed to fetch branch:", error);
//           toast({
//             title: "Error",
//             description: "Failed to load branch information",
//             variant: "destructive",
//           });
//         }
//       }
//     };

//     fetchProducts();
//   }, [dispatch, branch, userProfile, toast]);

//   // Debounced search function
//   const debouncedSearch = useCallback(
//     (() => {
//       let timeoutId;
//       return (query) => {
//         clearTimeout(timeoutId);
//         timeoutId = setTimeout(() => {
//           if (query.trim() && branch?.storeId && localStorage.getItem("jwt")) {
//             dispatch(
//               searchProducts({
//                 query: query.trim(),
//                 storeId: branch.storeId,
//               })
//             )
//               .unwrap()
//               .catch((error) => {
//                 console.error("Search failed:", error);
//                 toast({
//                   title: "Search Error",
//                   description: error || "Failed to search products",
//                   variant: "destructive",
//                 });
//               });
//           }
//         }, 500); // 300ms debounce
//       };
//     })(),
//     [dispatch, branch, toast]
//   );

//   // Handle search term changes
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     if (e.target.value.trim()) {
//       debouncedSearch(e.target.value);
//     } else {
//       // Clear search results when search term is empty
//       dispatch(clearSearchResults());
//     }
//   };

//     // Show error toast if products fail to load
//     useEffect(() => {
//       if (productsError) {
//         toast({
//           title: 'Error',
//           description: productsError,
//           variant: 'destructive',
//         });
//       }
//     }, [productsError, toast]);

//   return (
//     <div className="w-2/5 flex flex-col bg-card border-r">
//       {/* Search Section */}
//       <div className="p-4 border-b bg-muted">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//           <Input
//             ref={searchInputRef}
//             type="text"
//             placeholder="Search products or scan barcode (F1)"
//             className="pl-10 pr-4 py-3 text-lg"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             disabled={loading}
//           />
//         </div>
//         <div className="flex items-center justify-between mt-2">
//           <span className="text-sm text-muted-foreground">
//             {loading
//               ? "Loading products..."
//               : searchTerm.trim()
//               ? `Search results: ${getDisplayProducts().length} products found`
//               : `${getDisplayProducts().length} products found`}
//           </span>
//           <div className="flex gap-2">
//             {searchTerm.trim() && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="text-xs"
//                 onClick={() => setSearchTerm("")}
//                 disabled={loading}
//               >
//                 <X className="w-4 h-4 mr-1" />
//                 Clear
//               </Button>
//             )}
//             <Button
//               variant="outline"
//               size="sm"
//               className="text-xs"
//               disabled={loading}
//             >
//               <Barcode className="w-4 h-4 mr-1" />
//               Scan
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
//               <p className="text-muted-foreground">Loading products...</p>
//             </div>
//           </div>
//         ) : getDisplayProducts().length === 0 ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500">
//                 {searchTerm
//                   ? "No products found matching your search"
//                   : "No products available"}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
//             {getDisplayProducts().map((product) => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
               
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductSection;


// import React, { useCallback, useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Search, Barcode, Loader2, X } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import ProductCard from "./ProductCard";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import {
//   getProductsByStore,
//   searchProducts,
// } from "../../../Redux Toolkit/features/product/productThunks";
// import { getBranchById } from "../../../Redux Toolkit/features/branch/branchThunks";
// import { clearSearchResults } from '@/Redux Toolkit/features/product/productSlice';
// import { addToCart } from '../../../Redux Toolkit/features/cart/cartSlice';

// const ProductSection = ({searchInputRef}) => {
//   const dispatch = useDispatch();
//   const { branch } = useSelector((state) => state.branch);
//   const { userProfile } = useSelector((state) => state.user);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isBarcodeMode, setIsBarcodeMode] = useState(false);
//   const {
//     products,
//     searchResults,
//     loading,
//     error: productsError
//   } = useSelector((state) => state.product);

//   const { toast } = useToast();

//   const getDisplayProducts = () => {
//     if (searchTerm.trim() && searchResults.length > 0) {
//       return searchResults;
//     }
//     return products || [];
//   };

//   // Fetch products when component mounts or when branch changes
//   useEffect(() => {
//     const fetchProducts = async () => {
//       console.log("Fetching products...", { branch, userProfile });

//       if (branch?.storeId && localStorage.getItem("jwt")) {
//         console.log("Fetching products for branch:", branch.storeId);
//         try {
//           await dispatch(
//             getProductsByStore(branch.storeId)
//           ).unwrap();
//         } catch (error) {
//           console.error("Failed to fetch products:", error);
//           toast({
//             title: "Error",
//             description: error || "Failed to fetch products",
//             variant: "destructive",
//           });
//         }
//       } else if (
//         userProfile?.branchId &&
//         localStorage.getItem("jwt") &&
//         !branch
//       ) {
//         console.log("Fetching branch first:", userProfile.branchId);
//         try {
//           await dispatch(
//             getBranchById({
//               id: userProfile.branchId,
//               jwt: localStorage.getItem("jwt"),
//             })
//           ).unwrap();
//         } catch (error) {
//           console.error("Failed to fetch branch:", error);
//           toast({
//             title: "Error",
//             description: "Failed to load branch information",
//             variant: "destructive",
//           });
//         }
//       }
//     };

//     fetchProducts();
//   }, [dispatch, branch, userProfile, toast]);

//   // Handle barcode search and auto-add to cart
//   const handleBarcodeSearch = useCallback(async (barcode) => {
//     if (!barcode.trim() || !branch?.storeId || !localStorage.getItem("jwt")) {
//       return;
//     }

//     try {
//       const result = await dispatch(
//         searchProducts({
//           query: barcode.trim(),
//           storeId: branch.storeId,
//         })
//       ).unwrap();

//       // If exactly one product found, add to cart automatically
//       if (result && result.length === 1) {
//         const product = result[0];
        
//         // Add to cart (matching ProductCard's addToCart call)
//         dispatch(addToCart(product));
        
//         toast({
//           title: "Added to cart",
//           description: `${product.name} added to cart`,
//           duration: 1500,
//         });
        
//         // Clear search and prepare for next scan
//         setSearchTerm("");
//         dispatch(clearSearchResults());
        
//         // Focus back on search input
//         if (searchInputRef?.current) {
//           searchInputRef.current.focus();
//         }
//       } else if (result && result.length > 1) {
//         // Multiple products found - show them for manual selection
//         toast({
//           title: "Multiple Products Found",
//           description: "Please select the correct product from the list",
//         });
//       } else {
//         // No products found
//         toast({
//           title: "Product Not Found",
//           description: "No product found with this barcode",
//           variant: "destructive",
//         });
//         setSearchTerm("");
//         dispatch(clearSearchResults());
//       }
//     } catch (error) {
//       console.error("Barcode search failed:", error);
//       toast({
//         title: "Search Error",
//         description: error || "Failed to search product",
//         variant: "destructive",
//       });
//       setSearchTerm("");
//       dispatch(clearSearchResults());
//     }
//   }, [dispatch, branch, toast, searchInputRef]);

//   // Debounced search function for manual typing
//   const debouncedSearch = useCallback(
//     (() => {
//       let timeoutId;
//       return (query) => {
//         clearTimeout(timeoutId);
//         timeoutId = setTimeout(() => {
//           if (query.trim() && branch?.storeId && localStorage.getItem("jwt")) {
//             dispatch(
//               searchProducts({
//                 query: query.trim(),
//                 storeId: branch.storeId,
//               })
//             )
//               .unwrap()
//               .catch((error) => {
//                 console.error("Search failed:", error);
//                 toast({
//                   title: "Search Error",
//                   description: error || "Failed to search products",
//                   variant: "destructive",
//                 });
//               });
//           }
//         }, 500);
//       };
//     })(),
//     [dispatch, branch, toast]
//   );

//   // Handle search term changes
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
    
//     if (!isBarcodeMode) {
//       // Normal search mode
//       if (e.target.value.trim()) {
//         debouncedSearch(e.target.value);
//       } else {
//         dispatch(clearSearchResults());
//       }
//     }
//   };

//   // Handle Enter key press for barcode mode
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && isBarcodeMode && searchTerm.trim()) {
//       handleBarcodeSearch(searchTerm);
//     }
//   };

//   // Toggle barcode scan mode
//   const toggleBarcodeMode = () => {
//     setIsBarcodeMode(!isBarcodeMode);
//     setSearchTerm("");
//     dispatch(clearSearchResults());
    
//     if (!isBarcodeMode) {
//       toast({
//         title: "Barcode Mode Enabled",
//         description: "Scan or enter barcode and press Enter",
//       });
//     } else {
//       toast({
//         title: "Barcode Mode Disabled",
//         description: "Normal search mode activated",
//       });
//     }
    
//     // Focus on search input
//     if (searchInputRef?.current) {
//       searchInputRef.current.focus();
//     }
//   };

//   // Show error toast if products fail to load
//   useEffect(() => {
//     if (productsError) {
//       toast({
//         title: 'Error',
//         description: productsError,
//         variant: 'destructive',
//       });
//     }
//   }, [productsError, toast]);

//   return (
//     <div className="w-2/5 flex flex-col bg-card border-r">
//       {/* Search Section */}
//       <div className="p-4 border-b bg-muted">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//           <Input
//             ref={searchInputRef}
//             type="text"
//             placeholder={
//               isBarcodeMode
//                 ? "Scan barcode or enter and press Enter..."
//                 : "Search products or scan barcode (F1)"
//             }
//             className={`pl-10 pr-4 py-3 text-lg ${
//               isBarcodeMode ? 'border-green-500 focus:border-green-600' : ''
//             }`}
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onKeyPress={handleKeyPress}
//             disabled={loading}
//           />
//         </div>
//         <div className="flex items-center justify-between mt-2">
//           <span className="text-sm text-muted-foreground">
//             {loading
//               ? "Loading products..."
//               : isBarcodeMode
//               ? "Barcode scan mode active"
//               : searchTerm.trim()
//               ? `Search results: ${getDisplayProducts().length} products found`
//               : `${getDisplayProducts().length} products found`}
//           </span>
//           <div className="flex gap-2">
//             {searchTerm.trim() && !isBarcodeMode && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="text-xs"
//                 onClick={() => {
//                   setSearchTerm("");
//                   dispatch(clearSearchResults());
//                 }}
//                 disabled={loading}
//               >
//                 <X className="w-4 h-4 mr-1" />
//                 Clear
//               </Button>
//             )}
//             <Button
//               variant={isBarcodeMode ? "default" : "outline"}
//               size="sm"
//               className="text-xs"
//               onClick={toggleBarcodeMode}
//               disabled={loading}
//             >
//               <Barcode className="w-4 h-4 mr-1" />
//               {isBarcodeMode ? "Scanning..." : "Scan Mode"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
//               <p className="text-muted-foreground">Loading products...</p>
//             </div>
//           </div>
//         ) : getDisplayProducts().length === 0 ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500">
//                 {searchTerm
//                   ? "No products found matching your search"
//                   : isBarcodeMode
//                   ? "Ready to scan barcode"
//                   : "No products available"}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
//             {getDisplayProducts().map((product) => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductSection;



// Works with Balanced Scale Barcode

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
import { clearSearchResults } from '@/Redux Toolkit/features/product/productSlice';
import { addToCart } from '../../../Redux Toolkit/features/cart/cartSlice';

const ProductSection = ({searchInputRef}) => {
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBarcodeMode, setIsBarcodeMode] = useState(false);
  const {
    products,
    searchResults,
    loading,
    error: productsError
  } = useSelector((state) => state.product);

  const { toast } = useToast();

  /**
   * Parse barcode for scale weight extraction
   * Used only when full barcode search fails
   * 
   * SCALE BARCODE FORMAT: PPPPPWWWWW (10 digits)
   * - First 5 digits: Product code (e.g., 00002)
   * - Last 5 digits: Weight in grams (e.g., 00500 = 500g = 0.5kg)
   * 
   * Example: 0000200500
   * - Product code: 00002
   * - Weight: 00500 = 500g = 0.5kg
   */
  const parseScaleBarcode = (barcode) => {
    const cleanBarcode = barcode.trim();
    
    // Parse 10-digit barcodes as potential scale barcodes
    if (cleanBarcode.length === 10 && /^\d+$/.test(cleanBarcode)) {
      const productCode = cleanBarcode.substring(0, 5); // First 5 digits
      const weightValue = cleanBarcode.substring(5);    // Last 5 digits
      const weight = parseInt(weightValue) / 1000;      // Convert grams to kg
      
      // Validate weight is reasonable (0.001kg to 99.999kg)
      if (weight > 0 && weight < 100) {
        return {
          canParseAsScale: true,
          productCode: productCode,
          weight: weight,
          rawBarcode: cleanBarcode
        };
      }
    }
    
    // Parse 13-digit EAN-13 scale format (starts with '2')
    if (cleanBarcode.length === 13 && cleanBarcode.startsWith('2')) {
      const productCode = cleanBarcode.substring(2, 7);  // 5 digits
      const weightValue = cleanBarcode.substring(7, 12); // 5 digits
      const weight = parseInt(weightValue) / 1000;
      
      if (weight > 0 && weight < 100) {
        return {
          canParseAsScale: true,
          productCode: productCode,
          weight: weight,
          rawBarcode: cleanBarcode
        };
      }
    }
    
    // Cannot parse as scale barcode
    return {
      canParseAsScale: false,
      productCode: cleanBarcode,
      weight: null,
      rawBarcode: cleanBarcode
    };
  };

  const getDisplayProducts = () => {
    if (searchTerm.trim() && searchResults.length > 0) {
      return searchResults;
    }
    return products || [];
  };

  // Fetch products when component mounts or when branch changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (branch?.storeId && localStorage.getItem("jwt")) {
        try {
          await dispatch(getProductsByStore(branch.storeId)).unwrap();
        } catch (error) {
          console.error("Failed to fetch products:", error);
          toast({
            title: "Error",
            description: error || "Failed to fetch products",
            variant: "destructive",
          });
        }
      } else if (userProfile?.branchId && localStorage.getItem("jwt") && !branch) {
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

    fetchProducts();
  }, [dispatch, branch, userProfile, toast]);

  // Handle barcode search with intelligent scale detection
  const handleBarcodeSearch = useCallback(async (barcode) => {
    if (!barcode.trim() || !branch?.storeId || !localStorage.getItem("jwt")) {
      return;
    }

    try {
      // STEP 1: Try to find product with FULL barcode first
      console.log("Searching with full barcode:", barcode);
      
      const fullBarcodeResult = await dispatch(
        searchProducts({
          query: barcode.trim(),
          storeId: branch.storeId,
        })
      ).unwrap();

      // If product found with full barcode, add as regular product
      if (fullBarcodeResult && fullBarcodeResult.length > 0) {
        
        if (fullBarcodeResult.length === 1) {
          const product = fullBarcodeResult[0];
          
          // Add as regular product with quantity = 1
          dispatch(addToCart(product));
          
          toast({
            title: "Added to cart",
            description: `${product.name} (1 unit) added to cart`,
            duration: 1500,
          });
          
          setSearchTerm("");
          dispatch(clearSearchResults());
          
          if (searchInputRef?.current) {
            searchInputRef.current.focus();
          }
          
          return; // Done - don't try scale parsing
        } else {
          // Multiple products found
          toast({
            title: "Multiple Products Found",
            description: "Please select the correct product from the list",
          });
          return;
        }
      }
      
      // STEP 2: If no product found with full barcode, try scale barcode parsing
      console.log("No product found with full barcode, trying scale parsing...");
      
      const parsedBarcode = parseScaleBarcode(barcode);
      
      if (parsedBarcode.canParseAsScale) {
        console.log("Parsed as scale barcode:", parsedBarcode);
        
        // Search with product code (first 5 digits)
        const scaleResult = await dispatch(
          searchProducts({
            query: parsedBarcode.productCode,
            storeId: branch.storeId,
          })
        ).unwrap();
        
        if (scaleResult && scaleResult.length === 1) {
          const product = scaleResult[0];
          
          // Add with scanned weight
          const productWithWeight = {
            ...product,
            scannedWeight: parsedBarcode.weight,
            quantity: parsedBarcode.weight,
            isWeightedItem: true
          };
          
          dispatch(addToCart(productWithWeight));
          
          toast({
            title: "Added to cart",
            description: `${product.name} (${parsedBarcode.weight.toFixed(3)} kg) added to cart`,
            duration: 2000,
          });
          
          setSearchTerm("");
          dispatch(clearSearchResults());
          
          if (searchInputRef?.current) {
            searchInputRef.current.focus();
          }
        } else if (scaleResult && scaleResult.length > 1) {
          toast({
            title: "Multiple Products Found",
            description: `Product code: ${parsedBarcode.productCode}. Please select from list.`,
          });
        } else {
          toast({
            title: "Product Not Found",
            description: `No product found with code: ${parsedBarcode.productCode}`,
            variant: "destructive",
          });
          setSearchTerm("");
          dispatch(clearSearchResults());
        }
      } else {
        // Cannot parse as scale barcode either
        toast({
          title: "Product Not Found",
          description: "No product found with this barcode",
          variant: "destructive",
        });
        setSearchTerm("");
        dispatch(clearSearchResults());
      }
      
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
  }, [dispatch, branch, toast, searchInputRef]);

  // Debounced search for manual typing
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim() && branch?.storeId && localStorage.getItem("jwt")) {
            dispatch(
              searchProducts({
                query: query.trim(),
                storeId: branch.storeId,
              })
            )
              .unwrap()
              .catch((error) => {
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
      if (e.target.value.trim()) {
        debouncedSearch(e.target.value);
      } else {
        dispatch(clearSearchResults());
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isBarcodeMode && searchTerm.trim()) {
      handleBarcodeSearch(searchTerm);
    }
  };

  const toggleBarcodeMode = () => {
    setIsBarcodeMode(!isBarcodeMode);
    setSearchTerm("");
    dispatch(clearSearchResults());
    
    if (!isBarcodeMode) {
      toast({
        title: "Barcode Mode Enabled",
        description: "Scan product or scale barcode and press Enter",
      });
    } else {
      toast({
        title: "Barcode Mode Disabled",
        description: "Normal search mode activated",
      });
    }
    
    if (searchInputRef?.current) {
      searchInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (productsError) {
      toast({
        title: 'Error',
        description: productsError,
        variant: 'destructive',
      });
    }
  }, [productsError, toast]);

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
                ? "Scan barcode (product or scale) and press Enter..."
                : "Search products or scan barcode (F1)"
            }
            className={`pl-10 pr-4 py-3 text-lg ${
              isBarcodeMode ? 'border-green-500 focus:border-green-600' : ''
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
              : isBarcodeMode
              ? "🔍 Barcode scan mode - Supports scale barcodes"
              : searchTerm.trim()
              ? `Search results: ${getDisplayProducts().length} products found`
              : `${getDisplayProducts().length} products found`}
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
                <X className="w-4 h-4 mr-1" />
                Clear
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
                  : isBarcodeMode
                  ? "Ready to scan barcode (product or scale)"
                  : "No products available"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
            {getDisplayProducts().map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
