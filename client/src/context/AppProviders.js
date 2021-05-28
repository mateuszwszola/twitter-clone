import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalStyle from 'shared/global-style';
import ThemeProvider from 'shared/theme-provider';
import AuthProvider from './AuthContext';
import UserProvider from './UserContext';
import { AlertProvider } from './AlertContext';
import ErrorFallback from 'components/ErrorFallback';

const queryClient = new QueryClient();

function AppProviders({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <GlobalStyle />
              <AlertProvider>{children}</AlertProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default AppProviders;
