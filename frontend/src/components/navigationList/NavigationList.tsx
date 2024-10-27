import React from "react";
import styles from "./navigationList.module.css";
import { Link } from "react-router-dom";

const NavigationList: React.FC = () => {
  return (
    <ul className={styles.navList}>
      <li>
        {" "}
        <Link to="/categories">Categories</Link>
      </li>
      <li>Sale</li>
      <li>Clearance</li>
      <li>New stock</li>
      <li>Trending</li>
    </ul>
  );
};

export default NavigationList;
