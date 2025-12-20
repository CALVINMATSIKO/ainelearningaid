import { useState, Suspense, lazy } from 'react';
import Navigation from './components/layout/Navigation';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ToastContainer from './components/ui/ToastContainer';
import Loading from './components/ui/Loading';
import { useToast } from './hooks/useToast';

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Question = lazy(() => import('./pages/Question'));
const Resources = lazy(() => import('./pages/Resources'));

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { toasts, removeToast } = useToast();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Landing />;
      case 'dashboard':
        return <Dashboard />;
      case 'question':
        return <Question />;
      case 'resources':
        return <Resources />;
      default:
        return <div className="p-8 text-center">Page not found</div>;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            {renderPage()}
          </Suspense>
        </main>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;