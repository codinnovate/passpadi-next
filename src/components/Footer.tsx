import Link from "next/link";
import Logo from "./Logo";
import { BookOpen, MessageCircle, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "CBT Practice", href: "/dashboard/cbt" },
    { label: "Classroom", href: "/dashboard/subject/mathematics" },
    { label: "Leaderboard", href: "/dashboard/leaderboard" },
    { label: "Blog", href: "/dashboard/blog" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Feeds", href: "/dashboard/feeds" },
    { label: "Contact", href: "mailto:passpadi.com@gmail.com" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Logo className="w-[100px]" />
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Prepare smarter for JAMB and Post-UTME with past questions, AI
              explanations, and study tools.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="mailto:passpadi.com@gmail.com"
                className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-app-primary hover:text-white"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="/dashboard/feeds"
                className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-app-primary hover:text-white"
                aria-label="Community"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="/dashboard/blog"
                className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-app-primary hover:text-white"
                aria-label="Blog"
              >
                <BookOpen size={16} />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-app-secondary">
              Product
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-app-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-app-secondary">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-app-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-app-secondary">
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-app-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gray-100" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 90percent. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 transition-colors hover:text-app-primary"
            >
              Privacy
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/terms"
              className="text-xs text-gray-500 transition-colors hover:text-app-primary"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
