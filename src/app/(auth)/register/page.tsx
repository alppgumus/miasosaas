"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from "lucide-react";

// Unicode bayrak emojisi oluşturmak için helper fonksiyon
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

type Country = {
  id: number;
  code: string;
  name: string;
  dial_code: string;
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("TR");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching countries:', error);
        return;
      }

      setCountries(data || []);
      setIsLoadingCountries(false);
    };

    fetchCountries();
  }, []);

  const selectedCountryData = countries.find(country => country.code === selectedCountry);

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

      {/* Sağ taraf - Register formu */}
      <div className="bg-white flex-1 lg:flex lg:items-center lg:justify-center">
        <div className="w-full max-w-[440px] mx-auto px-6 lg:px-8 pt-4 lg:pt-0">
          <h2 className="text-xl lg:text-2xl font-bold mb-6">Hesap Oluştur</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 lg:space-y-2.5">
                <label className="text-sm font-medium text-black">Adınız</label>
                <Input
                  type="text"
                  placeholder="Adınızı girin"
                  className="w-full h-11 lg:h-12"
                />
              </div>
              <div className="space-y-2 lg:space-y-2.5">
                <label className="text-sm font-medium text-black">Soyadınız</label>
                <Input
                  type="text"
                  placeholder="Soyadınızı girin"
                  className="w-full h-11 lg:h-12"
                />
              </div>
            </div>
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-black">E-Posta</label>
              <Input
                type="email"
                placeholder="E-Posta adresinizi girin"
                className="w-full h-11 lg:h-12"
              />
            </div>
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-black">Telefon Numarası</label>
              <div className="flex gap-2">
                <Select defaultValue={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-[120px] lg:w-[140px] min-h-[44px] lg:min-h-[48px] h-auto flex items-center">
                    <SelectValue asChild>
                      <div className="flex items-center gap-2">
                        <span>{getFlagEmoji(selectedCountryData?.code || "TR")}</span>
                        <span>{selectedCountryData?.dial_code || "+90"}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-[280px]" align="start">
                    <SelectGroup className="max-h-[280px] overflow-y-auto p-2">
                      {isLoadingCountries ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                        </div>
                      ) : (
                        countries.map((country) => (
                          <SelectItem 
                            key={country.id} 
                            value={country.code}
                            className="rounded-md py-2.5 px-3 focus:bg-gray-100 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{getFlagEmoji(country.code)}</span>
                              <span className="flex-1">{country.name}</span>
                              <span className="text-gray-500 text-sm">{country.dial_code}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  placeholder="Telefon numaranızı girin"
                  className="w-full h-11 lg:h-12"
                />
              </div>
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
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-black">Şifre Tekrar</label>
              <div className="relative">
                <Input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Şifrenizi tekrar giriniz"
                  className="w-full h-11 lg:h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button className="w-full bg-[#40C9A2] hover:bg-[#3BB594] h-11 lg:h-12 text-[15px] font-bold">
              Hesap Oluştur
            </Button>
            <div className="text-center text-xs lg:text-sm text-gray-600">
              Kayıt olarak,{" "}
              <Link href="/terms" className="text-[#40C9A2] hover:underline font-bold">
                Hizmet Şartları
              </Link>{" "}
              ve{" "}
              <Link href="/privacy" className="text-[#40C9A2] hover:underline font-bold">
                Gizlilik Politikası
              </Link>
              'nı kabul etmiş olursunuz.
            </div>
            <div className="text-center text-xs lg:text-sm text-gray-600">
              Hesabın var mı?{" "}
              <Link href="/login" className="text-[#40C9A2] hover:underline font-bold">
                Giriş Yap
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 