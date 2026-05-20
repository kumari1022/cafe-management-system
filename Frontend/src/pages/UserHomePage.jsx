import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Coffee, Star, ArrowRight } from "lucide-react";

export default function UserHomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-cafe-primary text-white p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 shadow-cafe-lg">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80')" }}
        />
        <div className="relative z-10 flex-1 space-y-4 text-center md:text-left">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-display font-bold">
            Start Your Day <br /> With Perfect Brew
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/80 text-lg max-w-md mx-auto md:mx-0">
            Experience the finest coffee crafted by expert baristas. Freshly roasted beans, perfect milk frothing, and a cozy atmosphere await.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Link to="/user/menu" className="inline-flex items-center gap-2 bg-white text-cafe-primary px-6 py-3 rounded-full font-bold hover:bg-cafe-beige transition-colors shadow-lg">
              Order Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Premium Beans", desc: "Sourced from the best farms globally.", icon: Coffee },
          { title: "Expert Baristas", desc: "Trained to deliver perfection in every cup.", icon: Star },
          { title: "Fast Delivery", desc: "Hot coffee right to your table or door.", icon: ArrowRight },
        ].map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-cafe-beige flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-cafe-beige text-cafe-primary rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">{feat.title}</h3>
              <p className="text-cafe-text/70 text-sm">{feat.desc}</p>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
