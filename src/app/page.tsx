'use client';

import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  getDay,
  isAfter,
  differenceInDays,
  startOfToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Stethoscope, 
  GraduationCap, 
  MapPin,
  User,
  Calendar as CalendarIcon,
  List,
  AlertCircle,
  TrendingUp,
  Download
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- DATOS DEL 5TO AÑO IUNIR ---

const WEEKLY_SCHEDULE = [
  { day: 'Lunes', items: [
    { time: '08:00 - 10:00', name: 'Medicina del Deporte' },
    { time: '12:00 - 13:30', name: 'Medicina Interna (Seminario)' },
    { time: '15:00 - 16:30', name: 'Clínica (Comisión A)' },
    { time: '16:30 - 19:30', name: 'Humanística' },
  ]},
  { day: 'Martes', items: [
    { time: '08:00 - 09:30', name: 'Italiano (Comisión A)' },
    { time: '13:00 - 14:00', name: 'Medicina Interna' },
    { time: '14:00 - 17:00', name: 'Pediatría (Teórico y Taller)' },
    { time: '17:00 - 19:30', name: 'Tocoginecología' },
    { time: '19:30 - 20:30', name: 'Pediatría (Virtual)' },
  ]},
  { day: 'Miércoles', items: [
    { time: '13:00 - 14:00', name: 'Medicina Interna' },
    { time: '14:00 - 17:00', name: 'Pediatría (Teórico y Taller)' },
    { time: '17:00 - 18:30', name: 'Diagnóstico por Imágenes (V)' },
    { time: '18:30 - 20:00', name: 'Inglés (Comisión A)' },
  ]},
  { day: 'Jueves', items: [
    { time: '13:00 - 14:00', name: 'Medicina Interna' },
    { time: '17:00 - 19:30', name: 'Tocoginecología' },
    { time: '19:30 - 20:30', name: 'Cirugía (Comisión I - T)' },
  ]},
  { day: 'Viernes', items: [
    { time: '08:00 - 09:30', name: 'Cirugía (Comisión I - P)' },
    { time: '13:00 - 14:00', name: 'Medicina Interna' },
    { time: '14:00 - 16:30', name: 'Clínica (Comisión A)' },
    { time: '18:00 - 19:00', name: 'Cibernética (Comisión B)' },
  ]}
];

const ROTATIONS = [
  { date: new Date(2026, 3, 13), name: 'Otorrino 2', time: '09:00 - 10:00', docent: 'Dacunda Luis', place: 'Sanatorio de los Niños' },
  { date: new Date(2026, 3, 16), name: 'UTI 6', time: '10:30 - 12:00', docent: 'Zalazar Pabla', place: 'HIR SUR' },
  { date: new Date(2026, 3, 20), name: 'Gineco 3', time: '10:00 - 11:45', docent: 'Maidagan Rocio', place: 'HIR SUR' },
  { date: new Date(2026, 3, 21), name: 'Pediatría 8', time: '10:00 - 12:00', docent: 'Carne Ciro', place: 'Instituto del Niño' },
  { date: new Date(2026, 3, 23), name: 'Neuro', time: '15:30 - 16:30', docent: 'Sbarra Valeria', place: 'Hospital Pilares' },
  { date: new Date(2026, 3, 29), name: 'Traumatología 2', time: '08:00 - 10:00', docent: 'Polenta Eduardo', place: 'S Plaza' },
  { date: new Date(2026, 4, 7), name: 'PH 7', time: '09:00 - 11:00', docent: 'Slavkes Daniel', place: 'Hospital Provincial' },
  { date: new Date(2026, 4, 28), name: 'Reumatología 4', time: '08:00 - 10:00', docent: 'Milanesio Julieta', place: 'IJS (San Luis 2354)' },
];

