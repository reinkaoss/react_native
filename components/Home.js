import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Card, Button, SearchBar } from "react-native-elements";
import Carousel from "react-native-snap-carousel";
var randomWords = require("random-words");

function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovies = async (search) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?s=${search}&apikey=3c5c747f`
      );
      const data = await response.json();
      if (data.Search && data.Search.length > 0) {
        const imdbIds = data.Search.map((movie) => movie.imdbID);
        const moviesWithDetails = await Promise.all(
          imdbIds.map(async (imdbId) => {
            const detailsResponse = await fetch(
              `http://www.omdbapi.com/?i=${imdbId}&apikey=3c5c747f`
            );
            const detailsData = await detailsResponse.json();
            // console.log(detailsData)
            return detailsData;
          })
        );
        setMovies(moviesWithDetails.slice(0, 10)); // only store the first 10 movies in the state
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error(error);
      setMovies([]);
    }
  };

  const handleSearch = () => {
    fetchMovies(randomWords());
  };

  const handleDescrip = (movie) => {
    setSelectedMovie(movie);
  };

  const handleWatchLater = (movie) => {
    setFavorites([...favorites, movie]);
    console.log(favorites)
  };

  const convertRatingToStars = (rating) => {
    const numStars = Math.round(rating) / 2;
    const fullStars = Math.floor(numStars);
    const halfStars = Math.round(numStars - fullStars);
    const emptyStars = 5 - fullStars - halfStars;
    return (
      "★".repeat(fullStars) + "☆".repeat(halfStars) + "☆".repeat(emptyStars)
    );
  };

  const renderMovie = ({ item }) => {
    // console.log(movies);
    return (
      <View style={styles.cardContainer}>
        <Card style={styles.card} key={item.imdbID}>
          <Card.Title style={styles.cardTitle}>
            {item.Title} ({item.Year})
          </Card.Title>
          <TouchableOpacity onPress={() => handleDescrip(item)}>
            <Card.Image
              source={{ uri: item.Poster }}
              resizeMode="cover"
              style={styles.image}
            />
          </TouchableOpacity>
        </Card>
      </View>
    );
  };

  const renderMovies = () => {
    return (
      <Carousel
        data={movies}
        renderItem={renderMovie}
        sliderWidth={400}
        itemWidth={300}
        itemHeight={400}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a Random Movie!</Text>
      <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
      {renderMovies()}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          icon={{ name: "rowing", color: "#ffffff" }}
          title="MEOW"
          onPress={handleSearch}
        />
      </View>
      <Modal visible={selectedMovie !== null} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedMovie && (
            <>
              <Image
                source={{ uri: selectedMovie.Poster }}
                resizeMode="cover"
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>
                {selectedMovie.Title} ({selectedMovie.Year})
              </Text>
              <Text style={styles.modalRating}>
                IMDb Rating: {selectedMovie.imdbRating} (
                {convertRatingToStars(selectedMovie.imdbRating)})
              </Text>
              <Text style={styles.modalPlot}>{selectedMovie.Plot}</Text>
              <Button
                title="Close"
                onPress={() => setSelectedMovie(null)}
                style={styles.modalButton}
              />
        <Button
          style={styles.button}
          icon={{ name: "star", color: "#ffffff" }}
          title="Watch Later"
          onPress={() => handleWatchLater(selectedMovie)}
        />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
    
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
    paddingTop: 25,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    paddingTop: 25,
    textAlign: 'center',
  },
  card: {
    maxWidth: 200,
    borderRadius: 15,
    
  },
  cardContainer: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 300,
    aspectRatio: 2 / 2, // set a fixed aspect ratio for the image
    maxHeight: 400,
    minWidth: 50,
    maxWidth: 200,
    alignItems: "center",
    alignContent: "center",
    borderRadius: 5,
    padding: 0,
    
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 0.3,
    width: 150,
  },
  button: {
    width: 50,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 50,
  },
  modalImage: {
    height: 300,
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalRating: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  modalPlot: {
    fontSize: 16,
    textAlign: "justify",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    marginTop: 20,
  },
});

export default Home;
