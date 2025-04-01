"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const searchParams = useSearchParams();
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(searchParams.get('registered') === 'true');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const MAX_LOGIN_ATTEMPTS = 5;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 dakika

  useEffect(() => {
    // Sayfa yüklendiğinde local storage'dan login denemelerini kontrol et
    const storedAttempts = localStorage.getItem('loginAttempts');
    const blockTime = localStorage.getItem('blockUntil');
    
    if (blockTime && new Date().getTime() < parseInt(blockTime)) {
      setIsBlocked(true);
    } else {
      localStorage.removeItem('blockUntil');
      localStorage.removeItem('loginAttempts');
      setLoginAttempts(0);
    }
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Form error state
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setShowRegistrationMessage(false);

    // Giriş denemesi limiti kontrolü
    if (isBlocked) {
      const blockUntil = parseInt(localStorage.getItem('blockUntil') || '0');
      const remainingTime = Math.ceil((blockUntil - new Date().getTime()) / 1000 / 60);
      setFormError(`Çok fazla başarısız deneme. Lütfen ${remainingTime} dakika sonra tekrar deneyin.`);
      return;
    }

    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      const blockUntil = new Date().getTime() + BLOCK_DURATION;
      localStorage.setItem('blockUntil', blockUntil.toString());
      setIsBlocked(true);
      setFormError(`Çok fazla başarısız deneme. Lütfen 15 dakika sonra tekrar deneyin.`);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // XSS koruması için input sanitization
      const sanitizedEmail = formData.email.trim().toLowerCase();
      
      // Login attempt
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: formData.password,
      });

      if (error) throw error;

      // Successful login
      if (data.user) {
        // Başarılı girişte deneme sayısını sıfırla
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('blockUntil');
        setLoginAttempts(0);

        // Log login attempt
        await supabase.from('login_attempts').insert({
          email: sanitizedEmail,
          ip_address: '0.0.0.0',
          success: true,
          user_agent: navigator.userAgent // Tarayıcı bilgisi
        });

        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Başarısız deneme sayısını artır
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      // Log failed attempt
      const supabase = createClient();
      await supabase.from('login_attempts').insert({
        email: formData.email.trim().toLowerCase(),
        ip_address: '0.0.0.0',
        success: false,
        user_agent: navigator.userAgent
      });

      if (error instanceof Error && error.message === 'Email not confirmed') {
        setFormError("Lütfen e-posta adresinize gelen doğrulama linkine tıklayarak hesabınızı doğrulayın.");
      } else {
        setFormError("E-posta veya şifre hatalı");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);
    setResetSuccess(false);

    try {
      const supabase = createClient();
      
      // XSS koruması için input sanitization
      const sanitizedEmail = resetEmail.trim().toLowerCase();
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetSuccess(true);
      setResetEmail("");
      
    } catch (error) {
      console.error('Password reset error:', error);
      setFormError("Şifre sıfırlama işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsResetLoading(false);
    }
  };

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

      {/* Sağ taraf - Login formu */}
      <div className="bg-white flex-1 lg:flex lg:items-center lg:justify-center">
        <div className="w-full max-w-[440px] mx-auto px-6 lg:px-8 pt-4 lg:pt-0">
          <h2 className="text-xl lg:text-2xl font-bold text-[#0E1414] mb-6">Giriş Yap</h2>

          {showRegistrationMessage && (
            <div className="mb-4 p-3 bg-[#0E1414] border border-[#0E1414] text-[#FDDD35] rounded">
              Hesabınız başarıyla oluşturuldu! Lütfen e-posta adresinize gelen doğrulama linkine tıklayarak hesabınızı doğrulayın.
            </div>
          )}
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-sm font-medium text-[#0E1414]">Şifre</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Şifrenizi giriniz"
                  className="w-full h-11 lg:h-12 pr-10 bg-white border-[#0E1414] focus:border-[#0E1414] focus:ring-[#0E1414]/50 placeholder:text-gray-400"
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
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#0E1414] hover:text-[#FDDD35] font-bold transition-colors"
              >
                Şifremi Unuttum
              </button>
            </div>
            <Button 
              type="submit"
              className="w-full bg-[#0E1414] hover:bg-[#FDDD35] h-11 lg:h-12 text-[15px] font-bold text-[#FDDD35] hover:text-[#0E1414] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Giriş Yapılıyor...
                </div>
              ) : (
                "Giriş Yap"
              )}
            </Button>
            <div className="text-center text-xs lg:text-sm text-[#0E1414]">
              Hesabın yok mu?{" "}
              <Link href="/register" className="text-[#0E1414] hover:text-[#FDDD35] font-bold transition-colors">
                Hemen yeni bir hesap oluştur!
              </Link>
            </div>
          </form>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg w-full max-w-[400px] p-6 relative">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetSuccess(false);
                setResetEmail("");
                setFormError(null);
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold text-[#0E1414] mb-4">Şifremi Unuttum</h3>
            
            {resetSuccess ? (
              <div className="text-center space-y-4">
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail("");
                  }}
                  className="w-full bg-[#0E1414] hover:bg-[#FDDD35] h-11 text-[15px] font-bold text-[#FDDD35] hover:text-[#0E1414] transition-colors"
                >
                  Tamam
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0E1414]">E-Posta</label>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="E-Posta adresinizi girin"
                    className="w-full h-11 bg-white border-[#0E1414] focus:border-[#0E1414] focus:ring-[#0E1414]/50 placeholder:text-gray-400"
                    required
                  />
                </div>
                
                {formError && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {formError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#0E1414] hover:bg-[#FDDD35] h-11 text-[15px] font-bold text-[#FDDD35] hover:text-[#0E1414] transition-colors"
                  disabled={isResetLoading}
                >
                  {isResetLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Gönderiliyor...
                    </div>
                  ) : (
                    "Şifre Sıfırlama Bağlantısı Gönder"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 