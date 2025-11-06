import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CartDrawer } from "@/components/CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logoImage from "@/assets/zarista-logo.jpg";
import { useCartStore } from "@/stores/cartStore";

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addItem = useCartStore(state => state.addItem);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success("Removed from favorites");
    },
    onError: () => {
      toast.error("Failed to remove from favorites");
    },
  });

  const handleAddToCart = (favorite: any) => {
    const cartItem = {
      product: {
        node: {
          id: favorite.product_id,
          title: favorite.product_title,
          handle: favorite.product_handle,
          description: "",
          priceRange: {
            minVariantPrice: {
              amount: favorite.product_price,
              currencyCode: favorite.product_currency,
            },
          },
          images: {
            edges: favorite.product_image_url ? [{
              node: {
                url: favorite.product_image_url,
                altText: favorite.product_title,
              },
            }] : [],
          },
          variants: { edges: [] },
          options: [],
        },
      },
      variantId: favorite.product_id,
      variantTitle: "Default",
      price: {
        amount: favorite.product_price,
        currencyCode: favorite.product_currency,
      },
      quantity: 1,
      selectedOptions: [],
    };
    
    addItem(cartItem);
    toast.success("Added to cart");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/">
              <img src={logoImage} alt="Zarista" className="h-8 object-contain" />
            </Link>
            <CartDrawer />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-serif font-bold">Sign in to view favorites</h2>
            <p className="text-muted-foreground">Create an account to save your favorite jewelry pieces</p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/">
            <img src={logoImage} alt="Zarista" className="h-8 object-contain" />
          </Link>
          <CartDrawer />
        </div>
      </header>

      <main className="container py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2">
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {favorites?.length || 0} item{favorites?.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No favorites yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Start exploring our collection and save your favorite pieces
            </p>
            <Button asChild>
              <Link to="/">Browse Collection</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="group overflow-hidden border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardContent className="p-0">
                  <Link to={`/product/${favorite.product_handle}`}>
                    <div className="aspect-square overflow-hidden bg-secondary/20">
                      {favorite.product_image_url ? (
                        <img
                          src={favorite.product_image_url}
                          alt={favorite.product_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg tracking-tight">
                      {favorite.product_title}
                    </h3>
                    <p className="text-xl font-bold text-primary">
                      {favorite.product_currency} ${parseFloat(favorite.product_price).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(favorite)}
                    className="flex-1 gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => removeFavoriteMutation.mutate(favorite.id)}
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
