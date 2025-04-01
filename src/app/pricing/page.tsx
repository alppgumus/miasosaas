"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const plans = [
  {
    name: "Basic",
    description: "Basic",
    price: "49,00",
    features: [
      "2 Reklam Hesabı",
      "Google Raporları",
      "Meta Raporları",
      "Google Reklamları",
      "Meta Hedef Kitle (AI)",
      "Meta Reklamları",
    ],
  },
  {
    name: "Starter",
    description: "Starter",
    price: "99,00",
    features: [
      "2 Reklam Hesabı",
      "Optimizasyon",
      "Google Raporları",
      "Meta Raporları",
      "Google Reklamları",
      "Meta Hedef Kitle (AI)",
      "Meta Reklamları",
    ],
  },
  {
    name: "Premium",
    description: "Premium",
    price: "199,00",
    features: [
      "2 Reklam Hesabı",
      "lyzstrategy (AI)",
      "Optimizasyon",
      "Google Raporları",
      "Meta Raporları",
      "Google Reklamları",
      "Meta Reklamları",
    ],
  },
];

const allFeatures = [
  "2 Reklam Hesabı",
  "Google Raporları",
  "Meta Raporları",
  "Google Reklamları",
  "Meta Hedef Kitle (AI)",
  "Meta Reklamları",
  "Optimizasyon",
  "lyzstrategy (AI)",
];

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0E1414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image src="/logo-white.png" alt="Miads Logo" width={120} height={40} />
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                <span className="text-sm font-medium text-white">🇹🇷</span>
                <span className="text-sm font-medium text-white">Türkçe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0E1414] mb-4">
            Planları Karşılaştır
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tüm planlar 14 gün ücretsiz deneme süresi içerir. Kredi kartı bilgisi gerektirmez.
            İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>

        {/* Aylık/Yıllık Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === "monthly"
                  ? "bg-white text-[#0E1414] shadow-sm"
                  : "text-gray-600 hover:text-[#0E1414]"
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingInterval("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                billingInterval === "yearly"
                  ? "bg-white text-[#0E1414] shadow-sm"
                  : "text-gray-600 hover:text-[#0E1414]"
              }`}
            >
              Yıllık
              <span className="ml-1 text-[#00BA9D] font-bold">30%</span>
            </button>
          </div>
        </div>

        {/* Karşılaştırma Tablosu */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-200">
                <th className="py-4 px-6 text-left font-medium text-gray-500">Özellikler</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="py-4 px-6 text-center">
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-[#0E1414]">{plan.name}</div>
                      <div className="text-3xl font-bold text-[#0E1414]">
                        ${plan.price}
                        <span className="text-base font-normal text-gray-500 ml-1">
                          / {billingInterval === "monthly" ? "aylık" : "yıllık"}
                        </span>
                      </div>
                      <Link href="/dashboard">
                        <Button className="w-full bg-[#0E1414] hover:bg-[#FDDD35] text-[#FDDD35] hover:text-[#0E1414] transition-colors">
                          Planı Seç
                        </Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, index) => (
                <tr
                  key={feature}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-4 px-6 text-sm text-gray-900">{feature}</td>
                  {plans.map((plan) => (
                    <td key={`${plan.name}-${feature}`} className="py-4 px-6 text-center">
                      {plan.features.includes(feature) ? (
                        <Check className="w-5 h-5 text-[#00BA9D] mx-auto" />
                      ) : (
                        <div className="w-5 h-5 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0E1414] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-white text-sm">
              © 2025 miads. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-8">
              <Link href="/terms" className="text-white text-sm hover:text-[#FDDD35] transition-colors">
                Hizmet Şartları
              </Link>
              <Link href="/privacy" className="text-white text-sm hover:text-[#FDDD35] transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/cookies" className="text-white text-sm hover:text-[#FDDD35] transition-colors">
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 