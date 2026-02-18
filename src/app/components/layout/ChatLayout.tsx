import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function ChatLayout() {
  return (
    <div className="bg-white h-screen flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
}
