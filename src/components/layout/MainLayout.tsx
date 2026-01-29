import React, { useState } from 'react';
import { Header } from './Header';
import { MonthSelector } from '../history/MonthSelector';
import { MonthComparison } from '../history/MonthComparison';
import { RestToLiveGauge } from '../dashboard/RestToLiveGauge';
import { MonthOverview } from '../dashboard/MonthOverview';
import { TrendChart } from '../dashboard/TrendChart';
import { SalaryInput } from '../income/SalaryInput';
import { FixedChargesList } from '../expenses/FixedChargesList';
import { ExceptionalExpensesList } from '../expenses/ExceptionalExpensesList';
import { ProjectsList } from '../projects/ProjectsList';

export const MainLayout: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen">
      <Header
        onShowHistory={() => setShowHistory(!showHistory)}
        showingHistory={showHistory}
      />

      <main className="container mx-auto px-4 py-8">
        {showHistory ? (
          // Vue Historique
          <div className="space-y-6">
            <MonthSelector />
            <MonthComparison />
            <TrendChart />
          </div>
        ) : (
          // Vue Budget principal
          <div className="space-y-8">
            {/* Sélecteur de mois */}
            <MonthSelector />

            {/* Dashboard Section */}
            <section>
              <h2 className="text-2xl font-bold text-text mb-4">Tableau de bord</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RestToLiveGauge />
                <div className="space-y-6">
                  <MonthOverview />
                </div>
              </div>
              <div className="mt-6">
                <TrendChart />
              </div>
            </section>

            {/* Revenus Section */}
            <section>
              <h2 className="text-2xl font-bold text-text mb-4">Revenus</h2>
              <SalaryInput />
            </section>

            {/* Dépenses Section */}
            <section>
              <h2 className="text-2xl font-bold text-text mb-4">Dépenses</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FixedChargesList />
                <ExceptionalExpensesList />
              </div>
            </section>

            {/* Projets Section */}
            <section>
              <h2 className="text-2xl font-bold text-text mb-4">Projets</h2>
              <ProjectsList />
            </section>
          </div>
        )}
      </main>

      <footer className="bg-surface border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-textLight text-sm">
          <p>Budget Familial - Gérez vos finances simplement</p>
        </div>
      </footer>
    </div>
  );
};
