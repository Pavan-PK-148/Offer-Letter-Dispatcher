import React, { createContext, useState, useContext } from 'react';

const DispatchContext = createContext();

export const DispatchProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [csvData, setCsvData] = useState([]);
  const [recognizedColumns, setRecognizedColumns] = useState({});
  const [metrics, setMetrics] = useState({ total: 0, selected: 0, valid: 0, invalid: 0 });
  const [selectedLogos, setSelectedLogos] = useState(['Xyzon']);
  const [emailSubject, setEmailSubject] = useState('Your Internship Offer — {Role} at Xyzon Innovations');
  const [emailBody, setEmailBody] = useState(
    `<div style="font-family: sans-serif; padding: 20px; color: #334155;">
  <h2>Internship Offer Letter</h2>
  <p>Dear <strong>{name}</strong>,</p>
  <p>Congratulations! We are delighted to offer you the role of <strong>{Role}</strong> at Xyzon Innovations Private Limited.</p>
  <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #4f46e5; margin: 15px 0;">
    <strong>Position:</strong> {Role}<br/>
    <strong>Duration:</strong> {Duration}<br/>
    <strong>Start Date:</strong> {Start Date}<br/>
    <strong>Work Mode:</strong> {Mode}
  </div>
  <p>Best regards,<br/>HR Team</p>
</div>`
  );
  const [dispatchSettings, setDispatchSettings] = useState({
    delay: 0,
    retryOnFailure: true,
  });

  const updateMetrics = (data) => {
    const total = data.length;
    const selected = data.filter(row => row.isSelected !== false).length;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    let valid = 0;
    let invalid = 0;

    data.forEach(row => {
      // Find the mapped email field dynamically
      const emailKey = Object.keys(recognizedColumns).find(key => recognizedColumns[key] === 'Contact Email') || 'email';
      const emailVal = row[emailKey] || '';
      if (emailRegex.test(emailVal.trim())) {
        valid++;
      } else {
        invalid++;
      }
    });

    setMetrics({ total, selected, valid, invalid });
  };

  return (
    <DispatchContext.Provider value={{
      currentStep, setCurrentStep,
      csvData, setCsvData,
      recognizedColumns, setRecognizedColumns,
      metrics, setMetrics,
      selectedLogos, setSelectedLogos,
      emailSubject, setEmailSubject,
      emailBody, setEmailBody,
      dispatchSettings, setDispatchSettings,
      updateMetrics
    }}>
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatch = () => useContext(DispatchContext);