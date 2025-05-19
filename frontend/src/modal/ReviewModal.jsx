import React, { useState, useEffect } from "react";
import styled from "styled-components";

// ===== Styled Components =====
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6); /* Darker background for a modern look */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.3s ease-in-out; /* Smooth fade-in animation */
`;

const Modal = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 480px;
  max-width: 90%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out; /* Smooth slide-in effect */
`;

const Title = styled.h3`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const Label = styled.label`
  font-weight: 500;
  display: block;
  margin: 16px 0 8px;
  color: #555;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
`;

const Star = styled.span`
  font-size: 28px;
  cursor: pointer;
  color: ${props => props.active ? "#FFD700" : "#ccc"};
  transition: color 0.3s ease;
  
  &:hover {
    color: #FFD700; /* Hover effect for stars */
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  border: 2px solid #ddd;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff; /* Highlight border on focus */
  }
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  background-color: ${props => props.cancel ? "#f44336" : "#007bff"};
  color: #fff;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    opacity: 0.85; /* Subtle hover effect */
  }

  &:focus {
    outline: none;
  }
`;

// ===== Component =====
const ReviewModal = ({ isOpen, onClose, booking, onSave }) => {
    const [rating, setRating] = useState(10);
    const [text, setText] = useState("");

    // Reset modal state when opened or closed
    useEffect(() => {
        if (isOpen && booking) {
            setText(booking.review || "");
            setRating(booking.rating || 10); // if rating is stored
        } else {
            setText("");
            setRating(10);
        }
    }, [isOpen, booking]);

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleSave = () => {
        onSave(booking._id, text, rating); // 👈 Truyền đủ thông tin
        onClose();
    };

    if (!isOpen || !booking) return null;

    return (
        <Overlay>
            <Modal>
                <Title>Movie Review</Title>
                <p><strong>Movie:</strong> {booking?.show_time_id?.film_id?.film_name}</p>

                <Label>Rating</Label>
                <StarContainer>
                    {[...Array(10)].map((_, i) => (
                        <Star
                            key={i}
                            active={i < rating}
                            onClick={() => handleStarClick(i)}
                        >
                            ★
                        </Star>
                    ))}
                </StarContainer>
                <div>({rating}/10)</div>

                <Label>Your Review</Label>
                <Textarea
                    placeholder="Write you review here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <ButtonGroup>
                    <Button cancel onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </ButtonGroup>
            </Modal>
        </Overlay>
    );
};

export default ReviewModal;


