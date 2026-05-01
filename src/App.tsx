import { keepPreviousData, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { DialogProvider } from './contexts/dialog/DialogProvider';
import { AuthProvider } from './contexts/session/AuthProvider';
import { ProtectedRoute } from './pages/auth/components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CashflowPage } from './pages/cashflow/Page';
import { CustomersPage } from './pages/customers/Page';
import { HomePage } from './pages/home/Page';
import { ProductsPage } from './pages/products/Page';
import { SalesPage } from './pages/sales/Page';
import { StatsPage } from './pages/stats/Page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      onError: (error) => {
        const defaultMessage = 'Erro ao processar operação';

        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || defaultMessage;
          toast.error(message);
        } else {
          toast.error(defaultMessage);
          console.error('[Erro Interno]', error);
        }
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DialogProvider>
            <Toaster toastOptions={{ style: { maxWidth: 400 } }} />

            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/customers"
                element={
                  <ProtectedRoute>
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/products"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/sales"
                element={
                  <ProtectedRoute>
                    <SalesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/stats"
                element={
                  <ProtectedRoute>
                    <StatsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/cashflow"
                element={
                  <ProtectedRoute>
                    <CashflowPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </DialogProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
