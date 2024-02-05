//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  //makePageForEpisodes(allEpisodes);
  createTemplate();
  //generateOneCard();
  generateAllCards(getAllEpisodes());
}

/* function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
} */

window.onload = setup;

function createTemplate() {
  const cardTemplate = document.createElement("template");
  cardTemplate.setAttribute("class", "cardTemplate");

  const cardEpisode = document.createElement("section");
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

/* function generateOneCard() {
  const oneEpisode = getOneEpisode();
  const episodeCode = `S${oneEpisode.season.toString().padStart(2, "0")}E${oneEpisode.number.toString().padStart(2, "0")}`;

  const card = document.querySelector("template").content.cloneNode(true);

  const titleCard = card.querySelector(".titleEpisode");
  titleCard.innerText = `${oneEpisode.name} - ${episodeCode}`;

  const imgCard = card.querySelector(".imgEpisode");
  imgCard.setAttribute("src", oneEpisode.image.medium);

  const summaryCard = card.querySelector(".summaryEpisode");
  summaryCard.innerHTML = oneEpisode.summary;

  document.body.prepend(card);
} */

function generateAllCards(allEpisodes) {
  const cardArea = document.createElement("section");
  cardArea.setAttribute("id", "cardArea");
  document.body.append(cardArea);
  for (const episode of allEpisodes) {
    //console.log(episode);
    const episodeCode = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

    const card = document.querySelector("template").content.cloneNode(true);

    const titleCard = card.querySelector(".titleEpisode");
    titleCard.innerText = `${episode.name} - ${episodeCode}`;

    const imgCard = card.querySelector(".imgEpisode");
    imgCard.setAttribute("src", episode.image.medium);

    const summaryCard = card.querySelector(".summaryEpisode");
    summaryCard.innerHTML = episode.summary;

    cardArea.append(card);
  }
}
