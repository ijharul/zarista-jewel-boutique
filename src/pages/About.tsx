import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
              About <span className="text-primary">Zarista</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Fine Jewelry & Timeless Design
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold">Our Story</h2>
              <p className="text-muted-foreground">
                Founded in 2025, Zarista represents the perfect blend of traditional craftsmanship 
                and contemporary design. Each piece in our collection is carefully curated to bring 
                you the finest jewelry that tells a story of elegance and sophistication.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold">Our Commitment</h2>
              <p className="text-muted-foreground">
                We are committed to providing our customers with exceptional quality jewelry at 
                competitive prices. Every piece is inspected and authenticated to ensure you receive 
                only the best.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold">Quality Assurance</h2>
              <p className="text-muted-foreground">
                All our jewelry pieces are made from premium materials including genuine gold, 
                sterling silver, and authentic gemstones. We stand behind the quality of every 
                item we sell.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default About;
