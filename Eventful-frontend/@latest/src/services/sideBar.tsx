import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import styles from "./sidebar.module.css";
import {Logout} from "./Logout";
type MenuItem = {
  name: string;
  path: string;
};

type SidebarProps = {
  menu: MenuItem[];
};

export default function Sidebar({ menu }: SidebarProps) {
  const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);
  // Auto close on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  async function handleLogoutBtn(e: any){
    e.preventDefault();

    await Logout();
    setTimeout(()=>{
      navigate("/")
    },1000)
  }

  return (
    <>
      {/* Hamburger */}
      <div className={styles.topBar}>
        <FaBars
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Overlay */}
        {isOpen && isMobile && (
        <div
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
        />
        )}

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.logo}><h1>Event<span>ify</span></h1></div>

        <nav className={styles.navs}>
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogoutBtn}>
            <FaSignOutAlt />
            Logout
        </button>
      </div>
    </>
  );
}