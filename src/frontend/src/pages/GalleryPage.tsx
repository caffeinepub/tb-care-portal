import ToolCard from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export default function GalleryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchCat = category === "all" || t.category === category;
      const matchQ =
        !query ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some((tag) => tag.includes(query.toLowerCase()));
      return matchCat && matchQ;
    });
  }, [query, category]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Questionnaire Gallery
        </h1>
        <p className="text-muted-foreground">
          Browse and launch 20+ TB care questionnaire forms
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search questionnaires by name or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          data-ocid="gallery.search_input"
        />
      </div>

      {/* Category tabs */}
      <Tabs value={category} onValueChange={setCategory} className="mb-8">
        <TabsList
          className="flex-wrap h-auto gap-1 bg-muted/50"
          data-ocid="gallery.tab"
        >
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="text-sm"
              data-ocid="gallery.tab"
            >
              {cat.label}
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({cat.count})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="gallery.empty_state"
        >
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-medium">
            No questionnaires found for "{query}"
          </div>
          <div className="text-sm mt-1">
            Try a different search term or category
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
