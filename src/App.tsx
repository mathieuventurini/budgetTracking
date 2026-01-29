import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BudgetProvider } from './contexts/BudgetContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './components/auth/Login';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <BudgetProvider>
      <MainLayout />
    </BudgetProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
