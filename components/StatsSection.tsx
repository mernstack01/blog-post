import { MapPin, Users, ShieldCheck, Zap } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: MapPin,
      value: '10 ta',
      label: 'Shahar va Tumanlar',
      desc: 'Guliston, Yangiyer, Shirin va barcha hududlar',
    },
    {
      icon: Users,
      value: '500+',
      label: 'Mutaxassislar',
      desc: 'Sifatli va sinalgan ustalar bazasi',
    },
    {
      icon: Zap,
      value: '0% Komissiya',
      label: 'Bepul Aloqa',
      desc: "Usta bilan to'g'ridan-to'g'ri bog'laning",
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Ishonchli va Tezkor',
      desc: "Tasdiqlangan telefon va profillar",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-14 sm:py-16 my-12 relative overflow-hidden">
      {/* Fon elementlari */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Nega aynan Sirdaryo Xizmat?
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Viloyatimiz aholisiga qulaylik yaratish maqsadida yaratilgan eng zamonaviy usta va xizmatlar katalogi.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-blue-400/30 transition-all text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                  {item.value}
                </div>
                <div className="text-sm font-semibold text-blue-200 mb-1">
                  {item.label}
                </div>
                <div className="text-xs text-slate-400">
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
