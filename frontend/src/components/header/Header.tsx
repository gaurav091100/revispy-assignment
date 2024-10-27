import React, { useState } from "react";
import styles from "./header.module.css";
import Logo from "../logo/Logo";
import NavigationList from "../navigationList/NavigationList";
import NavIcons from "../navIcons/NavIcons";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") as string);


  const handleLogoutUser = () =>{
    localStorage.clear();
    window.location.href ="/";
  }
  return (
    <>
      <header className={styles.header}>
        <ul>
          <li>Help</li>
          <li>Orders & Returns</li>
          {isAuthenticated ? (
            <li className={styles.userDropdown}>
            <span onClick={() => setDropdownOpen(!dropdownOpen)}>
              Hi, {user.name}
            </span>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button onClick={handleLogoutUser}>Logout</button>
              </div>
            )}
          </li>
            // <li>Hi, {user.name}</li>
          ) : (
            <li onClick={() => navigate("/login")}>Login</li>
          )}
        </ul>
        <nav className={styles.navbar}>
          <Logo />
          <NavigationList />
          <NavIcons />
        </nav>
      </header>
      <div className={styles.offersContainer}>
        <p>Get 10% off on business sign up</p>
      </div>
    </>
  );
};

export default Header;
