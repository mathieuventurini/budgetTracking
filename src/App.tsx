import React from 'react';
import { BudgetProvider } from './contexts/BudgetContext';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <BudgetProvider>
      <MainLayout />
    </BudgetProvider>
  );
}

export default App;
