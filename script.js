const cardArea = document.createElement("section");
cardArea.setAttribute("id", "cardArea");
document.body.append(cardArea);

//You can edit ALL of the code here
function setup() {
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

function generateOneCard(episode) {
  const episodeCode = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

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

function generateAllCards(allEpisodes) {
  createTemplate();
  allEpisodes.map((episode) => generateOneCard(episode));
}

cardArea.addEventListener("click", (event) => {
  const target = event.target.closest(".cardEpisode");

  if (target) {
    const link = target.querySelector("a");
    window.open(link.getAttribute("href"), "_blank");
  }
});
