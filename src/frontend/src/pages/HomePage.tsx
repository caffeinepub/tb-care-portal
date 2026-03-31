import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { HOME_CATEGORIES, TOOLS } from "@/lib/tools";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Code2, FlaskConical } from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { icon: FlaskConical, label: "Questionnaires", value: "20+" },
  { icon: Code2, label: "Open Source", value: "100%" },
];

const POPULAR_TOOLS = TOOLS.filter((t) => t.implemented).slice(0, 8);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar via-sidebar/90 to-primary/30 text-sidebar-foreground py-20 px-4">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, oklch(0.60 0.12 195) 0%, transparent 60%), radial-gradient(circle at 80% 20%, oklch(0.47 0.13 240) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary-foreground/80 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              TB Health Professionals Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              TB Care
              <br />
              <span className="text-primary">Questionnaire Management</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/70 max-w-2xl mx-auto mb-8">
              A comprehensive platform with 20+ structured questionnaires for
              tuberculosis management, patient screening, KAP assessment, and
              treatment adherence monitoring.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/gallery">
                <Button
                  size="lg"
                  className="gap-2"
                  data-ocid="hero.primary_button"
                >
                  Browse Questionnaires <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent gap-2"
                  data-ocid="hero.secondary_button"
                >
                  View All Forms
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="text-center"
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Questionnaire Categories
          </h2>
          <p className="text-muted-foreground mb-8">
            Choose from specialized questionnaire toolkits for TB management
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOME_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 + 0.2 }}
              >
                <Link to="/gallery" className="block">
                  <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-card-hover transition-all duration-200 group cursor-pointer">
                    <div className="text-3xl mb-3">{cat.icon}</div>
                    <div className="font-semibold text-foreground">
                      {cat.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {cat.description}
                    </div>
                    <div className="mt-3 text-xs font-medium text-primary">
                      {cat.count} questionnaires
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular questionnaires */}
      <section className="py-14 px-4 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Popular Questionnaires
              </h2>
              <p className="text-muted-foreground mt-1">
                Most-used questionnaire forms for TB management
              </p>
            </div>
            <Link to="/gallery">
              <Button
                variant="outline"
                className="gap-2"
                data-ocid="home.gallery_link"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {POPULAR_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.2 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
