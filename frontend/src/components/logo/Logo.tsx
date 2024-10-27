import React from 'react'
import styles from "./logo.module.css";
import { Link } from 'react-router-dom';

const Logo:React.FC = () => {
  return (
    <Link to="/"><h1 className={styles.logo}>ECOMMERCE</h1></Link>
  )
}

export default Logo;