import React from "react";

const FormCard = ({ title, link }) => {
  return (
    <>
      <style>{`
        .formcard {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 14px;
          padding: 20px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          transition: all 0.25s ease;
          width: 100%;
          max-width: 320px;
        }
        .formcard:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 32px rgba(0,0,0,0.12);
        }
        .formcard-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
        }
        .formcard-btn {
          display: inline-block;
          background: linear-gradient(90deg, #2563eb, #4f46e5);
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .formcard-btn:hover {
          background: linear-gradient(90deg, #1e40af, #4338ca);
          transform: translateY(-3px);
        }
      `}</style>

      <div className="formcard">
        <h2 className="formcard-title">{title}</h2>
        <a href={link} download className="formcard-btn">
          Download Form
        </a>
      </div>
    </>
  );
};

export default FormCard;
