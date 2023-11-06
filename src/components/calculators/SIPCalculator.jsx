import React, { useState } from 'react';
import axios from 'axios';
import GetAllNotes from './GetAllNotes';

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);
  const [annualInterestRate, setAnnualInterestRate] = useState(0);
  const [investmentDuration, setInvestmentDuration] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateSIP = () => {
    if (monthlyInvestment <= 0 || annualInterestRate <= 0 || investmentDuration <= 0) {
      return;
    }
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const numberOfMonths = investmentDuration * 12;
    const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1) / monthlyInterestRate) * (1 + monthlyInterestRate));
    setTotalAmount(futureValue.toFixed(2));
  };
  const handleSaveNote = async () =>{
    if (monthlyInvestment <= 0 || annualInterestRate <= 0 || investmentDuration <= 0 || totalAmount <= 0) {
      alert("Please configure to save!");
      return;
    }
    if(localStorage.getItem('email_id')){
      console.log(localStorage.getItem("email_id"));
      let obj = {monthlyInvestment: monthlyInvestment, annualInterestRate: annualInterestRate, investmentDuration: investmentDuration, totalAmount: totalAmount};
      console.log(obj);
      try {
        let data = {email: localStorage.getItem("email_id"), note: obj};
        let response = await axios.post("http://localhost:3000/api/v1/save-note", data);
        console.log(response);
        if(response.status===200){
          setMonthlyInvestment(0);
          setAnnualInterestRate(0);
          setInvestmentDuration(0);
          setTotalAmount(0);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <div>
      <h2>SIP Calculator</h2>
      <div>
        <label>Monthly Investment (₹):</label>
        <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)}
        />
      </div>
      <div>
        <label>Expected Return Rate (%):</label>
        <input type="number" value={annualInterestRate} onChange={(e) => setAnnualInterestRate(e.target.value)}
        />
      </div>
      <div>
        <label>Investment Duration (years):</label>
        <input type="number" value={investmentDuration} onChange={(e) => setInvestmentDuration(e.target.value)}/>
      </div>
      <button onClick={calculateSIP}>Calculate</button>
      <button disabled={!localStorage.getItem("email_id")} onClick={handleSaveNote}>Save to the note</button>
      {totalAmount > 0 && (
        <div>
          <h3>Total Amount: ₹{totalAmount}</h3>
        </div>
      )}
      <div>
        {
          localStorage.getItem("email_id") && (
          <div>
            <GetAllNotes/>
          </div>
          )
        }
      </div>
    </div>
  );
};

export default SIPCalculator;