const EXAMS = [
  { date: new Date(2026, 4, 13), name: '1° Parcial Reumatología', subject: 'Medicina Interna II' },
  { date: new Date(2026, 4, 19), name: '2° Parcial Hematología', subject: 'Medicina Interna II' },
  { date: new Date(2026, 4, 8), name: '1° Parcial Clínica Quirúrgica', subject: 'Clínica Quirúrgica II' },
  { date: new Date(2026, 4, 15), name: '1° Parcial Cibernética', subject: 'Cibernética V' },
  { date: new Date(2026, 4, 21), name: '1° Parcial PH V', subject: 'PH V' },
  { date: new Date(2026, 4, 26), name: '1° Parcial Tocoginecología', subject: 'Tocoginecología' },
  { date: new Date(2026, 4, 29), name: '1° Parcial Inglés V', subject: 'Inglés V' },
  { date: new Date(2026, 4, 4), name: '1° Parcial Humanística', subject: 'Humanística V' },
  { date: new Date(2026, 5, 2), name: '1° Parcial Pediatría', subject: 'Pediatría y Neonatología' },
  { date: new Date(2026, 5, 5), name: '1° Parcial Cirugía Básica', subject: 'Cirugía Básica V' },
  { date: new Date(2026, 5, 10), name: '1° Parcial Diagnóstico Imágenes', subject: 'Diagnóstico por Imágenes V' },
  { date: new Date(2026, 5, 12), name: '2° Parcial Cibernética', subject: 'Cibernética V' },
  { date: new Date(2026, 5, 16), name: '1° Parcial Italiano V', subject: 'Italiano V' },
  { date: new Date(2026, 5, 18), name: '2° Parcial PH V', subject: 'PH V' },
  { date: new Date(2026, 5, 22), name: '2° Parcial Humanística', subject: 'Humanística V' },
  { date: new Date(2026, 5, 26), name: '2° Parcial Clínica Quirúrgica', subject: 'Clínica Quirúrgica II' },
];

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'schedule' | 'exams' | 'rotations'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 13));
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const today = startOfToday();

  // Calcular el próximo examen más cercano
  const nextExam = useMemo(() => {
    return EXAMS
      .filter(e => isAfter(e.date, today) || isSameDay(e.date, today))
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  }, [today]);

  const daysUntilNextExam = nextExam ? differenceInDays(nextExam.date, today) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8 pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-indigo-950 flex items-center gap-3">
              IUNIR <span className="text-indigo-600">MEDICINA</span>
            </h1>
            <p className="text-slate-500 font-medium italic">"Ad astra per aspera"</p>
          </div>
          
          {/* Widget de Próximo Examen */}
          {nextExam && (
            <div className="flex items-center gap-4 bg-rose-600 text-white p-4 rounded-3xl shadow-lg shadow-rose-200 animate-pulse-slow">
              <div className="bg-white/20 p-2.5 rounded-2xl">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Próximo Parcial</p>
                <h4 className="font-bold text-sm leading-tight">{nextExam.name}</h4>
                <p className="text-xs font-medium opacity-90 mt-1">
                  {daysUntilNextExam === 0 ? "¡ES HOY! 🚀" : `Faltan ${daysUntilNextExam} días`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs de Navegación */}
        <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl mb-8 w-fit overflow-x-auto no-scrollbar border border-slate-200/50">
          {[
            { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
            { id: 'schedule', label: 'Horarios', icon: Clock },
            { id: 'exams', label: 'Parciales', icon: GraduationCap },
            { id: 'rotations', label: 'Rotaciones', icon: Stethoscope },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50" 
                  : "text-slate-500 hover:text-indigo-500 hover:bg-white/50"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                  <h2 className="text-xl font-black capitalize text-slate-800 tracking-tight">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500 hover:text-indigo-600 border border-transparent hover:border-slate-100"><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentDate(new Date(2026, 3, 13))} className="px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100">Hoy</button>
                    <button onClick={nextMonth} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500 hover:text-indigo-600 border border-transparent hover:border-slate-100"><ChevronRight size={20}/></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 bg-white border-b border-slate-50">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                    <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[100px] md:auto-rows-[130px]">
                  {calendarDays.map((day, i) => {
                    const isToday = isSameDay(day, today);
                    const isSel = selectedDay && isSameDay(day, selectedDay);
                    const dayExams = EXAMS.filter(e => isSameDay(e.date, day));
                    const dayRotations = ROTATIONS.filter(r => isSameDay(r.date, day));
                    
                    return (
                      <div 
                        key={i} 
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          "p-2 border-r border-b border-slate-50 transition-all cursor-pointer relative group",
                          !isSameMonth(day, monthStart) && "opacity-20",
                          isSel && "bg-indigo-50/40"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <span className={cn(
                            "inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-xl mb-1 transition-all",
                            isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" : "text-slate-400 group-hover:text-slate-600"
                          )}>{format(day, 'd')}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayExams.map((_, idx) => (
                            <div key={idx} className="w-full h-1.5 rounded-full bg-rose-500 shadow-sm shadow-rose-100 animate-pulse" />
                          ))}
                          {dayRotations.map((_, idx) => (
                            <div key={idx} className="w-full h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-100" />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 sticky top-8">
                  <h3 className="text-lg font-black mb-6 text-indigo-950 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-600" /> Agenda del Día
                  </h3>
                  {selectedDay ? (
                    <div className="space-y-4">
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg w-fit">
                        {format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}
                      </p>
                      
                      {EXAMS.filter(e => isSameDay(e.date, selectedDay)).map((e, idx) => (
                        <div key={idx} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><GraduationCap size={40}/></div>
                          <span className="text-[10px] font-black uppercase text-rose-600 mb-1 block tracking-widest">Examen Parcial</span>
                          <p className="font-bold text-rose-900 leading-tight">{e.name}</p>
                          <p className="text-xs text-rose-700/70 mt-1 font-medium">{e.subject}</p>
                        </div>
                      ))}

                      {ROTATIONS.filter(r => isSameDay(r.date, selectedDay)).map((r, idx) => (
                        <div key={idx} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
                          <span className="text-[10px] font-black uppercase text-amber-600 mb-1 block tracking-widest">Rotación Clínica</span>
                          <p className="font-bold text-amber-900 leading-tight">{r.name}</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-800/70"><Clock size={12}/> {r.time}</div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-800/70"><MapPin size={12}/> {r.place}</div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-800/70"><User size={12}/> {r.docent}</div>
                          </div>
                        </div>
                      ))}

                      {EXAMS.filter(e => isSameDay(e.date, selectedDay)).length === 0 && 
                       ROTATIONS.filter(r => isSameDay(r.date, selectedDay)).length === 0 && (
                        <div className="py-12 flex flex-col items-center gap-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <BookOpen className="text-slate-300" size={32} />
                          <p className="text-sm text-slate-400 font-bold italic tracking-tight">Sin eventos especiales</p>
                        </div>
                      )}
                    </div>
                  ) : <p className="text-slate-400">Selecciona un día.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WEEKLY_SCHEDULE.map((day, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-indigo-100 transition-colors group">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{day.day}</h3>
                    <div className="w-10 h-1 rounded-full bg-slate-100 group-hover:bg-indigo-100" />
                  </div>
                  <div className="space-y-4">
                    {day.items.map((item, i) => (
                      <div key={i} className="flex flex-col gap-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em]">{item.time}</span>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Fecha</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Examen</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Cuenta Regresiva</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {EXAMS.sort((a,b) => a.date.getTime() - b.date.getTime()).map((e, idx) => {
                      const isPast = isAfter(today, e.date) && !isSameDay(today, e.date);
                      const isExamToday = isSameDay(today, e.date);
                      const daysLeft = differenceInDays(e.date, today);
                      
                      return (
                        <tr key={idx} className={cn("hover:bg-slate-50/50 transition-colors group", isPast && "opacity-40")}>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800">{format(e.date, 'dd MMM', { locale: es })}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{format(e.date, 'EEEE', { locale: es })}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-black text-indigo-950">{e.name}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{e.subject}</p>
                          </td>
                          <td className="px-8 py-5">
                            {isPast ? (
                              <span className="text-xs font-bold text-slate-300">-</span>
                            ) : (
                              <div className={cn(
                                "flex items-center gap-2 text-xs font-black px-4 py-2 rounded-2xl border w-fit",
                                isExamToday ? "bg-rose-600 text-white border-rose-600" : 
                                daysLeft <= 7 ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                              )}>
                                {isExamToday ? "¡ES HOY!" : `Faltan ${daysLeft} días`}
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-5">
                            <span className={cn(
                              "text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest",
                              isPast ? "bg-slate-100 text-slate-400" : isExamToday ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                              {isPast ? "Rendido" : isExamToday ? "Hoy" : "Pendiente"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rotations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ROTATIONS.sort((a,b) => a.date.getTime() - b.date.getTime()).map((r, idx) => {
                const isPast = isAfter(today, r.date) && !isSameDay(today, r.date);
                return (
                  <div key={idx} className={cn(
                    "bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 flex gap-6 group hover:border-amber-200 transition-all",
                    isPast && "opacity-50"
                  )}>
                    <div className="flex flex-col items-center justify-center bg-amber-50 text-amber-600 w-20 h-20 rounded-[2rem] shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
                      <span className="text-xl font-black leading-none">{format(r.date, 'dd')}</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter">{format(r.date, 'MMM')}</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-indigo-950 text-lg leading-tight">{r.name}</h3>
                        {!isPast && <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">{r.time}</span>}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><MapPin size={14} className="text-amber-500" /> {r.place}</div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><User size={14} className="text-indigo-400" /> {r.docent}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Footer / Brand */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-lg z-50">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">IUNIR Medicina • 5to Año • 2026</p>
      </div>
    </div>
  );
}
