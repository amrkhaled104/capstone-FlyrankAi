import React from 'react';
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">{children}</div>
      <ChatWidget />
    </div>
  );
}
