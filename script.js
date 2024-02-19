async function getFetch() {
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      loadPage(data);
    })
    .catch((err) => console.log(err));
}
getFetch();

function loadPage(data) {
  let myEpisodes = data;
  const cardArea = document.getElementById("cardArea");
  const filterArea = document.getElementById("filterArea");
  const searchInput = document.querySelector("#q");
  let currentEpisodes = [...myEpisodes];
  console.log("2");
  const countInfo = document.getElementById("countInfo");
  const select = document.querySelector("#episodeSelector");
  const allEpisodesButton = document.createElement("button");

  //You can edit ALL of the code here
  function setup() {
    createTemplate();
    createEpisodeSelector(currentEpisodes);
    generateAllCards(currentEpisodes);
  }

  /* function makePageForEpisodes(episodeList) {
    const rootElem = document.getElementById("root");
    rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  } */

  setup();

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

  function generateEpisodeCode(episode) {
    return `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
  }

  function generateOneCard(episode) {
    const episodeCode = generateEpisodeCode(episode);

    const card = document.querySelector("template").content.cloneNode(true);

    const titleCard = card.querySelector(".titleEpisode");
    titleCard.innerText = `${episode.name}\n - ${episodeCode}`;

    const imgCard = card.querySelector(".imgEpisode");
    imgCard.setAttribute("src", episode.image.medium);

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

  function updateDisplayCount(allEpisodes) {
    countInfo.innerText = `Displaying ${allEpisodes.length}/${myEpisodes.length} episodes`;
  }

  function generateAllCards(allEpisodes) {
    cardArea.innerHTML = "";
    createTemplate();
    allEpisodes.map((episode) => generateOneCard(episode));
    updateDisplayCount(allEpisodes);
  }

  function modifyAllEpisodesButton() {
    if (document.querySelector("#allEpisodesButton")) {
      document.querySelector("#allEpisodesButton").parentNode.removeChild(document.querySelector("#allEpisodesButton"));
    }
    if (select.value != "default" || searchInput.value) {
      allEpisodesButton.id = "allEpisodesButton";
      allEpisodesButton.innerText = "← All episodes";
      document.querySelector("header").append(allEpisodesButton);
    }
  }

  function backToAllEpisodes() {
    select.value = "default";
    searchInput.value = "";
    document.querySelector("#allEpisodesButton").parentNode.removeChild(document.querySelector("#allEpisodesButton"));
    currentEpisodes = [...myEpisodes];
    generateAllCards(currentEpisodes);
  }

  // link to episode page eventListener
  cardArea.addEventListener("click", (event) => {
    const target = event.target.closest(".cardEpisode");

    if (target) {
      const link = target.querySelector("a");
      window.open(link.getAttribute("href"), "_blank");
    }
  });

  // search eventListener
  searchInput.addEventListener("input", () => {
    select.value = "default";
    const searchTerm = searchInput.value.trim().toLowerCase();
    currentEpisodes = myEpisodes.filter(
      (episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm)
    );
    if (searchInput.value) {
      select.value = "select";
    }
    generateAllCards(currentEpisodes);
    modifyAllEpisodesButton();
  });

  // dropdown menu eventListener
  select.addEventListener("change", () => {
    searchInput.value = "";
    if (select.value === "default") {
      currentEpisodes = [...myEpisodes];
    } else {
      currentEpisodes = myEpisodes.filter((episode) => episode.id === parseInt(select.value));
    }
    generateAllCards(currentEpisodes);
    modifyAllEpisodesButton();
  });

  // all episodes button eventListener
  allEpisodesButton.addEventListener("click", backToAllEpisodes);
}
