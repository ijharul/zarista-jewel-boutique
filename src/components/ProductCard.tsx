import { ShopifyProduct } from "@/lib/shopify";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPriceFromUSD } from "@/lib/currency";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { node } = product;
  
  const firstVariant = node.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const currencyCode = firstVariant?.price.currencyCode || 'USD';
  const imageUrl = node.images.edges[0]?.node.url;

  const { data: isFavorite } = useQuery({
    queryKey: ['favorite', user?.id, node.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', node.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !firstVariant) {
        throw new Error("Missing required data");
      }

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', node.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: node.id,
            product_handle: node.handle,
            product_title: node.title,
            product_image_url: imageUrl || null,
            product_price: firstVariant.price.amount,
            product_currency: firstVariant.price.currencyCode,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    },
    onError: () => {
      toast.error("Failed to update favorites");
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  return (
    <Link to={`/product/${node.handle}`}>
      <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300 cursor-pointer h-full relative">
        <Button
          onClick={handleToggleFavorite}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-primary' : ''}`} />
        </Button>
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
        <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-primary">
            {formatPriceFromUSD(price)}
          </span>
          <Button 
            onClick={(e) => {
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
            }}
            size="sm"
            className="gap-2 flex-shrink-0"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
