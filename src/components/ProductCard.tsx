import { ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;
  
  const firstVariant = node.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const currencyCode = firstVariant?.price.currencyCode || 'USD';
  const imageUrl = node.images.edges[0]?.node.url;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${node.title} has been added to your cart.`,
    });
  };

  return (
    <Link to={`/product/${node.handle}`}>
      <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300 cursor-pointer h-full">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden bg-secondary/20">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={node.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
              {node.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {node.description || "Exquisite jewelry piece"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {currencyCode} ${price.toFixed(2)}
          </span>
          <Button 
            onClick={handleAddToCart}
            size="sm"
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
