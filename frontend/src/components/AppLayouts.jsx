import Sidebar from './common/Sidebar';

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-grow bg-gray-50 p-6 pt-20 lg:pt-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;