import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ 
        marginLeft: '13%', 
        width: 'calc(100% - 13%)', 
        minHeight: '100vh', 
        backgroundColor: '#ffffff' 
      }}>
        <Topbar />
        <main style={{ padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
