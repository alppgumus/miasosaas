"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const supabase = createClient();
    
    // Kullanıcı oturumunu kontrol et
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
      } else {
        setUser(user);
      }
    };
    
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <div className="pl-64">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
} 