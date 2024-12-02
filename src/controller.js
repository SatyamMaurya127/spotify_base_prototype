// Get references to HTML elements
const uriInput = document.getElementById("uri");
const playButton = document.getElementById("playButton");
const audioPlayer = document.getElementById("audioPlayer");

// Function to play the audio stream
const playAudioStream = async () => {
  const spotifyUrl = uriInput.value.trim();
  console.log(spotifyUrl);
  if (!spotifyUrl) {
    alert("Please enter a Spotify URI");
    return;
  }

  try {
    // Make a POST request to the backend
    const response = await fetch("http://localhost:3000/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spotifyUrl }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Convert response to a Blob and create an object URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Set the object URL as the audio player's source
    audioPlayer.src = audioUrl;
    await audioPlayer.play();
  } catch (err) {
    console.error("Error playing audio:", err);
    alert("Failed to play the audio stream");
  }
};

// Attach event listener to the play button
playButton.addEventListener("click", playAudioStream);
