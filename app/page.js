"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function RiskCalculator() {
  const [account, setAccount] = useState(0);
  const [percentageRisk, setPercentageRisk] = useState(1); // ✅ default = 1%
  const [commission, setCommission] = useState(0);

  const [dollarsPerTrade, setDollarsPerTrade] = useState(0);


  const stopCents = [5, 10, 20, 30, 40, 50];

  // ✅ Load from localStorage safely
  useEffect(() => {
    const savedData = localStorage.getItem("account");

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        setAccount(Number(data.account) || 0);
        setPercentageRisk(Number(data.percentageRisk) || 1); // ✅ fallback to 1
        setCommission(Number(data.commission) || 0);
      } catch (e) {
        console.error("Bad localStorage data");
      }
    }
  }, []);

  // ✅ Save handler
  function saveChanges() {
    localStorage.setItem(
      "account",
      JSON.stringify({
        account,
        percentageRisk,
        commission,
      })
    );
  }





  function calculateSharesAfterCommission(stp) {
      let finalAmountOfShares = 0
      //calculate the risk per trade 
      finalAmountOfShares = (account / 100 ) * percentageRisk
      // calculate amount of shares for that risk
      finalAmountOfShares = Math.floor(finalAmountOfShares / (stp / 100))
      if (finalAmountOfShares < 100) {
        return (
          <div>
            <p>{finalAmountOfShares} shares,  consider {commission * 2}$ commission</p>
          </div>
        )
      }
      if (finalAmountOfShares > 100) {
        
        return (
          <div>
            <p>{finalAmountOfShares} shares,  consider {Math.ceil((finalAmountOfShares / 100)* (commission * 2 ))}$ commission</p>
          </div>
        )
      }
    
   
      return finalAmountOfShares
    
  }




  return (
    <div className={styles.page}>
      <h1>Risk Calculator</h1>

      {/* Account */}
      <div>
        <label>Account:</label>
        <input
          type="number"
          value={account}
          onChange={(e) => setAccount(Number(e.target.value))}
        />
      </div>

      {/* Risk */}
      <div>
        <h3>Select risk size</h3>

        <label>
          1%
          <input
            type="radio"
            name="risk"
            checked={percentageRisk === 1}
            onChange={() => setPercentageRisk(1)}
          />
        </label>

        <label>
          2%
          <input
            type="radio"
            name="risk"
            checked={percentageRisk === 2}
            onChange={() => setPercentageRisk(2)}
          />
        </label>

        <label>
          5%
          <input
            type="radio"
            name="risk"
            checked={percentageRisk === 5}
            onChange={() => setPercentageRisk(5)}
          />
        </label>
      </div>
      <hr/>
      <h2>At selected level of risk, you should be risking: {account / 100 * percentageRisk}$ per trade</h2>

      {/* Commission */}
      <div>
        <label>Commission ($ per 100 shares):</label>
        <input
          type="number"
          value={commission}
          onChange={(e) => setCommission(Number(e.target.value))}
        />
      </div>

      {/* Stops */}
      <div>
        <p>Position Size based on the {} risk per trade</p>
        {stopCents.map((stp) => (
          <div key={stp}>
            <span>{stp}¢ stop:</span> {calculateSharesAfterCommission(stp)}
          </div>
        ))}
      </div>

      <button onClick={saveChanges}>Save changes</button>
      
    
    </div>
  );
}