import React from "react";
import "../style/ReportPage.css";

const ReportPage = () => {
  return (
    <div className="container">
      <div className="container2">
        <h1 className="ReportPageName">Báo cáo</h1>
        <h2 className="ReportPageText">
          Cho chúng tôi biết chuyện gì đang xảy ra
        </h2>
        <div className="ReportingPage">
          <input type="" className="ReportPageDescription" />
          <img
            src="https://imgur.com/cahGEH1.png"
            alt=""
            className="ReportPageButton"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
