import React from 'react';
import styled from "styled-components";
import QRCode from "react-qr-code"; // Sử dụng react-qr-code

// Modal wrapper styles
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Tối hơn để tạo độ mờ */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Thêm bóng đổ */
  transition: transform 0.3s ease;
  animation: zoomIn 0.3s ease-out; /* Animation khi modal hiện lên */
  
  /* Hiệu ứng di chuột */
  &:hover {
    transform: scale(1.05);
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #FF4C00;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #e64500; /* Màu sắc thay đổi khi di chuột */
  }
  
  &:focus {
    outline: none;
  }
`;

const QRCodeContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h3`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

function QRCodeModal({ booking, onClose }) {
  const qrData = JSON.stringify({
    film: booking?.show_time_id?.film_id?.film_name,
    seats: booking?.list_seat,
    date: booking?.show_time_id?.start_time,
    branch: booking?.show_time_id?.branch_id?.branch_name,
    screen: booking?.show_time_id?.branch_id?.list_screen.find(
      (screen) => screen._id === booking?.show_time_id?.screen_id
    )?.screen_name,
    paymentTime: booking?.created_at,
    paidAmount: booking?.paid_amount,
  });

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Heading>QR Code</Heading>
        <QRCodeContainer>
          <QRCode value={qrData} size={200} />
        </QRCodeContainer>
        <CloseButton onClick={onClose}>Đóng</CloseButton>
      </ModalContent>
    </ModalBackground>
  );
}

export default QRCodeModal;
