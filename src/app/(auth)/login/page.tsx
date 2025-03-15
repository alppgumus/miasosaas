"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Sol taraf - Hero alanı */}
      <div className="bg-[#40C9A2] h-20 lg:h-auto lg:min-h-screen flex flex-col">
        <div className="px-6 lg:px-12 h-20 flex items-center lg:h-auto lg:pt-6">
          <Image src="/logo-white.png" alt="Miaso Logo" width={120} height={40} />
        </div>
        
        <div className="hidden lg:flex flex-1 items-center">
          <div className="px-12 max-w-[520px] mx-auto">
            <h1 className="text-5xl font-bold text-white mb-5">
              İşte karşınızda
              <br />
              miaso!
            </h1>
            <p className="text-white/90 text-lg leading-normal">
              Yapay zeka ve otomasyonla tüm reklam ihtiyaçlarınızı tek panelden kolayca yönetin, zaman ve bütçenizden tasarruf edin.
            </p>
          </div>
        </div>

        {/* Alt kısım - Footer */}
        <div className="hidden lg:block px-12 py-5 text-white/80 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold">© 2025 miaso. Tüm hakları saklıdır.</div>
            <div className="flex gap-5">
              <Link href="/terms" className="text-white font-bold hover:text-white/90">Hizmet Şartları</Link>
              <Link href="/privacy" className="text-white font-bold hover:text-white/90">Gizlilik Politikası</Link>
              <Link href="/cookies" className="text-white font-bold hover:text-white/90">Çerez Politikası</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ taraf - Login formu */}
      <div className="bg-white flex-1 lg:flex lg:items-center lg:justify-center">
        <div className="w-full max-w-[440px] mx-auto px-6 lg:px-8 pt-4 lg:pt-0">
          <h2 className="text-xl lg:text-2xl font-bold mb-6">Giriş Yap</h2>
          <form className="space-y-4">
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-black">E-Posta</label>
              <Input
                type="email"
                placeholder="E-Posta adresinizi girin"
                className="w-full h-11 lg:h-12"
              />
            </div>
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-black">Şifre</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi giriniz"
                  className="w-full h-11 lg:h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-[#40C9A2] hover:underline font-bold"
              >
                Şifremi Unuttum
              </Link>
            </div>
            <Button className="w-full bg-[#40C9A2] hover:bg-[#3BB594] h-11 lg:h-12 text-[15px] font-bold">
              Giriş Yap
            </Button>
            <div className="text-center text-xs lg:text-sm text-gray-600">
              Hesabın yok mu?{" "}
              <Link href="/register" className="text-[#40C9A2] hover:underline font-bold">
                Hemen yeni bir hesap oluştur!
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 