import { AuthProvider } from '../contexts/AuthContext';
import Layout from './Layout';

const AuthenticatedLayout = () => {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
};

export default AuthenticatedLayout; 