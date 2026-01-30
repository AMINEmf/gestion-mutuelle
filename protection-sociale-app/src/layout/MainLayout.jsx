import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ 
        marginLeft: '260px', 
        width: 'calc(100% - 260px)', 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb' 
      }}>
        <Topbar />
        <main style={{ padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
