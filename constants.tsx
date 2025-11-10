
import React from 'react';
import { CalendarEvent } from './types';

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Phase 2 UI Sketch', start: new Date(new Date().setDate(new Date().getDate() + 1)), end: new Date(new Date().setDate(new Date().getDate() + 1)) },
  { id: '2', title: 'Team Sync', start: new Date(new Date().setDate(new Date().getDate() + 2)), end: new Date(new Date().setDate(new Date().getDate() + 2)) },
  { id: '3', title: 'UX Review', start: new Date(new Date().setDate(new Date().getDate() - 5)), end: new Date(new Date().setDate(new Date().getDate() - 5)) },
  { id: '4', title: 'Design Handoff', start: new Date(new Date().setDate(new Date().getDate() + 10)), end: new Date(new Date().setDate(new Date().getDate() + 10)) },
  { id: '5', title: 'Project Kick-off', start: new Date(new Date().setHours(10, 0, 0, 0)), end: new Date(new Date().setHours(11, 0, 0, 0)) },
  { id: '6', title: 'Quarterly Planning', start: new Date(new Date().setDate(new Date().getDate() + 15)), end: new Date(new Date().setDate(new Date().getDate() + 17)) },
];

export const ICONS = {
    UPLOAD: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>,
    GOOGLE: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 16.5c-2-1.5-3.5-2-5-2-1.5 0-3 .5-5 2m10-13c-2 1.5-3.5 2-5 2-1.5 0-3-.5-5-2m0 13c-2-1.5-2-3.5-2-5 0-1.5.5-3 2-5m10 10c2-1.5 2-3.5 2-5s-.5-3-2-5" /><circle cx="12" cy="12" r="10"/></svg>,
    PDF: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 17h6"/><path d="M9 13h6"/></svg>,
    CHEVRON_DOWN: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
    GEAR: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/><path d="M12 8v8"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 7 1.4-1.4"/><path d="m5.6 18.4 1.4-1.4"/><path d="M7 7l-1.4-1.4"/><path d="m18.4 5.6-1.4 1.4"/><path d="M2 12h2"/><path d="M22 12h-2"/><path d="m17 17-1.4 1.4"/><path d="m5.6 5.6 1.4 1.4"/></svg>,
    PRINT: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
};
