"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MovieGrid from "@/components/movie-grid";
import { useMovieContext } from "@/context/movie-context";
import { exportData, importData } from "@/lib/utils";

export default function WatchlistPage() {
  const { watchlist, clearWatchlist } = useMovieContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    try {
      exportData("watchlist", watchlist);
      toast({
        title: "Watchlist Exported",
        description: "Your watchlist has been exported successfully.",
      });
    } catch (error) {
      console.error("Failed to export watchlist:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export your watchlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      const result = await importData("watchlist");

      if (result.success) {
        toast({
          title: "Watchlist Imported",
          description: `Successfully imported ${result.count} movies to your watchlist.`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to import watchlist:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import your watchlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (
      confirm(
        "Are you sure you want to clear your watchlist? This action cannot be undone."
      )
    ) {
      clearWatchlist();
      toast({
        title: "Watchlist Cleared",
        description: "Your watchlist has been cleared successfully.",
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
        <h1 className="text-3xl md:text-4xl font-bold">My Watchlist</h1>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={watchlist.length === 0}
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
            disabled={watchlist.length === 0}
            className="gap-2"
          >
            <Trash className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            Your watchlist is empty
          </p>
          <p className="mt-2">
            Start adding movies to your watchlist to keep track of what you want
            to watch
          </p>
        </div>
      ) : (
        <MovieGrid movies={watchlist} isLoading={false} />
      )}
    </motion.div>
  );
}
