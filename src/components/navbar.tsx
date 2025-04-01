"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Rss,
  BarChart2,
  Target,
  PieChart,
  FileText,
  Search,
  Users,
  Link2,
  Palette,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Reklam",
    icon: <Rss className="w-5 h-5" />,
    href: "/reklam",
  },
  {
    title: "Strateji",
    icon: <BarChart2 className="w-5 h-5" />,
    href: "/strateji",
    badge: "AI",
  },
  {
    title: "Optimizasyon",
    icon: <Target className="w-5 h-5" />,
    href: "/optimizasyon",
  },
  {
    title: "Hedef Kitle",
    icon: <Users className="w-5 h-5" />,
    href: "/hedef-kitle",
  },
  {
    title: "Raporlar",
    icon: <PieChart className="w-5 h-5" />,
    href: "/raporlar",
  },
  {
    title: "Katalog",
    icon: <FileText className="w-5 h-5" />,
    href: "/katalog",
  },
  {
    title: "SEO",
    icon: <Search className="w-5 h-5" />,
    href: "/seo",
  },
  {
    title: "Rakip",
    icon: <Users className="w-5 h-5" />,
    href: "/rakip",
  },
  {
    title: "Entegrasyon",
    icon: <Link2 className="w-5 h-5" />,
    href: "/entegrasyon",
  },
  {
    title: "Tasarım",
    icon: <Palette className="w-5 h-5" />,
    href: "/tasarim",
    badge: "Yakında",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r">
      <Link href="/" className="block p-6">
        <Image src="/logo.png" alt="Miads Logo" width={120} height={40} priority />
      </Link>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon}
            {item.title}
            {item.badge && (
              <span className={cn(
                "ml-auto text-xs font-medium px-2 py-0.5 rounded",
                item.badge === "AI" 
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
} 