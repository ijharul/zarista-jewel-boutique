import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useState } from "react";
import logoImage from "@/assets/zarista-logo.jpg";

const ProductDetail = () => {
  const { handle } = useParams();
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
                {selectedVariant?.price.currencyCode} ${parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
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

            <Button 
              onClick={handleAddToCart}
              size="lg"
              className="w-full gap-2"
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="h-5 w-5" />
              {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
