import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Github, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-muted-foreground text-sm">
              Your premium movie discovery platform. Find, save, and share your
              favorite films.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/MosaddiqX/moxie/"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Explore Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/watchlist"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Watchlist
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/recently-viewed"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Recently Viewed
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  DMCA
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Moxie. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org/"
              className="text-accent hover:underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
