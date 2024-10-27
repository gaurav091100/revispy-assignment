import React from 'react'
import searchIcon from "../../assets/icons/Search.svg";
import cartIcon from "../../assets/icons/Cart.svg";
import NavIcon from "./NavIcon";
import styles from "./navIcons.module.css";

const NavIcons:React.FC  = () => {
  return (
    <div className={styles.navIcons}>
      <NavIcon icon={searchIcon} />
      <NavIcon icon={cartIcon} />
    </div>
  )
}

export default NavIcons