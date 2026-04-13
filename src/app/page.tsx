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
  isAfter
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
  ClipboardList,
  ExternalLink,
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

  // Función para generar archivo ICS para Google Calendar
  const exportToGoogle = () => {
    alert("Generando archivo de sincronización para Google Calendar...\n\n(En un entorno real, aquí conectaríamos con la API de Google)");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-indigo-950 flex items-center gap-3">
              IUNIR <span className="text-indigo-600">MEDICINA</span>
            </h1>
            <p className="text-slate-500 font-medium">Cronograma Académico 5to Año • 2026</p>
          </div>
          <button 
            onClick={exportToGoogle}
            className="flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all font-bold text-sm"
          >
            <CalendarIcon size={18} className="text-indigo-600" />
            Sincronizar con Google
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl mb-8 w-fit overflow-x-auto no-scrollbar">
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
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENIDO PRINCIPAL SEGÚN TAB */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* TAB: CALENDARIO */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-slate-50">
                  <h2 className="text-xl font-black capitalize text-slate-800">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 rounded-xl">Hoy</button>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronRight size={20}/></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                    <div key={d} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[100px] md:auto-rows-[120px]">
                  {calendarDays.map((day, i) => {
                    const isToday = isSameDay(day, new Date());
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
                          isSel && "bg-indigo-50/50 ring-2 ring-inset ring-indigo-200/50"
                        )}
                      >
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full mb-1",
                          isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400"
                        )}>{format(day, 'd')}</span>
                        <div className="space-y-1">
                          {dayExams.map((e, idx) => (
                            <div key={idx} className="w-full h-1.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200" title={e.name} />
                          ))}
                          {dayRotations.map((r, idx) => (
                            <div key={idx} className="w-full h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200" title={r.name} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Detalle lateral en Calendario */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                  <h3 className="text-lg font-black mb-4 text-indigo-950 flex items-center gap-2">
                    <List size={20} className="text-indigo-600" /> Detalle del día
                  </h3>
                  {selectedDay ? (
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-slate-500 capitalize">{format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}</p>
                      
                      {/* Exámenes del día */}
                      {EXAMS.filter(e => isSameDay(e.date, selectedDay)).map((e, idx) => (
                        <div key={idx} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                          <span className="text-[10px] font-black uppercase text-rose-600 mb-1 block tracking-widest">Examen Parcial</span>
                          <p className="font-bold text-rose-900">{e.name}</p>
                          <p className="text-xs text-rose-700/70 mt-1">{e.subject}</p>
                        </div>
                      ))}

                      {/* Rotaciones del día */}
                      {ROTATIONS.filter(r => isSameDay(r.date, selectedDay)).map((r, idx) => (
                        <div key={idx} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-2">
                          <span className="text-[10px] font-black uppercase text-amber-600 mb-1 block tracking-widest">Rotación Clínica</span>
                          <p className="font-bold text-amber-900">{r.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-amber-800/70"><Clock size={12}/> {r.time}</div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-800/70"><MapPin size={12}/> {r.place}</div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-800/70"><User size={12}/> {r.docent}</div>
                        </div>
                      ))}

                      {EXAMS.filter(e => isSameDay(e.date, selectedDay)).length === 0 && 
                       ROTATIONS.filter(r => isSameDay(r.date, selectedDay)).length === 0 && (
                        <p className="text-sm text-slate-400 italic py-8 text-center bg-slate-50 rounded-2xl">No hay eventos especiales este día.</p>
                      )}
                    </div>
                  ) : <p className="text-slate-400">Selecciona un día para ver más.</p>}
                </div>
              </div>
            </div>
          )}

          {/* TAB: HORARIOS FIJOS */}
          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WEEKLY_SCHEDULE.map((day, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                  <h3 className="text-xl font-black mb-4 text-indigo-600">{day.day}</h3>
                  <div className="space-y-4">
                    {day.items.map((item, i) => (
                      <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: EXÁMENES */}
          {activeTab === 'exams' && (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Fecha</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Materia / Examen</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {EXAMS.sort((a,b) => a.date.getTime() - b.date.getTime()).map((e, idx) => {
                    const isPast = isAfter(new Date(), e.date) && !isSameDay(new Date(), e.date);
                    return (
                      <tr key={idx} className={cn("hover:bg-slate-50/50 transition-colors", isPast && "opacity-40")}>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{format(e.date, 'dd MMM', { locale: es })}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{format(e.date, 'EEEE', { locale: es })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{e.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{e.subject}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                            isPast ? "bg-slate-100 text-slate-400" : "bg-rose-100 text-rose-600"
                          )}>
                            {isPast ? "Rendido" : "Pendiente"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: ROTACIONES */}
          {activeTab === 'rotations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ROTATIONS.sort((a,b) => a.date.getTime() - b.date.getTime()).map((r, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex gap-4">
                  <div className="flex flex-col items-center justify-center bg-amber-50 text-amber-600 w-16 h-16 rounded-2xl shrink-0 border border-amber-100">
                    <span className="text-lg font-black leading-none">{format(r.date, 'dd')}</span>
                    <span className="text-[10px] font-black uppercase">{format(r.date, 'MMM')}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 text-lg">{r.name}</h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{r.time}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-500" /> {r.place}</div>
                      <div className="flex items-center gap-1.5"><User size={14} className="text-indigo-400" /> {r.docent}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
