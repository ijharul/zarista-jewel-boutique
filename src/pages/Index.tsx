import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-jewelry.jpg";

const Index = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(20),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury Jewelry Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 to-transparent" />
        </div>
        <div className="relative container h-full flex items-center">
          <div className="max-w-2xl space-y-6 text-cream">
            <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
              Exquisite Jewelry
              <br />
              <span className="text-primary">Timeless Elegance</span>
            </h1>
            <p className="text-lg md:text-xl text-cream/90">
              Discover our curated collection of fine jewelry, crafted with precision and passion.
            </p>
          </div>
        </div>
      </section>

      <main className="container py-16">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
            Our Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each piece in our collection tells a story of craftsmanship and beauty
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load products. Please try again.</p>
          </div>
        )}

        {products && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <p className="text-sm text-muted-foreground">
              Create your first product by telling me what you'd like to add!
            </p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t bg-secondary/30 mt-20">
        <div className="container py-12 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Zarista. Fine Jewelry & Timeless Design.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
