import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppShell = ({ children, onNewProject }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewProject={onNewProject}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 lg:ml-64">
        <TopBar onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
