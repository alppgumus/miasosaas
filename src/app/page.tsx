"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Play, 
  Target, 
  MessageSquare, 
  Heart,
  BarChart2,
  FileText,
  Zap,
  Clock,
  ChevronRight,
  Facebook,
  Chrome,
  LayoutDashboard,
  PieChart,
  BrainCircuit,
  Settings,
  ChevronDown,
  Search
} from "lucide-react";
import { useState } from "react";

interface QuickAction {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  badge?: string;
}

interface PlatformActions {
  meta: QuickAction[];
  google: QuickAction[];
}

const quickActions: PlatformActions = {
  meta: [
    {
      title: "Tek Tuşla Reklam",
      description: "Tek tıkla AI destekli reklam oluşturun.",
      icon: <Play className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
    },
    {
      title: "Gönderini Öne Çıkar",
      description: "Instagram veya Meta'da reklamınızı oluşturun.",
      icon: <Target className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
    },
    {
      title: "En İyi Reklamı Çoğalt",
      description: "Başarılı reklamınızı hızla yeniden oluşturun.",
      icon: <BarChart2 className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      title: "Kırık Bağlantıları Kontrol Et",
      description: "Bağlantıları tarar ve kırık olanları tespit eder.",
      icon: <Zap className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    {
      title: "Yorumları Gör ve Yanıtla",
      description: "Meta ve Instagram'daki yorumları görüntüleyin ve hızlıca...",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
      badge: "Yakında",
    },
    {
      title: "Son 15 Günde",
      description: "Yakında yayınlanacak özel bir özellik için hazırlanın!",
      icon: <Heart className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
      badge: "Yakında",
    },
  ],
  google: [
    {
      title: "Anahtar Kelime Analizi",
      description: "Google Ads için anahtar kelime önerileri alın.",
      icon: <Search className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
    },
    {
      title: "Reklam Metni Oluştur",
      description: "AI destekli reklam metinleri oluşturun.",
      icon: <FileText className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
    },
    // ... diğer Google Ads aksiyonları
  ],
};

const learningItems = [
  {
    title: "Meta Business",
    description: "Meta Business hesabı ile ilk başlangıcı sağlayın ve işletmenizi büyütün.",
    icon: <Facebook className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Google Ads",
    description: "Google arama ağında firmanız için bu adımları tamamlayın.",
    icon: <Chrome className="w-8 h-8 text-red-500" />,
  },
  {
    title: "Reklamlar",
    description: "İyzads 101 eğitimini izleyerek paneli tek tek öğren.",
    icon: <LayoutDashboard className="w-8 h-8 text-purple-500" />,
  },
  {
    title: "Raporlar",
    description: "İyzads Raporlar ile tüm istatistikleri tek yerden takip et.",
    icon: <PieChart className="w-8 h-8 text-orange-500" />,
  },
  {
    title: "Strateji",
    description: "Tek tıkla firmanızın iyzads'e bağlayın.",
    icon: <BrainCircuit className="w-8 h-8 text-emerald-500" />,
  },
  {
    title: "Optimizasyon",
    description: "Optimizasyon önerilerini reklamlarınıza uygulayın.",
    icon: <Settings className="w-8 h-8 text-gray-600" />,
  },
];

export default function HomePage() {
  const [activeAds, setActiveAds] = useState<"meta" | "google">("meta");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <span className="text-sm font-medium">BG</span>
              </div>
              <div>
                <h2 className="text-lg font-medium">Merhaba, Baturalp 👋</h2>
                <p className="text-sm text-muted-foreground">İyzads'e tekrar hoş geldin.</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Miaso</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-4 h-4" />
                <span>12 - 18 Mar</span>
                <div className="bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm font-medium">₺0,34</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Planınız:</span>
                  <span className="text-sm font-medium">Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8">
        {/* Platform Selection */}
        <div className="flex items-center gap-4 mb-12">
          <Button 
            variant={activeAds === "meta" ? "default" : "outline"}
            size="lg"
            className="flex items-center gap-2 min-w-[200px]"
            onClick={() => setActiveAds("meta")}
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>Meta Ads</span>
          </Button>
          <Button 
            variant={activeAds === "google" ? "default" : "outline"}
            size="lg"
            className="flex items-center gap-2 min-w-[200px]"
            onClick={() => setActiveAds("google")}
          >
            <Chrome className="w-5 h-5 text-red-500" />
            <span>Google Ads</span>
          </Button>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium mb-2">Hızlı Aksiyonlar</h3>
            <p className="text-sm text-muted-foreground">Önemli işlemleri tek tıkla gerçekleştirmenizi sağlar.</p>
          </div>
          <div className="bg-white rounded-2xl p-8">
            <div className="grid grid-cols-3 gap-6">
              {quickActions[activeAds].map((action, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`${action.color} p-3 rounded-xl`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    {action.badge && (
                      <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
                        {action.badge}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* iyzads 101 */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">iyzads 101</h3>
            <Button variant="link" className="text-sm text-primary">
              Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {learningItems.map((item, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  {item.icon}
                  <div>
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 