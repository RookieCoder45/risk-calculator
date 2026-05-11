"use client";

import styles from "./page.module.css";


export default function Simulation() {
 

 



  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.first}`}>
        first animated card
      </div>
      <div className={`${styles.card} ${styles.second}`}>
        <div className={styles.animatedBox}></div>
        <div className={styles.animatedBox}></div>
        <div className={styles.animatedBox}></div>
      </div>
    </div>
  );
}