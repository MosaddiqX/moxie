import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get image path from TMDB
export function getImagePath(path: string, size: string = "w500") {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "/placeholder-poster.png";
}

// Format date to readable format
export function formatDate(dateString: string) {
  if (!dateString) return "TBA";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Export data to JSON file
export function exportData(type: "watchlist" | "favorites", data: any[]) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `moxie-${type}-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import data from JSON file
export async function importData(type: "watchlist" | "favorites") {
  return new Promise<{ success: boolean; count?: number; error?: string }>(
    (resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";

      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve({ success: false, error: "No file selected" });
          return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);

            if (!Array.isArray(data)) {
              resolve({ success: false, error: "Invalid data format" });
              return;
            }

            // Update context with imported data
            const event = new CustomEvent(`moxie-import-${type}`, {
              detail: data,
            });
            window.dispatchEvent(event);

            resolve({ success: true, count: data.length });
          } catch (error) {
            console.error("Import error:", error);
            resolve({ success: false, error: "Failed to parse file" });
          }
        };

        reader.onerror = () => {
          resolve({ success: false, error: "Failed to read file" });
        };

        reader.readAsText(file);
      };

      input.click();
    }
  );
}
