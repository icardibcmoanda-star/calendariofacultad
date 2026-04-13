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
  parse
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
  Calendar as CalendarIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- DATOS DEL 5TO AÑO IUNIR ---

const WEEKLY_SCHEDULE: Record<number, any[]> = {
  1: [ // Lunes
    { time: '08:00 - 10:00', name: 'Medicina del Deporte', type: 'Clase' },
    { time: '12:00 - 13:30', name: 'Medicina Interna (Seminario)', type: 'Clase' },
    { time: '15:00 - 16:30', name: 'Clínica (Comisión A)', type: 'Clase' },
    { time: '16:30 - 19:30', name: 'Humanística', type: 'Clase' },
  ],
  2: [ // Martes
    { time: '08:00 - 09:30', name: 'Italiano (Comisión A)', type: 'Clase' },
    { time: '13:00 - 14:00', name: 'Medicina Interna', type: 'Clase' },
    { time: '14:00 - 17:00', name: 'Pediatría (Teórico y Taller)', type: 'Clase' },
    { time: '17:00 - 19:30', name: 'Tocoginecología', type: 'Clase' },
    { time: '19:30 - 20:30', name: 'Pediatría (Virtual)', type: 'Clase' },
  ],
  3: [ // Miércoles
    { time: '13:00 - 14:00', name: 'Medicina Interna', type: 'Clase' },
    { time: '14:00 - 17:00', name: 'Pediatría (Teórico y Taller)', type: 'Clase' },
    { time: '17:00 - 18:30', name: 'Diagnóstico por Imágenes (V)', type: 'Clase' },
    { time: '18:30 - 20:00', name: 'Inglés (Comisión A)', type: 'Clase' },
  ],
  4: [ // Jueves
    { time: '13:00 - 14:00', name: 'Medicina Interna', type: 'Clase' },
    { time: '17:00 - 19:30', name: 'Tocoginecología', type: 'Clase' },
    { time: '19:30 - 20:30', name: 'Cirugía (Comisión I - T)', type: 'Clase' },
  ],
  5: [ // Viernes
    { time: '08:00 - 09:30', name: 'Cirugía (Comisión I - P)', type: 'Clase' },
    { time: '13:00 - 14:00', name: 'Medicina Interna', type: 'Clase' },
    { time: '14:00 - 16:30', name: 'Clínica (Comisión A)', type: 'Clase' },
    { time: '18:00 - 19:00', name: 'Cibernética (Comisión B)', type: 'Clase' },
  ]
};

