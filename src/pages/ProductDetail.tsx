import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, ShoppingCart, Loader2, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useState } from "react";
import { formatPriceFromUSD } from "@/lib/currency";

const ProductDetail = () => {
  const { handle } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const addItem = useCartStore(state => state.addItem);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(100),
  });

  const product = products?.find(p => p.node.handle === handle);
  const node = product?.node;
  const variants = node?.variants.edges || [];
  const selectedVariant = variants[selectedVariantIndex]?.node;

  const { data: isFavorite, isLoading: favoriteLoading } = useQuery({
    queryKey: ['favorite', user?.id, node?.id],
    queryFn: async () => {
      if (!user || !node) return false;
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', node.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!node,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !node || !selectedVariant) {
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
            product_image_url: node.images.edges[0]?.node.url || null,
            product_price: selectedVariant.price.amount,
            product_currency: selectedVariant.price.currencyCode,
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

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${node?.title} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product || !node) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square overflow-hidden rounded-lg bg-secondary/20">
            {node.images.edges[0]?.node.url ? (
              <img
                src={node.images.edges[0].node.url}
                alt={node.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2">
                {node.title}
              </h1>
              <p className="text-2xl font-bold text-primary">
                {formatPriceFromUSD(selectedVariant?.price.amount || '0')}
              </p>
            </div>

            <div className="prose prose-sm">
              <p className="text-muted-foreground">
                {node.description || "An exquisite jewelry piece from our collection."}
              </p>
            </div>

            {variants.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Variant</label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <Button
                      key={variant.node.id}
                      variant={selectedVariantIndex === index ? "default" : "outline"}
                      onClick={() => setSelectedVariantIndex(index)}
                      className="min-w-[80px]"
                    >
                      {variant.node.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 gap-2"
                disabled={!selectedVariant?.availableForSale}
              >
                <ShoppingCart className="h-5 w-5" />
                {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                onClick={handleToggleFavorite}
                size="lg"
                variant="outline"
                className="gap-2"
                disabled={favoriteLoading || toggleFavoriteMutation.isPending}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current text-primary' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
