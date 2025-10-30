import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useDispatch } from "react-redux";
import { useToast } from "../../../components/ui/use-toast";
import { addToCart } from "../../../Redux Toolkit/features/cart/cartSlice";

const ProductCard = React.memo(({ product, quantity }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast({
      title: "Added to cart",
      description: `${product.name} added to cart`,
      duration: 1500,
    });
  };

  return (
    <Card
      key={product.id}
      className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-green-800"
      onClick={() => handleAddToCart(product)}
    >
      <CardContent>
        <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center">
          <img
            className="h-30 w-30 object-cover"
            src={product.image}
            alt={product.name}
          />
        </div>

        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.sku}</p>

        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-green-600">
            Rs. {product.sellingPrice || product.price}
          </span>
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        </div>

        <div className="mt-2 text-xs text-gray-600">
          <span className="font-semibold">Stock:</span>{" "}
          {quantity > 0 ? (
            <span className="text-green-700">{quantity} available</span>
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