const SPECIFIC_EVENTS = [
  // Rotaciones Abril
  { date: new Date(2026, 3, 13), name: 'Otorrino 2', type: 'Rotación', time: '09:00 - 10:00', docent: 'Dacunda Luis', place: 'Sanatorio de los Niños' },
  { date: new Date(2026, 3, 16), name: 'UTI 6', type: 'Rotación', time: '10:30 - 12:00', docent: 'Zalazar Pabla', place: 'HIR SUR' },
  { date: new Date(2026, 3, 20), name: 'Gineco 3', type: 'Rotación', time: '10:00 - 11:45', docent: 'Maidagan Rocio', place: 'HIR SUR' },
  { date: new Date(2026, 3, 21), name: 'Pediatría 8', type: 'Rotación', time: '10:00 - 12:00', docent: 'Carne Ciro', place: 'Instituto del Niño' },
  { date: new Date(2026, 3, 23), name: 'Neuro', type: 'Rotación', time: '15:30 - 16:30', docent: 'Sbarra Valeria', place: 'Hospital Pilares' },
  { date: new Date(2026, 3, 29), name: 'Traumatología 2', type: 'Rotación', time: '08:00 - 10:00', docent: 'Polenta Eduardo', place: 'S Plaza' },
  
  // Rotaciones Mayo
  { date: new Date(2026, 4, 7), name: 'PH 7', type: 'Rotación', time: '09:00 - 11:00', docent: 'Slavkes Daniel', place: 'Hospital Provincial' },
  { date: new Date(2026, 4, 28), name: 'Reumatología 4', type: 'Rotación', time: '08:00 - 10:00', docent: 'Milanesio Julieta', place: 'IJS (San Luis 2354)' },

  // PARCIALES
  { date: new Date(2026, 4, 13), name: '1° Parcial Reumatología', type: 'Examen' },
  { date: new Date(2026, 4, 19), name: '2° Parcial Hematología', type: 'Examen' },
  { date: new Date(2026, 4, 8), name: '1° Parcial Clínica Quirúrgica', type: 'Examen' },
  { date: new Date(2026, 4, 15), name: '1° Parcial Cibernética', type: 'Examen' },
  { date: new Date(2026, 4, 21), name: '1° Parcial PH V', type: 'Examen' },
  { date: new Date(2026, 4, 26), name: '1° Parcial Tocoginecología', type: 'Examen' },
  { date: new Date(2026, 4, 29), name: '1° Parcial Inglés V', type: 'Examen' },
  { date: new Date(2026, 4, 4), name: '1° Parcial Humanística', type: 'Examen' },
  { date: new Date(2026, 5, 2), name: '1° Parcial Pediatría', type: 'Examen' },
  { date: new Date(2026, 5, 5), name: '1° Parcial Cirugía Básica', type: 'Examen' },
  { date: new Date(2026, 5, 10), name: '1° Parcial Diagnóstico Imágenes', type: 'Examen' },
  { date: new Date(2026, 5, 12), name: '2° Parcial Cibernética', type: 'Examen' },
  { date: new Date(2026, 5, 16), name: '1° Parcial Italiano V', type: 'Examen' },
  { date: new Date(2026, 5, 18), name: '2° Parcial PH V', type: 'Examen' },
  { date: new Date(2026, 5, 22), name: '2° Parcial Humanística', type: 'Examen' },
  { date: new Date(2026, 5, 26), name: '2° Parcial Clínica Quirúrgica', type: 'Examen' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 13)); // Iniciamos en Abril 2026
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const upcomingEvents = useMemo(() => {
    return SPECIFIC_EVENTS
      .filter(e => e.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-2 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                <Stethoscope size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">IUNIR Med</h1>
                <p className="text-xs text-slate-400 font-medium">5to Año • 2026</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <CalendarIcon size={14} /> Próximas Fechas Clave
              </h2>
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-slate-100 py-1">
                  <div className={cn(
                    "absolute -left-[1.5px] top-1/2 -translate-y-1/2 w-1 h-6 rounded-full",
                    event.type === 'Examen' ? "bg-rose-500" : "bg-amber-500"
                  )} />
                  <p className="text-sm font-bold leading-tight">{event.name}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {format(event.date, 'dd MMM', { locale: es })}
                    {event.time && ` • ${event.time}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl text-white overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <GraduationCap className="mb-4 opacity-80" size={32} />
            <h3 className="font-bold text-lg mb-2 italic">"Non progredi est regredi"</h3>
            <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
              No avanzar es retroceder. ¡Ánimo con este 5to año!
            </p>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-50">
              <h2 className="text-2xl font-black capitalize tracking-tight text-slate-800">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </h2>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600">
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())} 
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:shadow-sm rounded-xl transition-all"
                >
                  Hoy
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Grid Days Header */}
            <div className="grid grid-cols-7 bg-slate-50/50">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-[140px] md:auto-rows-[160px]">
              {calendarDays.map((day, i) => {
                const dayOfWeek = getDay(day) === 0 ? 7 : getDay(day);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const dayEvents = SPECIFIC_EVENTS.filter(e => isSameDay(e.date, day));
                const recurringClasses = WEEKLY_SCHEDULE[dayOfWeek] || [];
                
                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "p-2 border-r border-b border-slate-50 transition-all cursor-pointer relative group flex flex-col",
                      !isSameMonth(day, monthStart) && "bg-slate-50/20 opacity-30",
                      isSelected && "bg-indigo-50/30 ring-1 ring-inset ring-indigo-100"
                    )}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={cn(
                        "inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-full transition-transform group-hover:scale-110",
                        isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400"
                      )}>
                        {format(day, 'd')}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                      {/* Especiales (Exámenes/Rotaciones) */}
                      {dayEvents.map((event, idx) => (
                        <div 
                          key={`spec-${idx}`} 
                          className={cn(
                            "text-[9px] px-1.5 py-1 rounded-lg border shadow-sm flex items-center gap-1 font-bold",
                            event.type === 'Examen' ? "bg-rose-50 border-rose-100 text-rose-700" : "bg-amber-50 border-amber-100 text-amber-700"
                          )}
                        >
                          <div className={cn("w-1 h-1 rounded-full", event.type === 'Examen' ? "bg-rose-500" : "bg-amber-500")} />
                          <span className="truncate">{event.name}</span>
                        </div>
                      ))}

                      {/* Clases Semanales (solo si no es finde) */}
                      {isSameMonth(day, monthStart) && recurringClasses.map((clase, idx) => (
                        <div 
                          key={`class-${idx}`} 
                          className="text-[8px] px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-500 truncate"
                        >
                          {clase.time.split(' ')[0]} {clase.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day Detail - Mobile Friendly */}
          {selectedDay && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                Detalle del {format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Eventos Especiales */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Eventos y Rotaciones</h4>
                  {SPECIFIC_EVENTS.filter(e => isSameDay(e.date, selectedDay)).length > 0 ? (
                    SPECIFIC_EVENTS.filter(e => isSameDay(e.date, selectedDay)).map((e, idx) => (
                      <div key={idx} className={cn(
                        "p-4 rounded-2xl border flex flex-col gap-2",
                        e.type === 'Examen' ? "bg-rose-50 border-rose-100" : "bg-amber-50 border-amber-100"
                      )}>
                        <div className="flex justify-between items-start">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                            e.type === 'Examen' ? "bg-rose-200 text-rose-800" : "bg-amber-200 text-amber-800"
                          )}>{e.type}</span>
                          <span className="text-xs font-bold text-slate-600">{e.time}</span>
                        </div>
                        <p className="font-bold text-slate-800">{e.name}</p>
                        {e.place && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin size={12} /> {e.place}
                          </div>
                        )}
                        {e.docent && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <User size={12} /> {e.docent}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No hay rotaciones ni exámenes hoy.</p>
                  )}
                </div>

                {/* Horario de Cursada */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cursada Semanal</h4>
                  <div className="space-y-2">
                    {(WEEKLY_SCHEDULE[getDay(selectedDay) === 0 ? 7 : getDay(selectedDay)] || []).map((clase, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                          <p className="text-sm font-bold text-slate-700">{clase.name}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm whitespace-nowrap">
                          {clase.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
