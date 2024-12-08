import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AadharForm.css';

const AadharForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    aadharNumber: '',
    gender: '',
    fatherName: '',
    address: '',
    image: null,
  });
  const [imageBase64, setImageBase64] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [downloadURL, setDownloadURL] = useState(''); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append('fullName', formData.fullName);
    formDataObj.append('dob', formData.dob);
    formDataObj.append('aadharNumber', formData.aadharNumber);
    formDataObj.append('gender', formData.gender);
    formDataObj.append('fatherName', formData.fatherName);
    formDataObj.append('address', formData.address);
    formDataObj.append('image', formData.image);

    try {
      const response = await axios.post('http://localhost:3000/submit-form', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponseData(response.data);

    setDownloadURL(response.data);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const generatePDF = () => {
    const cardElement = document.getElementById('aadhar-card');
    html2canvas(cardElement, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', [86, 54]);
      pdf.addImage(imgData, 'PNG', 0, 0, 86, 54);
      pdf.save('aadhar_card.pdf');
    });
  };

  return (
    <div className="aadhar-form-container">
      <form onSubmit={handleSubmit} className="aadhar-form">
        <h1>Create Aadhar Card</h1>
        <div className="form-group">
          <input
            type="text"
            name="fullName"
            placeholder="Your Full Name in English"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="aadharNumber"
            placeholder="Aadhar Card Number"
            value={formData.aadharNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="fatherName"
            placeholder="Father's Name"
            value={formData.fatherName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Make Aadhar Card</button>
      </form>

      {responseData && (
        <div className="aadhar-card" id="aadhar-card">
          <div className="aadhar-card-content">
            <div className="aadhar-card-left">
              {imageBase64 && (
                <img src={imageBase64} alt="Aadhar Holder" className="aadhar-img" />
              )}
            </div>
            <div className="aadhar-card-right">
              <div className="right-text">
                <p><strong>Full Name:</strong> {formData.fullName}</p>
                <p><strong>Date of Birth:</strong> {formData.dob}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>Father's Name:</strong> {formData.fatherName}</p>
              </div>
              <QRCodeSVG value={downloadURL} size={100} />
            </div>
          </div>
          <div className="adhar-number">
            <h3>{formData.aadharNumber}</h3>
          </div>
        </div>
      )}

      {responseData && (
        <button className="download-btn" onClick={generatePDF}>Download Aadhar Card PDF</button>
      )}
    </div>
  );
};

export default AadharForm;
