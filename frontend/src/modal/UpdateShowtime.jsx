import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Loading from "../utils/Loading.jsx";

const apiFilmUrl = import.meta.env.VITE_API_FILM_URL;

function UpdateShowtime({ onClose, onRefresh, selectedShowtimeId }) {
    const [selectedMovie, setSelectedMovie] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiFilmUrl);
                const activeMovies = response.data.filter(movie => movie.is_active === true);
                setMovies(activeMovies);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movies:", error);
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Handle form submission (in case you need it for updating or any other action)
    const handleUpdate = async () => {
        if (!selectedMovie) {
            alert("Please select a movie!");
            return;
        }

        try {
            setLoading(true);

            // Placeholder logic for updating the selected movie
            console.log("Selected Movie ID:", selectedMovie);
            // Example PUT request to update the showtime (implement as needed)
            // await axios.put(`${apiShowTimeUrl}/${selectedShowtimeId}`, {
            //     film_id: selectedMovie,
            // });  

            onClose();
            if (onRefresh) onRefresh();
            setLoading(false);
        } catch (error) {
            console.error("Error updating showtime:", error);
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <ModalOverlay>
                <ModalContent>
                    <TitleCustom>Update Movie Screening</TitleCustom>
                    <FormGroup>
                        <LabelCustom>Movie:</LabelCustom>
                        <select
                            value={selectedMovie}
                            onChange={(e) => setSelectedMovie(e.target.value)}
                        >
                            <option value="">Select Movie</option>
                            {movies.map((movie) => (
                                <option key={movie._id} value={movie._id}>
                                    {movie.film_name}
                                </option>
                            ))}
                        </select>
                    </FormGroup>
                    <ButtonContainer>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button primary="true" onClick={handleUpdate}>Update</Button>
                    </ButtonContainer>
                </ModalContent>
            </ModalOverlay>
        </>
    );
}

export default UpdateShowtime;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: 450px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;

    label {
        display: block;
        margin-bottom: 5px;
    }

    select {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: ${(props) => (props.primary ? "#4CAF50" : "#f44336")};
    color: white;
`;

const TitleCustom = styled.h3`
    text-align: center;
    font-size: 1.5rem;
`;

const LabelCustom = styled.label`
    font-size: 1.2rem;
    font-weight: bold;
`;

