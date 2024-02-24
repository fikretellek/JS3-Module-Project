const cardArea = document.getElementById("cardArea");
const cardAreaShow = document.getElementById("cardAreaShow");

const select = document.querySelector("#episodeSelector");
const showSelect = document.querySelector("#showSelector");
const allEpisodesButton = document.createElement("button");
const allShowsButton = document.createElement("button");

const searchInputShow = document.querySelector("#searchShows");
const searchInputEpisodes = document.querySelector("#searchEpisodes");

function getShowsFetch() {
  fetch("https://api.tvmaze.com/shows ")
    .then((response) => response.json())
    .then((data) => {
      generateShowOptions(sortShowsByName(data));
      updateAllShowCount(data);

      generateAllShows(data);
      showSelect.addEventListener("change", () => selectShowEvent(data));
      searchInputShow.addEventListener("input", () => searchShowEvent(data));
      allShowsButton.addEventListener("click", () => backToAllShows(data));
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

      select.addEventListener("change", () => selectEpisodeEvent(data));
      searchInputEpisodes.addEventListener("input", () => searchEpisodeEvent(data));
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

function createTemplate() {
  const cardTemplate = document.createElement("template");
  cardTemplate.setAttribute("class", "cardTemplate");

  const cardEpisode = document.createElement("div");
  cardEpisode.setAttribute("class", "cardEpisode card");

  const titleEpisode = document.createElement("h1");
  titleEpisode.setAttribute("class", "titleEpisode title");

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

function createEpisodeSelector(allEpisodes) {
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const episodeCode = generateEpisodeCode(episode);
    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;
    select.appendChild(option);
  });
}
function resetSelectedShow() {
  while (select.childElementCount > 2) {
    select.removeChild(select.lastChild);
  }
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

function generateAllCards(currentEpisodes) {
  cardArea.innerHTML = "";
  cardAreaShow.innerHTML = "";

  currentEpisodes.map((episode) => generateOneCard(episode));
  updateCurrentEpisodeCount(currentEpisodes);

  searchInputShow.style.display = "none";
  searchInputEpisodes.style.display = "block";
}

function updateCurrentEpisodeCount(shows) {
  document.getElementById("currentEpisodesCount").innerText = shows.length;
  document.getElementById("episodeCountInfo").style.display = "block";
  document.getElementById("showCountInfo").style.display = "none";
}

function updateCurrentShowCount(shows) {
  document.getElementById("currentShowsCount").innerText = shows.length;
  document.getElementById("showCountInfo").style.display = "block";
  document.getElementById("episodeCountInfo").style.display = "none";
}

function updateAllEpisodeCount(shows) {
  document.getElementById("allEpisodesCount").innerText = shows.length;
}
function updateAllShowCount(shows) {
  document.getElementById("allShowsCount").innerText = shows.length;
}

document.querySelector("#cardArea").addEventListener("click", (event) => {
  const target = event.target.closest(".card");

  if (target) {
    const link = target.querySelector("a");
    window.open(link.getAttribute("href"), "_blank");
  }
});
document.querySelector("#cardAreaShow").addEventListener("click", (event) => {
  const target = event.target.closest(".card");

  if (target) {
    const showId = target.querySelector("a").id;
    getFetch(showId);

    showSelect.value = showId;

    modifyAllShowButton();
  }
});

function searchEpisodeEvent(shows) {
  searchInputShow.value = "";
  select.value = "default";
  const searchTerm = searchInputEpisodes.value.trim().toLowerCase();
  let currentEpisodes = shows.filter(
    (episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm)
  );
  if (searchInputEpisodes.value) {
    select.value = "select";
  }
  generateAllCards(currentEpisodes);
  modifyAllEpisodesButton();
}
function searchShowEvent(shows) {
  searchInputEpisodes.value = "";
  select.value = "default";
  showSelect.value = "default";

  const searchTerm = searchInputShow.value.trim().toLowerCase();
  let currentShows = shows.filter(
    (episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm)
  );
  if (searchInputShow.value) {
    showSelect.value = "select";
  }
  generateAllShows(currentShows);
  modifyAllShowButton();
}

function selectEpisodeEvent(shows) {
  searchInputEpisodes.value = "";
  if (select.value === "default") {
    currentEpisodes = shows;
  } else {
    currentEpisodes = shows.filter((episode) => episode.id === parseInt(select.value));
  }
  generateAllCards(currentEpisodes);
  modifyAllEpisodesButton();
}

function selectShowEvent(shows) {
  searchInputShow.value = "";
  searchInputEpisodes.value = "";
  select.value = "default";

  showSelect.value === "default" ? generateAllShows(shows) : getFetch(showSelect.value);
  modifyAllShowButton();
}

function modifyAllEpisodesButton() {
  if (select.value != "default" || searchInputEpisodes.value) {
    checkAndRemoveAllEpisodesButton();
    allEpisodesButton.id = "allEpisodesButton";
    allEpisodesButton.className = "backButton";
    allEpisodesButton.innerText = "← All episodes";
    document.querySelector("header").append(allEpisodesButton);
  } else if (select.value === "default" || !searchInputEpisodes.value) {
    checkAndRemoveAllEpisodesButton();
  }
}

function modifyAllShowButton() {
  if (showSelect.value != "default" || searchInputShow.value) {
    checkAndRemoveAllShowsButton();
    allShowsButton.id = "allShowsButton";
    allShowsButton.className = "backButton";
    allShowsButton.innerText = "← All shows";
    document.querySelector("#showSelector").before(allShowsButton);
  } else if (showSelect.value === "default" || !searchInputShow.value) {
    checkAndRemoveAllShowsButton();
  }
}

function backToAllEpisodes(allEpisodes) {
  select.value = "default";
  searchInputEpisodes.value = "";
  checkAndRemoveAllEpisodesButton();
  generateAllCards(allEpisodes);
}

function backToAllShows(shows) {
  showSelect.value = "default";
  select.value = "default";
  searchInputShow.value = "";
  checkAndRemoveAllShowsButton();
  checkAndRemoveAllEpisodesButton();
  generateAllShows(shows);
}

function createShowTemplate() {
  const showCardTemplate = document.createElement("template");
  showCardTemplate.setAttribute("class", "showCardTemplate");

  const cardShow = document.createElement("div");
  cardShow.setAttribute("class", "cardShow card");

  //

  const contImage = document.createElement("div");
  contImage.setAttribute("class", "contImageShow");
  const imgShow = document.createElement("img");
  imgShow.setAttribute("class", "imgShow");
  contImage.append(imgShow);
  //

  const contShow = document.createElement("div");
  contShow.setAttribute("class", "contShow");

  //
  const titleShow = document.createElement("h1");
  titleShow.setAttribute("class", "titleShow title");

  const contInfo = document.createElement("div");
  contInfo.setAttribute("class", "contInfo");

  //

  const summaryShow = document.createElement("p");
  summaryShow.setAttribute("class", "summaryShow");

  const contShowInfo = document.createElement("div");
  contShowInfo.setAttribute("class", "contShowInfo");

  const showRate = document.createElement("p");
  showRate.setAttribute("class", "showRate");

  const showGenres = document.createElement("p");
  showGenres.setAttribute("class", "showGenres");

  const showStatus = document.createElement("p");
  showStatus.setAttribute("class", "showStatus");

  const showRuntime = document.createElement("p");
  showRuntime.setAttribute("class", "showRuntime");

  cardShow.append(contImage, contShow);
  contShow.append(titleShow, contInfo);
  contInfo.append(summaryShow, contShowInfo);
  contShowInfo.append(showRate, showGenres, showStatus, showRuntime);

  showCardTemplate.content.append(cardShow);
  document.body.append(showCardTemplate);
}

createShowTemplate();

function generateOneShow(show) {
  const showCard = document.querySelector(".showCardTemplate").content.cloneNode(true);

  const titleShowCard = showCard.querySelector(".titleShow");
  titleShowCard.innerText = show.name;

  const imgShow = showCard.querySelector(".imgShow");
  const imageSrc = show.image && show.image.medium ? show.image.medium : "";
  const imageAlt = show.name || "Show Image";
  imgShow.setAttribute("src", imageSrc);
  imgShow.setAttribute("alt", imageAlt);

  const summaryShow = showCard.querySelector(".summaryShow");
  summaryShow.innerHTML = show.summary;

  const showRate = showCard.querySelector(".showRate");
  showRate.innerHTML = `Rated: ${show.rating.average}`;

  const showGenres = showCard.querySelector(".showGenres");
  showGenres.innerHTML = `Genres: ${show.genres && show.genres.length > 0 ? show.genres.toString() : ""}`;

  const showStatus = showCard.querySelector(".showStatus");
  showStatus.innerHTML = `Status: ${show.status}`;

  const showRuntime = showCard.querySelector(".showRuntime");
  showRuntime.innerHTML = `Runtime: ${show.runtime}`;

  const linkShow = document.createElement("a");
  linkShow.setAttribute("href", show.url);
  linkShow.setAttribute("id", show.id);

  titleShowCard.after(linkShow);

  cardAreaShow.append(showCard);
}

function generateAllShows(currentShows) {
  cardArea.innerHTML = "";
  cardAreaShow.innerHTML = "";

  currentShows.map((show) => generateOneShow(show));
  updateCurrentShowCount(currentShows);
  resetSelectedShow();
  searchInputShow.style.display = "block";
  searchInputEpisodes.style.display = "none";
}

function checkAndRemoveAllEpisodesButton() {
  if (document.querySelector("#allEpisodesButton")) {
    document.querySelector("#allEpisodesButton").parentNode.removeChild(document.querySelector("#allEpisodesButton"));
  }
}

function checkAndRemoveAllShowsButton() {
  if (document.querySelector("#allShowsButton")) {
    document.querySelector("#allShowsButton").parentNode.removeChild(document.querySelector("#allShowsButton"));
  }
}
