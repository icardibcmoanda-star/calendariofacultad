'use client';

import React, { useState } from 'react';
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
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen, Stethoscope } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock de rotaciones de 5to año de Medicina
const ROTATIONS = [
  { id: 1, name: 'Ginecología y Obstetricia', date: new Date(2026, 3, 15), type: 'Examen', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { id: 2, name: 'Pediatría - Rotación H. Garrahan', date: new Date(2026, 3, 20), type: 'Rotación', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 3, name: 'Cirugía General', date: new Date(2026, 4, 5), type: 'Cursada', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 4, name: 'Medicina Legal', date: new Date(2026, 3, 28), type: 'Examen', color: 'bg-purple-100 text-purple-700 border-purple-200' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Stethoscope size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Med 5to Año</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Próximos Eventos</h2>
              {ROTATIONS.map(event => (
                <div key={event.id} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className={cn("w-1 h-10 rounded-full shrink-0", event.color.split(' ')[0])} />
                  <div>
                    <p className="text-sm font-semibold group-hover:text-blue-600 transition-colors">{event.name}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Clock size={12} />
                      {format(event.date, 'dd MMM, yyyy', { locale: es })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <BookOpen className="mb-4 opacity-80" />
            <h3 className="font-bold text-lg mb-2">Resumen Semanal</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Tienes 2 rotaciones activas y un examen de Medicina Legal a la vista. ¡Dale con todo!
            </p>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-2xl font-bold capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Hoy
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-[120px]">
            {calendarDays.map((day, i) => {
              const dayEvents = ROTATIONS.filter(e => isSameDay(e.date, day));
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "p-2 border-r border-b border-slate-100 transition-colors relative group",
                    !isSameMonth(day, monthStart) && "bg-slate-50/30 text-slate-300",
                    isSameDay(day, new Date()) && "bg-blue-50/30"
                  )}
                >
                  <span className={cn(
                    "inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full",
                    isSameDay(day, new Date()) ? "bg-blue-600 text-white shadow-md" : "text-slate-700"
                  )}>
                    {format(day, 'd')}
                  </span>
                  
                  <div className="mt-2 space-y-1 overflow-hidden">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className={cn(
                          "text-[10px] px-2 py-1 rounded-md border truncate font-medium",
                          event.color
                        )}
                        title={event.name}
                      >
                        {event.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
