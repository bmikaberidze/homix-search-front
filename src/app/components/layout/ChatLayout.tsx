import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function ChatLayout() {
  return (
    <div className="bg-white flex flex-col" style={{ height: 'calc(100dvh / var(--zoom))' }}>
      <Header />
      <Outlet />
    </div>
  );
}
