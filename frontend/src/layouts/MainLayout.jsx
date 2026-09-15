import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;