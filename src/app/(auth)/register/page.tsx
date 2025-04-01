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
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: ""
  });

  // Form error state
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[.!@#$%^&*]/.test(password);
    
    if (!hasUpperCase) return "Şifre en az bir büyük harf içermelidir";
    if (!hasNumber) return "Şifre en az bir rakam içermelidir";
    if (!hasSpecialChar) return "Şifre en az bir özel karakter içermelidir (. ! @ # $ % ^ & *)";
    return null;
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    // Sadece rakamları al
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return "Telefon numarası 10 haneli olmalıdır";
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Anlık validasyon
    if (name === 'phoneNumber') {
      const error = validatePhoneNumber(value);
      setFieldErrors(prev => ({
        ...prev,
        phoneNumber: error || ''
      }));
    } else if (name === 'password') {
      const error = validatePassword(value);
      setFieldErrors(prev => ({
        ...prev,
        password: error || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      setFormError("Şifreler eşleşmiyor");
      return;
    }

    // Validate phone number
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      setFieldErrors(prev => ({ ...prev, phoneNumber: phoneError }));
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setFieldErrors(prev => ({ ...prev, password: passwordError }));
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // If auth successful, create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            country_code: selectedCountry,
            password_hash: "HASHED_BY_SUPABASE" // Supabase handles password hashing
          });

        if (profileError) throw profileError;
      }

      // Redirect to login or verification page
      window.location.href = '/login?registered=true&confirmation_email_sent=true';
      
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(error instanceof Error ? error.message : "Kayıt işlemi sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

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
      <div 
        className="h-20 lg:h-auto lg:min-h-screen flex flex-col relative"
        style={{
          backgroundImage: 'url("/images/bg.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="px-6 lg:px-12 h-20 flex items-center lg:h-auto lg:pt-6">
          <Image src="/logo-white.png" alt="Miads Logo" width={120} height={40} />
        </div>
        
        <div className="hidden lg:flex flex-1 items-center relative z-10">
          <div className="px-12 max-w-[520px] mx-auto">
            <h1 className="text-5xl font-bold text-white mb-5">
              İşte karşınızda
              <br />
              miads!
            </h1>
            <p className="text-white/90 text-lg leading-normal">
              Yapay zeka ve otomasyonla tüm reklam ihtiyaçlarınızı tek panelden kolayca yönetin, zaman ve bütçenizden tasarruf edin.
            </p>
          </div>
        </div>

        {/* Alt kısım - Footer */}
        <div className="hidden lg:block px-12 py-5 text-white/80 text-sm relative z-10">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold">© 2025 miads. Tüm hakları saklıdır.</div>
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
          <h2 className="text-xl lg:text-2xl font-bold text-[#0E1414] mb-6">Hesap Oluştur</h2>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 lg:space-y-2.5">
                <label className="text-sm font-medium text-[#0E1414]">Adınız</label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Adınızı girin"
                  className="w-full h-11 lg:h-12 bg-white border-[#0E1414] focus:border-[#0E1414] focus:ring-[#0E1414]/50 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2 lg:space-y-2.5">
                <label className="text-sm font-medium text-[#0E1414]">Soyadınız</label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Soyadınızı girin"
                  className="w-full h-11 lg:h-12 bg-white border-[#0E1414] focus:border-[#0E1414] focus:ring-[#0E1414]/50 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-[#0E1414]">E-Posta</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="E-Posta adresinizi girin"
                className="w-full h-11 lg:h-12 bg-white border-[#0E1414] focus:border-[#0E1414] focus:ring-[#0E1414]/50 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-[#0E1414]">Telefon Numarası</label>
              <div className="flex gap-2">
                <Select defaultValue={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-[120px] lg:w-[140px] min-h-[44px] lg:min-h-[48px] h-auto flex items-center bg-white border-[#0E1414] text-[#0E1414]">
                    <SelectValue asChild>
                      <div className="flex items-center gap-2">
                        <span>{getFlagEmoji(selectedCountryData?.code || "TR")}</span>
                        <span>{selectedCountryData?.dial_code || "+90"}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-[280px] bg-white" align="start">
                    <SelectGroup className="max-h-[280px] overflow-y-auto p-2">
                      {isLoadingCountries ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-[#0E1414]" />
                        </div>
                      ) : (
                        countries.map((country) => (
                          <SelectItem 
                            key={country.id} 
                            value={country.code}
                            className="rounded-md py-2.5 px-3 focus:bg-[#0E1414]/10 cursor-pointer text-[#0E1414]"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{getFlagEmoji(country.code)}</span>
                              <span className="flex-1">{country.name}</span>
                              <span className="text-[#0E1414] text-sm">{country.dial_code}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="5XX XXX XX XX"
                  className="flex-1 h-11 lg:h-12 bg-white border-[#0E1414] focus:border-[#0E1414] focus:ring-[#0E1414]/50 placeholder:text-gray-400"
                  required
                />
              </div>
              {fieldErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.phoneNumber}</p>
              )}
            </div>
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-[#0E1414]">Şifre</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Şifrenizi girin"
                  className="w-full h-11 lg:h-12 bg-white border-[#0E1414] focus:border-[#0E1414] focus:ring-[#0E1414]/50 placeholder:text-gray-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0E1414]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>
            <div className="space-y-2 lg:space-y-2.5">
              <label className="text-sm font-medium text-[#0E1414]">Şifre Tekrar</label>
              <div className="relative">
                <Input
                  type={showPasswordConfirm ? "text" : "password"}
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="Şifrenizi tekrar girin"
                  className="w-full h-11 lg:h-12 bg-white border-[#0E1414] focus:border-[#0E1414] focus:ring-[#0E1414]/50 placeholder:text-gray-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0E1414]"
                >
                  {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button 
              type="submit"
              className="w-full bg-[#0E1414] hover:bg-[#FDDD35] h-11 lg:h-12 text-[15px] font-bold text-[#FDDD35] hover:text-[#0E1414] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Hesap Oluşturuluyor...
                </div>
              ) : (
                "Hesap Oluştur"
              )}
            </Button>
            <div className="text-center text-xs lg:text-sm text-[#0E1414]">
              Zaten hesabın var mı?{" "}
              <Link href="/login" className="text-[#0E1414] hover:text-[#FDDD35] font-bold transition-colors">
                Hemen giriş yap!
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 