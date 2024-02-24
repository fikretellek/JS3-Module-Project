const cardArea = document.getElementById("cardArea");
const select = document.querySelector("#episodeSelector");
const allEpisodesButton = document.getElementById("allEpisodesButton");
allEpisodesButton.style.display = "none";
const searchInput = document.querySelector("#q");

function getShowsFetch() {
  fetch("https://api.tvmaze.com/shows ")
    .then((response) => response.json())
    .then((data) => {
      generateShowOptions(sortShowsByName(data));
    });
}
getShowsFetch();

function getFetch(showNumber) {
  fetch(`https://api.tvmaze.com/shows/${showNumber}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      updateAllEpisodeCount(data);
      createEpisodeSelector(data);
      generateAllCards(data);
      searchInput.addEventListener("input", () => searchEvent(data));
      select.addEventListener("change", () => selectEpisodeEvent(data));
      allEpisodesButton.addEventListener("click", () => backToAllEpisodes(data));
    })
    .catch((err) => console.log(err));
}

function sortShowsByName(shows) {
  return shows.sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    return 0;
  });
}

function generateShowOptions(shows) {
  shows.map((show) => {
    const showOption = document.createElement("option");
    showOption.innerText = show.name;
    showOption.value = show.id;
    document.getElementById("showSelector").append(showOption);
  });
}

document.querySelector("#showSelector").addEventListener("change", (e) => {
  const episodeId = document.querySelector("#showSelector").value;
  getFetch(episodeId);
});

function createTemplate() {
  const cardTemplate = document.createElement("template");
  cardTemplate.setAttribute("class", "cardTemplate");

  const cardEpisode = document.createElement("div");
  cardEpisode.setAttribute("class", "cardEpisode");

  const titleEpisode = document.createElement("h1");
  titleEpisode.setAttribute("class", "titleEpisode");

  const contImage = document.createElement("div");
  contImage.setAttribute("class", "contImage");

  const imgEpisode = document.createElement("img");
  imgEpisode.setAttribute("class", "imgEpisode");

  const summaryEpisode = document.createElement("p");
  summaryEpisode.setAttribute("class", "summaryEpisode");

  contImage.append(imgEpisode);
  cardEpisode.append(titleEpisode, contImage, summaryEpisode);
  cardTemplate.content.append(cardEpisode);
  document.body.append(cardTemplate);
}
createTemplate();

function generateEpisodeCode(episode) {
  return `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
}

function generateOneCard(episode) {
  const episodeCode = generateEpisodeCode(episode);

  const card = document.querySelector("template").content.cloneNode(true);

  const titleCard = card.querySelector(".titleEpisode");
  titleCard.innerText = `${episode.name}\n - ${episodeCode}`;

  const imgCard = card.querySelector(".imgEpisode");
  //why is this not working ????? imgCard.setAttribute("src", episode.image.medium ?? empty);
  // this doesnt work either
  // if (episode.image.medium) {
  //   imgCard.setAttribute("src", episode.image.medium ? episode.image.medium : "");
  // }
  const imageSrc = episode.image && episode.image.medium ? episode.image.medium : "";
  const imageAlt = episode.name || "Episode Image";
  imgCard.setAttribute("src", imageSrc);
  imgCard.setAttribute("alt", imageAlt);

  const summaryCard = card.querySelector(".summaryEpisode");
  summaryCard.innerHTML = episode.summary;

  const linkCard = document.createElement("a");
  linkCard.setAttribute("href", episode.url);

  summaryCard.after(linkCard);

  cardArea.append(card);
}

function createEpisodeSelector(allEpisodes) {
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const episodeCode = generateEpisodeCode(episode);
    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;
    select.appendChild(option);
  });
}

function generateAllCards(currentEpisodes) {
  cardArea.innerHTML = "";
  createTemplate();
  currentEpisodes.map((episode) => generateOneCard(episode));
  updateCurrentEpisodeCount(currentEpisodes);
}

function updateCurrentEpisodeCount(shows) {
  document.getElementById("currentEpisodesCount").innerText = shows.length;
}

function updateAllEpisodeCount(shows) {
  document.getElementById("allEpisodesCount").innerText = shows.length;
}

function modifyAllEpisodesButton() {
  if (select.value != "default" || searchInput.value) {
    allEpisodesButton.style.display = "block";
  } else if (select.value === "default" || !searchInput.value) {
    allEpisodesButton.style.display = "none";
  }
}

function backToAllEpisodes(allEpisodes) {
  select.value = "default";
  searchInput.value = "";
  allEpisodesButton.style.display = "none";
  generateAllCards(allEpisodes);
}

cardArea.addEventListener("click", (event) => {
  const target = event.target.closest(".cardEpisode");

  if (target) {
    const link = target.querySelector("a");
    window.open(link.getAttribute("href"), "_blank");
  }
});

function searchEvent(shows) {
  select.value = "default";
  const searchTerm = searchInput.value.trim().toLowerCase();
  let currentEpisodes = shows.filter(
    (episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm)
  );
  if (searchInput.value) {
    select.value = "select";
  }
  generateAllCards(currentEpisodes);
  modifyAllEpisodesButton();
}

function selectEpisodeEvent(shows) {
  searchInput.value = "";
  if (select.value === "default") {
    currentEpisodes = shows;
  } else {
    currentEpisodes = shows.filter((episode) => episode.id === parseInt(select.value));
  }
  generateAllCards(currentEpisodes);
  modifyAllEpisodesButton();
}
