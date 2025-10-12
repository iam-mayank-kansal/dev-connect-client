"use client";

import { TabButton } from "./tabButton";

interface ConnectionSidebarProps {
  activeView: 'connections' | 'pending' | 'find';
  onViewChange: (view: 'connections' | 'pending' | 'find') => void;
  connectionCounts: {
    connected: number;
    received: number;
    sent: number;
  };
}

export const ConnectionSidebar: React.FC<ConnectionSidebarProps> = ({
  activeView,
  onViewChange,
  connectionCounts,
}) => {
  return (
    <aside className="w-64 bg-white shadow-xl p-6 h-screen sticky top-0">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Network</h2>
      <nav className="space-y-2">
        <TabButton 
          isActive={activeView === 'connections'} 
          onClick={() => onViewChange('connections')}
        >
          My Connections ({connectionCounts.connected})
        </TabButton>
        <TabButton 
          isActive={activeView === 'pending'} 
          onClick={() => onViewChange('pending')}
        >
          Pending Requests ({connectionCounts.received + connectionCounts.sent})
        </TabButton>
        <TabButton 
          isActive={activeView === 'find'} 
          onClick={() => onViewChange('find')}
        >
          Find Connections
        </TabButton>
      </nav>
    </aside>
  );
};