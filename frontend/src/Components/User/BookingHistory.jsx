import styled from "styled-components";
import { message } from "antd";
import Header from "../../utils/User/Header.jsx";
import Footer from "../../utils/User/Footer.jsx";
import { useEffect, useState } from "react";
import Loading from "../../utils/Loading.jsx";
import axios from "axios";
import ReviewModal from "../../modal/ReviewModal.jsx";
import QRCodeModal from "../../modal/QRCodeModal.jsx";


const Container = styled.div`
    padding: 80px 0;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;


const BodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;


const Table = styled.table`
    border-collapse: collapse;
    width: 90%;
    margin: 0 auto;
`;


const Th = styled.th`
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: 1px solid #ddd;
`;


const Td = styled.td`
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
`;


const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }


    &:hover {
        background-color: #f1f1f1;
    }
`;


const ReviewButton = styled.button`
    background-color: #28a745;
    color: white;
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;


    &:hover {
        background-color: #218838;
    }
`;


const apiGetPayment = import.meta.env.VITE_API_PAYMENT_URL;
const apiCreateReview = "http://localhost:5000/api/v1/review";


function BookingHistory({ onLogout }) {
    const [token, setToken] = useState(null);
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(false);


    const [reviewStatus, setReviewStatus] = useState({});
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);


    const [qrBooking, setQRBooking] = useState(null);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);


    useEffect(() => {
        const tokenString = localStorage.getItem("token");
        try {
            const parsedToken = tokenString ? JSON.parse(tokenString) : null;
            setToken(parsedToken);
        } catch (error) {
            console.error("Failed to parse token:", error);
            setToken(null);
        }
    }, []);


    useEffect(() => {
        if (!bookingHistory || bookingHistory.length === 0) return;


        const fetchReviewStatus = async () => {
            const statusMap = {};


            for (const booking of bookingHistory) {
                try {
                    const res = await fetch(`http://localhost:5000/api/v1/review/payment/${booking._id}`);
                    const data = await res.json();
                    statusMap[booking._id] = data.reviews.length > 0;
                } catch (error) {
                    console.error(`Error fetching review for booking ${booking._id}:`, error);
                    statusMap[booking._id] = false;
                }
            }


            setReviewStatus(statusMap);
        };


        fetchReviewStatus();
    }, [bookingHistory]);


    useEffect(() => {
        if (token?.user?._id) {
            setLoading(true);
            axios
                .get(apiGetPayment, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token.access_token}`,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    const filteredData = data
                        .filter((item) => item.user_id?._id === token.user._id)
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setBookingHistory(filteredData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching payment data:", error);
                    setLoading(false);
                });
        }
    }, [token]);


    const handleSaveReview = (bookingId, reviewText, rating) => {
        const booking = bookingHistory.find(b => b._id === bookingId);
        if (!booking) {
            console.error("❌ Không tìm thấy thông tin booking.");
            return;
        }


        const userId = token?.user?._id;


        const reviewData = {
            payment_id: booking._id,
            show_time_id: booking.show_time_id?._id,
            user_id: userId,
            film_id: booking.show_time_id?.film_id?._id,
            rate: rating,
            comment: reviewText,
        };


        axios
            .post(apiCreateReview, reviewData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.access_token}`,
                },
            })
            .then((response) => {
                message.success("Đánh giá thành công!");
                setIsReviewModalOpen(false);
                setTimeout(() => window.location.reload(), 500);
            })
            .catch((error) => {
                console.error("❌ Lỗi khi gửi đánh giá:", error.response?.data || error.message);
                message.error("Gửi đánh giá thất bại.");
            });
    };


    return (
        <>
            {loading && <Loading />}
            <Container>
                <Header onLogout={onLogout} />
                <BodyWrapper>
                    <h2>Booking History</h2>
                    {bookingHistory.length > 0 ? (
                        <Table>
                            <thead>
                                <tr>
                                    <Th>Film Name</Th>
                                    <Th>Branch Name</Th>
                                    <Th>Screen Name</Th>
                                    <Th>List Seat</Th>
                                    <Th>Total Price</Th>
                                    <Th>Discount</Th>
                                    <Th>Paid Amount</Th>
                                    <Th>Going Date Time</Th>
                                    <Th>Payment Time</Th>
                                    <Th>Review</Th>
                                    <Th>QR Code</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingHistory.map((booking, index) => {
                                    const discount = (booking.total_price * booking.discount) / 100;
                                    return (
                                        <TableRow key={index}>
                                            <Td>{booking?.show_time_id?.film_id?.film_name || ""}</Td>
                                            <Td>{booking?.show_time_id?.branch_id?.branch_name || ""}</Td>
                                            <Td>
                                                {
                                                    booking?.show_time_id?.branch_id?.list_screen.find(
                                                        (screen) => screen._id === booking?.show_time_id?.screen_id
                                                    )?.screen_name || ""
                                                }
                                            </Td>
                                            <Td>{booking.list_seat.join(", ")}</Td>
                                            <Td>{booking.total_price.toLocaleString()} VND</Td>
                                            <Td>{discount.toLocaleString()} VND</Td>
                                            <Td>{booking.paid_amount.toLocaleString()} VND</Td>
                                            <Td>{new Date(booking.show_time_id?.start_time).toLocaleString()}</Td>
                                            <Td>{new Date(booking.created_at).toLocaleString()}</Td>
                                            <Td>
                                                {reviewStatus[booking._id] ? (
                                                    <span>Reviewed</span>
                                                ) : (
                                                    <ReviewButton
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsReviewModalOpen(true);
                                                        }}
                                                    >
                                                        Review
                                                    </ReviewButton>
                                                )}
                                            </Td>
                                            <Td>
                                                <button
                                                    onClick={() => {
                                                        setQRBooking(booking);
                                                        setIsQRModalOpen(true);
                                                    }}
                                                >
                                                    Show
                                                </button>
                                            </Td>
                                        </TableRow>
                                    );
                                })}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Không có lịch sử đặt vé nào.</p>
                    )}
                </BodyWrapper>
                <Footer />
            </Container>


            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                booking={selectedBooking}
                onSave={handleSaveReview}
            />


            {/* QR Code Modal */}
            {isQRModalOpen && qrBooking && (
                <QRCodeModal
                    booking={qrBooking}
                    onClose={() => {
                        setIsQRModalOpen(false);
                        setQRBooking(null);
                    }}
                />
            )}
        </>
    );
}


export default BookingHistory;