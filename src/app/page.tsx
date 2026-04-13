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
  startOfToday,
  addHours
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
  Share2,
  Plus
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
  // Medicina Interna II
  { date: new Date(2026, 4, 13), name: '1° Parcial (Reumatología)', subject: 'Medicina Interna II' },
  { date: new Date(2026, 4, 19), name: '2° Parcial (Hematología)', subject: 'Medicina Interna II' },
  { date: new Date(2026, 6, 30), name: '3° Parcial (Toxicología)', subject: 'Medicina Interna II' },
  { date: new Date(2026, 7, 12), name: '4° Parcial (Med. Familiar)', subject: 'Medicina Interna II' },
  { date: new Date(2026, 9, 8), name: '5° Parcial (Med. Crítica)', subject: 'Medicina Interna II' },
  
  // Clínica Quirúrgica II
  { date: new Date(2026, 4, 8), name: '1° Parcial', subject: 'Clínica Quirúrgica II' },
  { date: new Date(2026, 5, 26), name: '2° Parcial', subject: 'Clínica Quirúrgica II' },
  { date: new Date(2026, 8, 11), name: '3° Parcial', subject: 'Clínica Quirúrgica II' },
  { date: new Date(2026, 10, 6), name: '4° Parcial', subject: 'Clínica Quirúrgica II' },

  // PH V
  { date: new Date(2026, 4, 21), name: '1° Parcial', subject: 'PH V' },
  { date: new Date(2026, 5, 18), name: '2° Parcial', subject: 'PH V' },

  // Praxis Médica y Legal
  { date: new Date(2026, 8, 15), name: '1° Parcial', subject: 'Praxis Médica y Legal' },
  { date: new Date(2026, 10, 10), name: '2° Parcial', subject: 'Praxis Médica y Legal' },

  // Cibernética V
  { date: new Date(2026, 4, 15), name: '1° Parcial', subject: 'Cibernética V' },
  { date: new Date(2026, 5, 12), name: '2° Parcial', subject: 'Cibernética V' },

  // Cirugía Básica V
  { date: new Date(2026, 5, 5), name: '1° Parcial', subject: 'Cirugía Básica V' },
  { date: new Date(2026, 9, 23), name: '2° Parcial', subject: 'Cirugía Básica V' },

  // Inglés V
  { date: new Date(2026, 3, 29), name: '1° Parcial (A-B-C)', subject: 'Inglés V' },
  { date: new Date(2026, 7, 5), name: '2° Parcial (A-B-C)', subject: 'Inglés V' },
  { date: new Date(2026, 9, 28), name: '3° Parcial (A-B-C)', subject: 'Inglés V' },

  // Italiano V
  { date: new Date(2026, 5, 16), name: '1° Parcial (A-B)', subject: 'Italiano V' },
  { date: new Date(2026, 9, 27), name: '2° Parcial (A-B)', subject: 'Italiano V' },

  // Tocoginecología
  { date: new Date(2026, 4, 26), name: '1° Parcial', subject: 'Tocoginecología' },
  { date: new Date(2026, 6, 2), name: '2° Parcial', subject: 'Tocoginecología' },
  { date: new Date(2026, 8, 29), name: '3° Parcial', subject: 'Tocoginecología' },

  // Pediatría y Neonatología
  { date: new Date(2026, 5, 2), name: '1° Parcial', subject: 'Pediatría y Neonatología' },
  { date: new Date(2026, 8, 9), name: '2° Parcial', subject: 'Pediatría y Neonatología' },
  { date: new Date(2026, 10, 3), name: '3° Parcial', subject: 'Pediatría y Neonatología' },

  // Humanística V
  { date: new Date(2026, 4, 4), name: '1° Parcial', subject: 'Humanística V' },
  { date: new Date(2026, 5, 22), name: '2° Parcial', subject: 'Humanística V' },

  // Diagnóstico por Imágenes V
  { date: new Date(2026, 5, 10), name: '1° Parcial', subject: 'Diagnóstico por Imágenes V' },
  { date: new Date(2026, 9, 21), name: '2° Parcial', subject: 'Diagnóstico por Imágenes V' },
];

