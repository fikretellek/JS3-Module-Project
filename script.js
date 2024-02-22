// Add your JavaScript code here

// Function to populate the dropdown with TV shows
async function populateShowsDropdown() {
  const response = await fetch("https://api.tvmaze.com/shows");
  const data = await response.json();
  const showSelector = document.getElementById("showSelector");

  data.sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );

  data.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

// Function to display episodes for the selected show
async function displayEpisodesForShow(showId) {
  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`
  );
  const episodes = await response.json();
  const cardArea = document.getElementById("cardArea");
  cardArea.innerHTML = "";

  episodes.forEach((episode) => {
    const card = document.createElement("div");
    card.classList.add("cardEpisode"); // Updated class name
    card.innerHTML = `
            <h3>${episode.name}</h3>
            <p>Season ${episode.season} Episode ${episode.number}</p>
            <img src="${episode.image.medium}" alt="${episode.name}"> <!-- Include the image -->
            <p>${episode.summary}</p>
        `;
    card.addEventListener("click", () => {
      window.open(episode.url, "_blank");
    });
    cardArea.appendChild(card);
  });
}

// Function to initialize the page
window.onload = async () => {
  await populateShowsDropdown();

  const showSelector = document.getElementById("showSelector");
  showSelector.addEventListener("change", async (event) => {
    const showId = event.target.value;
    if (showId !== "default") {
      await displayEpisodesForShow(showId);
    } else {
      document.getElementById("cardArea").innerHTML = "";
    }
  });

  const searchInput = document.getElementById("q");
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const episodeCards = document.querySelectorAll(".cardEpisode");
    episodeCards.forEach((card) => {
      const episodeName = card.querySelector("h3").textContent.toLowerCase();
      const episodeSummary = card
        .querySelector("p:nth-of-type(3)")
        .textContent.toLowerCase();
      if (
        episodeName.includes(searchTerm) ||
        episodeSummary.includes(searchTerm)
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
};
