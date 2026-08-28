import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout.jsx';
import LiveMapPage from './pages/LiveMapPage.jsx';
import RiskAnalysisPage from './pages/RiskAnalysisPage.jsx';
import AlertTickerPage from './pages/AlertTickerPage.jsx';
import XAIReportsPage from './pages/XAIReportsPage.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';
import HistoricalPage from './pages/HistoricalPage.jsx';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/live-map" replace />} />
            <Route path="/live-map" element={<LiveMapPage />} />
            <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
            <Route path="/alert-ticker" element={<AlertTickerPage />} />
            <Route path="/xai-reports" element={<XAIReportsPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/historical" element={<HistoricalPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
