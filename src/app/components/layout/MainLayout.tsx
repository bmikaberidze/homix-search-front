import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from '../Footer';

export default function MainLayout() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