// Ayudante para generar links de Google Calendar
const getGoogleCalendarLink = (event: any) => {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const startStr = format(event.date, "yyyyMMdd");
  const endStr = format(addHours(event.date, 1), "yyyyMMdd");
  const text = encodeURIComponent(`${event.subject ? event.subject + ': ' : ''}${event.name}`);
  const details = encodeURIComponent(`${event.subject || ''} ${event.docent || ''} ${event.place || ''}`.trim());
  const location = encodeURIComponent(event.place || "IUNIR");
  return `${base}&text=${text}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
};

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'schedule' | 'exams' | 'rotations'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 13));
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const today = startOfToday();

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
            <p className="text-slate-500 font-medium italic">Sincronizado con Google Calendar</p>
          </div>
          
          {nextExam && (
            <div className="flex items-center gap-4 bg-rose-600 text-white p-4 rounded-3xl shadow-lg shadow-rose-200 border-2 border-white/20">
              <div className="bg-white/20 p-2.5 rounded-2xl">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Próximo Parcial</p>
                <h4 className="font-bold text-sm leading-tight">{nextExam.name}</h4>
                <p className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-lg mt-1 inline-block">
                  {daysUntilNextExam === 0 ? "¡ES HOY! 🚀" : `Faltan ${daysUntilNextExam} días`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
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

        {/* CONTENIDO */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                  <h2 className="text-xl font-black capitalize text-slate-800">{format(currentDate, 'MMMM yyyy', { locale: es })}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2.5 hover:bg-white rounded-xl text-slate-500 transition-all border border-transparent hover:border-slate-100"><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentDate(new Date(2026, 3, 13))} className="px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-white rounded-xl border border-transparent hover:border-slate-100">Hoy</button>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2.5 hover:bg-white rounded-xl text-slate-500 transition-all border border-transparent hover:border-slate-100"><ChevronRight size={20}/></button>
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
                          "p-2 border-r border-b border-slate-50 transition-all cursor-pointer relative",
                          !isSameMonth(day, monthStart) && "opacity-20",
                          isSel && "bg-indigo-50/40"
                        )}
                      >
                        <span className={cn(
                          "inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-xl mb-1 transition-all",
                          isToday ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400"
                        )}>{format(day, 'd')}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayExams.map((_, idx) => <div key={idx} className="w-full h-1.5 rounded-full bg-rose-500 animate-pulse" />)}
                          {dayRotations.map((_, idx) => <div key={idx} className="w-full h-1.5 rounded-full bg-amber-400" />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
                  <h3 className="text-lg font-black mb-6 text-indigo-950 flex items-center gap-2"><TrendingUp size={20} className="text-indigo-600" /> Agenda</h3>
                  {selectedDay ? (
                    <div className="space-y-4">
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg w-fit">{format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}</p>
                      
                      {EXAMS.filter(e => isSameDay(e.date, selectedDay)).map((e, idx) => (
                        <div key={idx} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest">Parcial</span>
                            <a 
                              href={getGoogleCalendarLink(e)} 
                              target="_blank" 
                              className="p-1.5 bg-white text-rose-600 rounded-lg shadow-sm border border-rose-100 hover:scale-110 transition-transform"
                              title="Añadir a Google Calendar"
                            >
                              <Plus size={14} />
                            </a>
                          </div>
                          <p className="font-bold text-rose-900 leading-tight">{e.name}</p>
                          <p className="text-[11px] text-rose-700/70 mt-1 font-bold">{e.subject}</p>
                        </div>
                      ))}

                      {ROTATIONS.filter(r => isSameDay(r.date, selectedDay)).map((r, idx) => (
                        <div key={idx} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Rotación</span>
                            <a 
                              href={getGoogleCalendarLink(r)} 
                              target="_blank" 
                              className="p-1.5 bg-white text-amber-600 rounded-lg shadow-sm border border-amber-100 hover:scale-110 transition-transform"
                            >
                              <Plus size={14} />
                            </a>
                          </div>
                          <p className="font-bold text-amber-900 leading-tight">{r.name}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-800/60"><Clock size={12}/> {r.time}</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-800/60"><MapPin size={12}/> {r.place}</div>
                          </div>
                        </div>
                      ))}

                      {EXAMS.filter(e => isSameDay(e.date, selectedDay)).length === 0 && 
                       ROTATIONS.filter(r => isSameDay(r.date, selectedDay)).length === 0 && (
                        <div className="py-12 flex flex-col items-center gap-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <BookOpen className="text-slate-300" size={24} />
                          <p className="text-xs text-slate-400 font-bold italic">Día libre de eventos</p>
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
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 group">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center justify-between">{day.day} <span className="w-8 h-1 bg-slate-100 group-hover:bg-indigo-600 transition-all rounded-full" /></h3>
                  <div className="space-y-3">
                    {day.items.map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">{item.time}</span>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Examen</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Fecha</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {EXAMS.sort((a,b) => a.date.getTime() - b.date.getTime()).map((e, idx) => {
                    const isPast = isAfter(today, e.date) && !isSameDay(today, e.date);
                    const daysLeft = differenceInDays(e.date, today);
                    return (
                      <tr key={idx} className={cn("hover:bg-slate-50/50 transition-colors", isPast && "opacity-40")}>
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-indigo-950 leading-tight">{e.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{e.subject}</p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">{format(e.date, 'dd MMM', { locale: es })}</span>
                            {!isPast && (
                              <span className={cn(
                                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit mt-1",
                                daysLeft <= 7 ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"
                              )}>
                                {daysLeft === 0 ? "¡Hoy!" : `Faltan ${daysLeft} días`}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {!isPast && (
                            <a 
                              href={getGoogleCalendarLink(e)} 
                              target="_blank" 
                              className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 transition-all"
                            >
                              <Plus size={14} /> GOOGLE
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'rotations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ROTATIONS.sort((a,b) => a.date.getTime() - b.date.getTime()).map((r, idx) => {
                const isPast = isAfter(today, r.date) && !isSameDay(today, r.date);
                return (
                  <div key={idx} className={cn(
                    "bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex gap-6 group transition-all",
                    isPast && "opacity-50"
                  )}>
                    <div className="flex flex-col items-center justify-center bg-amber-50 text-amber-600 w-16 h-16 rounded-2xl shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
                      <span className="text-lg font-black leading-none">{format(r.date, 'dd')}</span>
                      <span className="text-[9px] font-black uppercase">{format(r.date, 'MMM')}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-indigo-950 text-base">{r.name}</h3>
                        {!isPast && (
                          <a href={getGoogleCalendarLink(r)} target="_blank" className="p-1.5 bg-slate-50 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                            <Share2 size={14} />
                          </a>
                        )}
                      </div>
                      <div className="space-y-1 text-[11px] font-bold text-slate-400">
                        <div className="flex items-center gap-1.5"><MapPin size={12} className="text-amber-500" /> {r.place}</div>
                        <div className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-400" /> {r.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
      
      {/* Footer Branded */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-slate-200 px-8 py-3 rounded-full z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-1000">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-rose-500 border-2 border-white" />
          <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white" />
          <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">IUNIR MED 2026</p>
      </div>
    </div>
  );
}
