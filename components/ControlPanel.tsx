
import React, { useRef, useState } from 'react';
import { ICONS } from '../constants';

interface ControlPanelProps {
  startDate: Date;
  setStartDate: (date: Date) => void;
  logo: string | null;
  onLogoUpload: (file: File) => void;
  onRemoveLogo: () => void;
  isCalendarConnected: boolean;
  onConnectCalendar: (url: string) => void;
  onDisconnectCalendar: () => void;
  onExportPdf: () => void;
  onClose: () => void;
}

const ControlOption: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-gray-500 tracking-wider uppercase">{title}</label>
    {children}
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  startDate,
  setStartDate,
  logo,
  onLogoUpload,
  onRemoveLogo,
  isCalendarConnected,
  onConnectCalendar,
  onDisconnectCalendar,
  onExportPdf,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [calendarUrl, setCalendarUrl] = useState('');

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
            <div className="space-y-2">
              <p className="text-sm text-center text-green-700 bg-green-100 p-2 rounded-lg border border-green-200">
                ✓ Calendar Connected
              </p>
              <button
                onClick={onDisconnectCalendar}
                className="w-full text-sm text-gray-500 hover:text-lipstick-red transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="space-y-2">
                <input 
                    type="url"
                    placeholder="Paste iCal/.ics link"
                    value={calendarUrl}
                    onChange={e => setCalendarUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lipstick-red focus:border-lipstick-red block p-2"
                />
                <button
                    onClick={() => onConnectCalendar(calendarUrl)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm disabled:opacity-50"
                    disabled={!calendarUrl}
                >
                    {React.cloneElement(ICONS.GOOGLE, { className: "w-4 h-4" })}
                    Load Calendar
                </button>
            </div>
          )}
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
            {logo && (
              <div className="relative group">
                <img src={logo} alt="Logo Preview" className="w-10 h-10 object-contain border border-gray-200 p-1 rounded-md" />
                <button 
                  onClick={onRemoveLogo} 
                  className="absolute -top-1.5 -right-1.5 bg-lipstick-red text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove logo"
                >
                  &times;
                </button>
              </div>
            )}
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
