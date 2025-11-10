import React, { useState, useCallback, useRef } from 'react';
import { addMonths, addWeeks } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ControlPanel } from './components/ControlPanel';
import { CalendarPreview } from './components/CalendarPreview';
import { ViewType, CalendarEvent } from './types';
import { MOCK_EVENTS, ICONS } from './constants';

const App: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [printRange, setPrintRange] = useState<number>(1);
  const [logo, setLogo] = useState<string | null>(null);
  const [isCalendarConnected, setIsCalendarConnected] = useState<boolean>(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('janes-calendar');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  const handleConnectCalendar = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsCalendarConnected(true);
      setCalendarEvents(MOCK_EVENTS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleExportPdf = useCallback(async () => {
    setIsLoading(true);
    setIsSettingsOpen(false); // Close settings before exporting
    
    // Allow UI to update before starting heavy task
    await new Promise(resolve => setTimeout(resolve, 100));

    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageElements = document.querySelectorAll<HTMLElement>('.printable-calendar-page');
    
    for (let i = 0; i < pageElements.length; i++) {
      const element = pageElements[i];
      const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = canvasWidth / canvasHeight;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let imgWidth, imgHeight;

      if(ratio > pdfRatio){
          imgWidth = pdfWidth;
          imgHeight = pdfWidth / ratio;
      } else {
          imgHeight = pdfHeight;
          imgWidth = pdfHeight * ratio;
      }
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    }
    
    pdf.save('calendar.pdf');
    setIsLoading(false);
  }, []);

  const addDate = viewType === 'monthly' ? addMonths : addWeeks;

  const controlPanelProps = {
    viewType, setViewType,
    startDate, setStartDate,
    printRange, setPrintRange,
    logo, onLogoUpload: handleLogoUpload,
    isCalendarConnected, onConnectCalendar: handleConnectCalendar,
    onExportPdf: handleExportPdf,
    selectedCalendar, setSelectedCalendar,
  };

  return (
    <div className="min-h-screen font-sans bg-gray-100 text-gray-800">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lipstick-red"></div>
        </div>
      )}

      <header className="p-4 md:px-8 md:py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Printable Calendar</h1>
        <button
          id="settings-button"
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 bg-paper-white rounded-full shadow-md hover:bg-gray-200 transition-colors z-30"
          aria-label="Open settings"
        >
          {React.cloneElement(ICONS.GEAR, { className: "w-6 h-6 text-gray-600"})}
        </button>
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