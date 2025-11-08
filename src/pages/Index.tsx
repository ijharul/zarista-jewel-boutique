import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-jewelry.jpg";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(20),
  });

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const types = new Set(products.map(p => p.node.productType || "Other"));
    return ["All", ...Array.from(types)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === "All" || product.node.productType === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        product.node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.node.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort products
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = parseFloat(a.node.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.node.priceRange.minVariantPrice.amount);
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = parseFloat(a.node.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.node.priceRange.minVariantPrice.amount);
        return priceB - priceA;
      });
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => 
        a.node.title.localeCompare(b.node.title)
      );
    }

    return filtered;
  }, [products, selectedCategory, sortBy, searchQuery]);

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
        <div className="mb-12 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
              Our Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each piece in our collection tells a story of craftsmanship and beauty
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Input
              placeholder="Search jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            
            <div className="flex gap-2 items-center flex-wrap">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
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

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          !isLoading && !error && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </div>
          )
        )}
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
