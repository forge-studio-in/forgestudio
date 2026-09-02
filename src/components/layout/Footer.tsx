import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const exploreLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Insights", href: "/insights" },
  { name: "Contact", href: "/contact" },
];

const serviceLinks = [
  { name: "Software", href: "/services#software" },
  { name: "Web", href: "/services#web" },
  { name: "Design", href: "/services#design" },
  { name: "Media", href: "/services#media" },
  { name: "Marketing", href: "/services#marketing" },
  { name: "AI & Automation", href: "/services#ai" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <span className="text-forge-black font-bold text-xl leading-none">F</span>
              </div>
              <span className="font-bold tracking-tight text-xl">FORGE STUDIO</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs mb-8">
              A creative technology studio crafting software, websites, brands, and digital experiences built to grow.
            </p>
            <div className="flex gap-4">
              {/* Placeholders for social links */}
              <a href="#" className="text-muted hover:text-primary transition-colors" aria-label="Website">
                <Icon name="Globe" size={20} />
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors" aria-label="Mail">
                <Icon name="Mail" size={20} />
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors" aria-label="Message">
                <Icon name="MessageCircle" size={20} />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Explore</h3>
            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Services</h3>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Contact</h3>
            <div className="space-y-4 text-sm text-muted">
              <p>
                <a href="mailto:hello@forgestudio.com" className="hover:text-primary transition-colors">
                  hello@forgestudio.com
                </a>
              </p>
              {/* Add real address/phone when supplied */}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} Forge Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
