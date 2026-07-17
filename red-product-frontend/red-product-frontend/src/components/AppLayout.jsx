import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AppLayout.css";

export default function AppLayout({ title, children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Topbar title={title} />
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
