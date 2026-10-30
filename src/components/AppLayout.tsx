import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-gray-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
