"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MovieGrid from "@/components/movie-grid";
import { useMovieContext } from "@/context/movie-context";
import { exportData, importData } from "@/lib/utils";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useMovieContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    try {
      exportData("favorites", favorites);
      toast({
        title: "Favorites Exported",
        description: "Your favorites have been exported successfully.",
      });
    } catch (error) {
      console.error("Failed to export favorites:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export your favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      const result = await importData("favorites");

      if (result.success) {
        toast({
          title: "Favorites Imported",
          description: `Successfully imported ${result.count} movies to your favorites.`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to import favorites:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import your favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (
      confirm(
        "Are you sure you want to clear your favorites? This action cannot be undone."
      )
    ) {
      clearFavorites();
      toast({
        title: "Favorites Cleared",
        description: "Your favorites have been cleared successfully.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 min-h-screen"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">My Favorites</h1>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={favorites.length === 0}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button
            onClick={handleImport}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>

          <Button
            onClick={handleClear}
            variant="destructive"
            size="sm"
            disabled={favorites.length === 0}
            className="gap-2"
          >
            <Trash className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            Your favorites list is empty
          </p>
          <p className="mt-2">
            Start adding movies to your favorites to keep track of what you love
          </p>
        </div>
      ) : (
        <MovieGrid movies={favorites} isLoading={false} />
      )}
    </motion.div>
  );
}
