import { useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, AlertTriangle, Mic, Home, Map, Bell, User } from 'lucide-react'

// The mobile app rendered inside a phone frame
function MobileScreen() {
  const [activeTab, setActiveTab] = useState<'home' | 'alerts' | 'map' | 'profile'>('home')

  return (
    <div className="h-full flex flex-col bg-[#f2fcf4] overflow-hidden">
      {/* Status bar */}
      <div className="bg-[#0f3d2e] px-4 pt-10 pb-3 text-white flex items-center justify-between text-xs">
        <span className="font-semibold">KisanSetu AI</span>
        <span className="font-mono">09:42 · ⚡ 87%</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <div className="p-4 space-y-4">
            {/* Greeting */}
            <div className="bg-[#0f3d2e] rounded-2xl p-4 text-white">
              <p className="text-xs text-[#a2d1bb] mb-1">नमस्कार,</p>
              <p className="text-lg font-bold font-display">Ramesh Patil 🙏</p>
              <p className="text-xs text-[#a2d1bb]">वाशीम, महाराष्ट्र · MH-WSM-4029</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-[#7CD959]/20 rounded-xl p-2.5 text-center">
                  <p className="text-xl font-bold font-display text-[#7CD959]">78</p>
                  <p className="text-[10px] text-[#a2d1bb]">रिझिलियन्स</p>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-lg font-bold font-mono">₹1.8L</p>
                  <p className="text-[10px] text-[#a2d1bb]">KCC मर्यादा</p>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-lg font-bold">A-1</p>
                  <p className="text-[10px] text-[#a2d1bb]">टियर</p>
                </div>
              </div>
            </div>

            {/* NDVI tile */}
            <div className="bg-white rounded-2xl p-4 border border-[#c0c8c3]/30 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-[#00261a]">🛰️ आजचे NDVI</p>
                <span className="text-[10px] bg-[#9afa75]/30 text-[#1f6d00] px-2 py-0.5 rounded-full font-semibold">इष्टतम</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold font-display text-[#00261a] font-mono">0.71</div>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-[#e6f0e9]">
                    <div className="h-full w-[71%] rounded-full bg-[#7CD959]" />
                  </div>
                  <p className="text-[10px] text-[#414944] mt-1">Sentinel-2 · 09:42 IST</p>
                </div>
              </div>
            </div>

            {/* Alert */}
            <div className="bg-[#ffdea8]/40 border border-[#fabc41]/40 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#2d1e00] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#2d1e00]">पाऊस तूट सतर्कता ⚠️</p>
                  <p className="text-xs text-[#414944] mt-0.5 leading-relaxed">
                    वाशीम जिल्ह्यात 23% कमी पाऊस. आठवड्याभरात सिंचन आवश्यक.
                  </p>
                  <button className="mt-2 text-xs font-bold text-[#1f6d00]">अधिक माहिती →</button>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <p className="text-sm font-bold text-[#00261a] mb-3">जलद सेवा</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🌿', label: 'सल्ला विचारा' },
                  { icon: '🌧️', label: 'हवामान' },
                  { icon: '📋', label: 'पासपोर्ट' },
                  { icon: '💰', label: 'कर्ज घ्या' },
                  { icon: '📊', label: 'बाजारभाव' },
                  { icon: '🆘', label: 'आपत्कालीन' },
                ].map(a => (
                  <button key={a.label} className="bg-white border border-[#c0c8c3]/30 rounded-xl p-3 text-center shadow-xs hover:bg-[#ecf6ef] transition-colors">
                    <div className="text-xl mb-1">{a.icon}</div>
                    <p className="text-[10px] text-[#00261a] font-semibold">{a.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Advisory chat shortcut */}
            <div className="bg-white border border-[#c0c8c3]/30 rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-bold text-[#00261a] mb-3">🤖 AI सल्लागार</p>
              <div className="bg-[#e6f0e9] rounded-xl p-3 mb-3">
                <p className="text-xs text-[#414944]">माझ्या सोयाबीनला कोणते खत द्यावे?</p>
              </div>
              <div className="bg-[#f2fcf4] border border-[#9afa75]/30 rounded-xl p-3 mb-3">
                <p className="text-xs text-[#00261a] leading-relaxed">
                  तुमच्या काळ्या मातीत हेक्टरी 20 किलो नायट्रोजन, 80 किलो फॉस्फरस आणि 40 किलो पोटॅश द्यावे...
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#e6f0e9] rounded-full px-3 py-2 text-xs text-[#414944]">
                  प्रश्न टाइप करा...
                </div>
                <button className="w-8 h-8 rounded-full bg-[#9afa75] flex items-center justify-center">
                  <Mic className="w-4 h-4 text-[#052100]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="p-4 space-y-4">
            <p className="text-sm font-bold text-[#00261a]">सतर्कता आणि अलर्ट</p>
            {[
              { color: '#ffdea8', icon: '⚠️', title: 'पाऊस तूट', body: 'वाशीम - 23% कमी पाऊस. सिंचन आवश्यक.', time: 'आज 6:00 AM' },
              { color: '#ffdea8', icon: '🐛', title: 'खोड माशी धोका', body: 'NDMI विश्लेषण: प्रारंभिक संसर्ग आढळला.', time: 'काल 2:30 PM' },
              { color: '#beedd7', icon: '☔', title: 'पाऊस अंदाज', body: '10-14 ऑक्टोबर: 8-12mm पाऊस (80%)', time: 'आज 7:00 AM' },
              { color: '#beedd7', icon: '💳', title: 'KCC नूतनीकरण', body: 'तुमचे KCC 31 मार्च 2026 रोजी संपेल.', time: 'कालच्या दिवशी' },
            ].map((a, i) => (
              <div key={i} className="rounded-2xl border border-[#c0c8c3]/30 overflow-hidden">
                <div className="p-3" style={{ background: `${a.color}40` }}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{a.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#00261a]">{a.title}</p>
                      <p className="text-xs text-[#414944] mt-0.5">{a.body}</p>
                    </div>
                    <p className="text-[10px] text-[#717974] whitespace-nowrap">{a.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="p-4 space-y-4">
            <p className="text-sm font-bold text-[#00261a]">शेत नकाशा</p>
            <div className="relative h-64 rounded-2xl overflow-hidden bg-[#0f3d2e]">
              <svg className="w-full h-full" viewBox="0 0 300 200">
                <polygon fill="#227400" opacity="0.85" points="10,20 150,8 165,130 30,140" stroke="#7CD959" strokeWidth="1.5" />
                <polygon fill="#7CD959" opacity="0.8" points="150,8 295,15 280,100 165,130" stroke="#9afa75" strokeWidth="1.5" />
                <polygon fill="#3A9E48" opacity="0.85" points="30,140 165,130 140,200 10,185" stroke="#7CD959" strokeWidth="1.5" />
                <polygon fill="#F5B83D" opacity="0.75" points="165,130 280,100 295,200 140,200" stroke="#ffdea8" strokeWidth="1.5" />
              </svg>
              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-lg text-white text-[10px] font-mono">
                20.1134° N, 77.1319° E
              </div>
              <div className="absolute bottom-2 right-2 bg-[#7CD959]/90 px-2 py-1 rounded-lg text-[#052100] text-[10px] font-bold">
                NDVI 0.71 ✓
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'क्षेत्रफळ', value: '2.4 हेक्टर' },
                { label: 'सर्व्हे क्र.', value: '42/B' },
                { label: 'माती', value: 'काळी (Vertisol)' },
                { label: 'पीक', value: 'सोयाबीन' },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-xl p-3 border border-[#c0c8c3]/30">
                  <p className="text-[10px] text-[#714944]">{m.label}</p>
                  <p className="text-sm font-bold text-[#00261a]">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#0f3d2e] rounded-2xl p-5 text-center text-white">
              <div className="w-16 h-16 rounded-2xl bg-[#7CD959]/30 border-2 border-[#7CD959] flex items-center justify-center text-2xl font-bold mx-auto mb-3">RP</div>
              <p className="text-lg font-bold font-display">Ramesh Dattatray Patil</p>
              <p className="text-sm text-[#a2d1bb]">Washim, Maharashtra</p>
              <p className="text-xs text-[#717974] font-mono mt-1">KSU-2025-MH-018742</p>
            </div>
            <div className="space-y-2">
              {[
                ['आधार', 'XXXX-XXXX-7842'],
                ['मोबाइल', '+91 98232 45678'],
                ['KCC कार्ड', 'KCC/MH/2023/087234'],
                ['बँक', 'SBI वाशीम'],
              ].map(([label, value]) => (
                <div key={label} className="bg-white rounded-xl p-3 border border-[#c0c8c3]/30 flex justify-between">
                  <span className="text-sm text-[#414944]">{label}</span>
                  <span className="text-sm font-mono font-semibold text-[#00261a]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-[#c0c8c3]/30 px-4 py-3 grid grid-cols-4 gap-1 shadow-md">
        {[
          { id: 'home' as const, icon: Home, label: 'मुख्यपृष्ठ' },
          { id: 'alerts' as const, icon: Bell, label: 'सतर्कता' },
          { id: 'map' as const, icon: Map, label: 'नकाशा' },
          { id: 'profile' as const, icon: User, label: 'प्रोफाइल' },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${
                activeTab === tab.id ? 'text-[#00261a]' : 'text-[#717974]'
              }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#1f6d00]' : ''}`} />
              <span className="text-[9px] font-semibold">{tab.label}</span>
              {activeTab === tab.id && <span className="w-1 h-1 rounded-full bg-[#7CD959]" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function MobileAppPage() {
  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-4 flex flex-col items-center">
      <div className="mb-8 text-center space-y-2">
        <span className="section-label">
          <Smartphone className="w-3.5 h-3.5" />
          Farmer Mobile App
        </span>
        <h1 className="text-headline-xl text-primary font-display font-bold">
          Low-Bandwidth Mobile App
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-xl">
          Designed for ₹500 feature phones with 2G connectivity. Available in 9 Indian languages.
          Works offline with cached data.
        </p>
      </div>

      {/* Phone frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto rounded-[3rem] border-8 border-primary-container shadow-2xl overflow-hidden"
        style={{ width: 375, height: 812 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-primary-container rounded-b-2xl z-10" />
        <MobileScreen />
      </motion.div>

      {/* Feature chips */}
      <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-2xl">
        {[
          '9 भारतीय भाषा',
          'ऑफलाइन सपोर्ट',
          '2G नेटवर्क कार्य',
          'SMS अलर्ट',
          'WhatsApp Integration',
          '₹500 फोनवर चालतो',
        ].map(f => (
          <span key={f} className="badge bg-secondary-fixed/20 text-secondary text-label-md px-3 py-1.5">
            ✓ {f}
          </span>
        ))}
      </div>
    </div>
  )
}
