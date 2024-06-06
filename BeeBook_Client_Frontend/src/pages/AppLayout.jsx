import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

function AppLayout() {
  return (
    <div className="app-ctn">
      <Header/>
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;
