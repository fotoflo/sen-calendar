
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { addMonths, addWeeks } from 'date-fns';
import { ControlPanel } from './components/ControlPanel';
import { CalendarPreview } from './components/CalendarPreview';
import { ViewType, CalendarEvent } from './types';
import { MOCK_EVENTS, ICONS } from './constants';

declare const IcalExpander: any;

const LOGO_STORAGE_KEY = 'printableCalendarLogo';
const CALENDAR_URL_STORAGE_KEY = 'printableCalendarUrl';

const App: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [printRange, setPrintRange] = useState<number>(1);
  const [logo, setLogo] = useState<string | null>(null);
  const [isCalendarConnected, setIsCalendarConnected] = useState<boolean>(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [calendarUrl, setCalendarUrl] = useState('');
  
  const handleConnectCalendar = useCallback(async (url: string) => {
    if (!url) return;
    setIsLoading(true);
    try {
      // Using a CORS proxy to fetch calendar data
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar: ${response.statusText}`);
      }
      const icsData = await response.text();

      const icalExpander = new IcalExpander({ ics: icsData, maxIterations: 1000 });
      const now = new Date();
      // Fetch events for a wide range, e.g., 6 months before and after today.
      const rangeStart = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 6, 31);
      
      const calendarData = icalExpander.getEvents(rangeStart, rangeEnd);

      const formattedEvents: CalendarEvent[] = calendarData.events.map((event: any) => ({
        id: event.uid,
        title: event.summary,
        start: event.startDate.toJSDate(),
        end: event.endDate.toJSDate(),
      })).concat(calendarData.occurrences.map((occurrence: any) => ({
        id: `${occurrence.item.uid}-${occurrence.startDate.toJSDate().toISOString()}`,
        title: occurrence.item.summary,
        start: occurrence.startDate.toJSDate(),
        end: occurrence.endDate.toJSDate(),
      })));
      
      setCalendarEvents(formattedEvents);
      setIsCalendarConnected(true);
      localStorage.setItem(CALENDAR_URL_STORAGE_KEY, url);
    } catch (error) {
      console.error("Failed to parse iCal data:", error);
      alert("Could not load calendar. Please check the URL and ensure it's a valid iCal/.ics link.");
      setIsCalendarConnected(false);
      setCalendarEvents([]);
      localStorage.removeItem(CALENDAR_URL_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    if (savedLogo) {
      setLogo(savedLogo);
    }
    const savedUrl = localStorage.getItem(CALENDAR_URL_STORAGE_KEY);
    if (savedUrl) {
      setCalendarUrl(savedUrl);
      handleConnectCalendar(savedUrl);
    }
  }, [handleConnectCalendar]);

  const handleDisconnectCalendar = useCallback(() => {
    setIsCalendarConnected(false);
    setCalendarEvents([]);
    setCalendarUrl('');
    localStorage.removeItem(CALENDAR_URL_STORAGE_KEY);
  }, []);

  const handleLogoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogo(result);
      localStorage.setItem(LOGO_STORAGE_KEY, result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogo(null);
    localStorage.removeItem(LOGO_STORAGE_KEY);
  }, []);

  const handleExportPdf = () => {
    window.print();
  };

  const addDate = viewType === 'monthly' ? addMonths : addWeeks;

  const controlPanelProps = {
    startDate, setStartDate,
    logo, 
    onLogoUpload: handleLogoUpload,
    onRemoveLogo: handleRemoveLogo,
    isCalendarConnected, 
    onConnectCalendar: handleConnectCalendar,
    onDisconnectCalendar: handleDisconnectCalendar,
    onExportPdf: handleExportPdf,
    calendarUrl,
    setCalendarUrl,
  };

  return (
    <div className="min-h-screen font-sans bg-gray-100 text-gray-800">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lipstick-red"></div>
        </div>
      )}

      <header className="p-4 md:px-8 md:py-6 flex justify-between items-center">
        <div className="flex-shrink-0 h-8 flex items-center">
          {logo ? (
            <img src={logo} alt="Logo" className="max-h-full object-contain" />
          ) : (
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Printable Calendar</h1>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-gray-200 rounded-lg p-0.5">
            {(['monthly', 'weekly'] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewType(v)}
                className={`px-3 md:px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewType === v
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={printRange}
              onChange={(e) => setPrintRange(Number(e.target.value))}
              className="bg-white shadow-sm text-gray-900 text-sm rounded-lg focus:ring-lipstick-red focus:border-lipstick-red block w-full py-1.5 pl-3 pr-8 appearance-none"
              aria-label="Select print range"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {viewType === 'monthly' ? 'Month' : 'Week'}{i > 0 ? 's' : ''}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              {React.cloneElement(ICONS.CHEVRON_DOWN, { className: "w-4 h-4" })}
            </div>
          </div>
          
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 bg-lipstick-red text-white font-semibold py-1.5 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm shadow-sm"
            aria-label="Print calendar"
          >
            {React.cloneElement(ICONS.PRINT, { className: "w-4 h-4" })}
            <span>Print</span>
          </button>

          <button
            id="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-paper-white rounded-full shadow-md hover:bg-gray-200 transition-colors z-30"
            aria-label="Open settings"
          >
            {React.cloneElement(ICONS.GEAR, { className: "w-6 h-6 text-gray-600"})}
          </button>
        </div>
      </header>

      <div 
        id="settings-modal-overlay" 
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${isSettingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSettingsOpen(false)}
      >
        <div 
          className={`bg-paper-white shadow-xl h-full w-full max-w-xs flex flex-col absolute top-0 right-0 transition-transform duration-300 ease-in-out ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ControlPanel {...controlPanelProps} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </div>

      <main className="px-4 pb-4 md:px-8 md:pb-8">
        <CalendarPreview
          key={`${viewType}-${startDate.toISOString()}-${printRange}-${logo}-${isCalendarConnected}`}
          viewType={viewType}
          startDate={startDate}
          printRange={printRange}
          logo={logo}
          events={calendarEvents}
          addDate={addDate}
        />
      </main>
    </div>
  );
};

export default App;
