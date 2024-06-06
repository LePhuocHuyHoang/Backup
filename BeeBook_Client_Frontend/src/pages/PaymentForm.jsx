import React, { useEffect, useState } from "react";
import "../style/PaymentForm.scss";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [CVV, setCVV] = useState("");
  const [cardName, setCardName] = useState("");
  const [amount, setAmount] = useState(0);
  const { userProfile, token, handleLogin, handleGetProfile } = useAuth();
  const navigate = useNavigate();
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardNumber(value);
  };

  const handleExpDateChange = (e) => {
    const value = e.target.value.replace(/[^\d/]/g, "");
    setExpDate(value);
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCVV(value);
  };
  const handleCardNameChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z\s]/g, "");
    if (value.length > 30) {
      value = value.slice(0, 30);
    }
    setCardName(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(cardNumber, expDate, CVV, cardName, amount);
    const [expMonth, expYear] = expDate.split("/");
    if (amount < 1) {
      toast.error("Số tiền phải lớn hơn 1");
      return;
    }
    axios
      .post(
        "http://localhost:8098/stripe/card/token",
        {
          cardNumber: cardNumber,
          expMonth: expMonth,
          expYear: expYear,
          cvc: CVV,
          username: userProfile.userName,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        // Handle success response
        console.log(res.data);
        return axios.post(
          "http://localhost:8098/stripe/charge",
          {
            stripeToken: res.data.token,
            amount: amount,
            username: userProfile.userName,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      })
      .then((res) => {
        console.log(res);
        toast.success(`Đã nạp thêm ${res.data.amount * 100} Point`);
        handleGetProfile();
        navigate("/");
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          toast.error("Vui lòng đăng nhập!");
        } else if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Đã xảy ra lỗi khi xử lý yêu cầu.");
        }
      });
  };
  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập!");
      navigate("/");
    }
  }, []);
  return (
    <div className="payment-form">
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="card-number">Card Number</label>
          <input
            type="text"
            id="card-number"
            name="card-number"
            maxLength={16}
            placeholder="Enter your card number"
            required
            onChange={handleCardNumberChange}
            value={cardNumber}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiration-date">Expiration Date</label>
          <input
            type="text"
            id="expiration-date"
            name="expiration-date"
            placeholder="MM/YY"
            maxLength={5}
            required
            onChange={handleExpDateChange}
            value={expDate}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            maxLength={3}
            placeholder="Enter CVV"
            required
            onChange={handleCVVChange}
            value={CVV}
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-holder">Cardholder Name</label>
          <input
            type="text"
            id="card-holder"
            name="card-holder"
            placeholder="Enter cardholder name"
            required
            value={cardName}
            style={{ textTransform: "uppercase" }}
            onChange={handleCardNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-holder">Amount</label>
          <input
            type="number"
            id="card-holder"
            name="card-holder"
            placeholder="Enter $"
            defaultValue={1}
            required
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
}

export default PaymentForm;
