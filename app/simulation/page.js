"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";


export default function Simulation() {

  // States used in simulation

  const [account, setAccount] = useState();
  const[riskPercent, setRiskPercent] = useState();
  const[commission, setCommission] = useState();
  const[riskRatio, setRiskRatio] = useState();
  const[profitRatio, setProfitRatio] = useState();
  const[winRate, setWinRate] = useState();







  return (
    <div className={styles.page}>Simulation</div>
  )
}