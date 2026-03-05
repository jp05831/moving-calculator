'use client';

import { useState } from 'react';
import { FormData } from '../types';
import { ChevronLeft, ChevronRight, Calendar, HelpCircle } from 'lucide-react';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  quotesRequested: number;
}

export default function StepDate({ formData, updateFormData, onNext, onBack, quotesRequested }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.moveDate ? new Date(formData.moveDate) : null
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (date >= today) {
      setSelectedDate(date);
      updateFormData({ moveDate: date.toISOString(), notSureDate: false });
    }
  };

  const handleNotSure = () => {
    updateFormData({ moveDate: null, notSureDate: true });
    onNext();
  };

  const handleContinue = () => {
    if (selectedDate) {
      onNext();
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const days = [];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    for (const day of dayNames) {
      days.push(
        <div key={`header-${day}`} className="text-center text-xs font-semibold text-slate-400 py-2">
          {day}
        </div>
      );
    }

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isPast = date < today;
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={isPast}
          className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            isPast
              ? 'text-slate-300 cursor-not-allowed'
              : isSelected
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
              : isToday
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
          <Calendar className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
          When are you moving?
        </h2>
        <p className="text-slate-600">
          Choose your preferred moving date
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="font-semibold text-lg text-slate-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
          <span className="text-blue-700 font-medium">
            Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      )}

      {/* Live counter */}
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span><span className="font-semibold text-slate-700">{quotesRequested}</span> quotes requested today</span>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        {selectedDate && (
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-lg shadow-lg shadow-blue-500/25"
          >
            Continue →
          </button>
        )}
        
        <button
          onClick={handleNotSure}
          className="w-full flex items-center justify-center gap-2 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-medium rounded-xl transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          I&apos;m not sure yet
        </button>
        
        <button
          onClick={onBack}
          className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
