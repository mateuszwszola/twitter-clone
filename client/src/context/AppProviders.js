import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import GlobalStyle from 'shared/global-style';
import ThemeProvider from 'shared/theme-provider';
import ErrorBoundary from 'components/ErrorBoundary';
import AuthProvider from './AuthContext';
import UserProvider from './UserContext';

const queryClient = new QueryClient();

function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserProvider>
            <GlobalStyle />
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </AuthProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default AppProviders;
