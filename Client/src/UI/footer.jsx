import { Link } from "react-router-dom";
import { Github, Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/farmers"
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  Our Farmers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Github className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FasalBajar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
