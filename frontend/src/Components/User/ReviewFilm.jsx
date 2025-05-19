import styled from "styled-components";
import { Card, List, Spin, Empty } from "antd";
import { StarOutlined } from '@ant-design/icons'; // Import biểu tượng sao
import Header from "../../utils/User/Header.jsx";
import Footer from "../../utils/User/Footer.jsx";
import { useEffect, useState } from "react";
import axios from "axios";


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


const ReviewFilm = ({ onLogout }) => {
    const [token, setToken] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);


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
        const fetchReviews = async () => {
            if (!token?.user?._id) return;
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/review/user/${token.user._id}`);
                setReviews(res.data.reviews || []);
            } catch (err) {
                console.error("❌ Lỗi khi lấy đánh giá:", err);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };


        fetchReviews();
    }, [token]);


    return (
        <>
            <Container>
                <Header onLogout={onLogout} />
                <BodyWrapper>
                    <h2>Danh Sách Đánh Giá Phim</h2>
                    <Card style={{ width: "90%", maxWidth: 800 }}>
                        {loading ? (
                            <Spin />
                        ) : reviews.length === 0 ? (
                            <Empty description="Không có đánh giá nào." />
                        ) : (
                            <List
                                itemLayout="vertical"
                                dataSource={reviews}
                                renderItem={(item) => (
                                    <List.Item key={item._id}>
                                        <div style={{ textAlign: "left" }}>
                                            <h3 style={{ marginBottom: 0 }}>
                                                {item.film_id?.film_name || "Tên phim không xác định"}
                                            </h3>
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <span>
                                                    {item.rate}/10 <StarOutlined style={{ marginLeft: 4, color: "#ffb400" }} />
                                                </span>
                                            </div>
                                            <p style={{ margin: "8px 0" }}>{item.comment}</p>
                                            <small style={{ color: "#888" }}>
                                                {new Date(item.created_at).toLocaleString()}
                                            </small>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </BodyWrapper>
                <Footer />
            </Container>
        </>
    );
};


export default ReviewFilm;





