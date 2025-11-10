import React, { useRef } from 'react';
import { ViewType } from '../types';
import { ICONS } from '../constants';

interface ControlPanelProps {
  viewType: ViewType;
  setViewType: (view: ViewType) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  printRange: number;
  setPrintRange: (range: number) => void;
  logo: string | null;
  onLogoUpload: (file: File) => void;
  isCalendarConnected: boolean;
  onConnectCalendar: () => void;
  onExportPdf: () => void;
  selectedCalendar: string;
  setSelectedCalendar: (cal: string) => void;
  onClose: () => void;
}

const ControlOption: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-gray-500 tracking-wider uppercase">{title}</label>
    {children}
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  viewType,
  setViewType,
  startDate,
  setStartDate,
  printRange,
  setPrintRange,
  logo,
  onLogoUpload,
  isCalendarConnected,
  onConnectCalendar,
  onExportPdf,
  selectedCalendar,
  setSelectedCalendar,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onLogoUpload(event.target.files[0]);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    const newDate = new Date(year, month - 1, 1);
    setStartDate(newDate);
  };

  const formattedDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`;
  
  return (
    <div id="control-panel" className="flex flex-col h-full w-full bg-paper-white">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800">Settings & Export</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-800 p-1 rounded-full -mr-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="p-4 space-y-5 overflow-y-auto flex-grow">
        <ControlOption title="Calendar Source">
          {isCalendarConnected ? (
            <div className="relative">
              <select
                value={selectedCalendar}
                onChange={(e) => setSelectedCalendar(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lipstick-red focus:border-lipstick-red block p-2 appearance-none"
              >
                <option value="janes-calendar">Jane's Calendar</option>
                <option value="work-calendar">Work Calendar</option>
                <option value="personal-projects">Personal Projects</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  {React.cloneElement(ICONS.CHEVRON_DOWN, { className: "w-4 h-4" })}
              </div>
            </div>
          ) : (
            <button
              onClick={onConnectCalendar}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              {React.cloneElement(ICONS.GOOGLE, { className: "w-4 h-4" })}
              Connect Google Calendar
            </button>
          )}
        </ControlOption>

        <ControlOption title="View Type">
          <div className="flex gap-2">
            {(['monthly', 'weekly'] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewType(v)}
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
                  viewType === v
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </ControlOption>

        <ControlOption title="Print Range">
          <div className="relative">
              <select
                value={printRange}
                onChange={(e) => setPrintRange(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lipstick-red focus:border-lipstick-red block p-2 appearance-none"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Next {i + 1} {viewType === 'monthly' ? 'Month' : 'Week'}{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  {React.cloneElement(ICONS.CHEVRON_DOWN, { className: "w-4 h-4" })}
              </div>
          </div>
        </ControlOption>

        <ControlOption title="Start Date">
          <input
            type="month"
            value={formattedDate}
            onChange={handleDateChange}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lipstick-red focus:border-lipstick-red block p-2"
          />
        </ControlOption>

        <ControlOption title="Logo">
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              {React.cloneElement(ICONS.UPLOAD, { className: "w-4 h-4" })}
              Upload
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {logo && <img src={logo} alt="Logo Preview" className="w-10 h-10 object-contain border border-gray-200 p-1 rounded-md" />}
          </div>
        </ControlOption>
      </div>
      
      <div id="export-button-container" className="p-4 mt-auto border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onExportPdf}
          className="w-full flex items-center justify-center gap-2 bg-lipstick-red text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
        >
            {React.cloneElement(ICONS.PDF, { className: "w-5 h-5" })}
            Export to PDF
        </button>
      </div>
    </div>
  );
};