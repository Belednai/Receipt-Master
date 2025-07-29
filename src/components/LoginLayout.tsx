import { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

export default LoginLayout; 