const cardTemplate = document.getElementById("card-template");
const setTemplate = document.getElementById("set-template");
const game = document.getElementById("game");
const settings = document.getElementById("settings");

const SETS = {
  "french": {
    "suits": ["S", "H", "D", "C"],
    "values": ["2", "3", "4", "5", "6","7","8","9","10","J","Q","K","A"],
    "mainCard": "SA"
  },
  "german": {
    "suits": ["E", "L", "H", "S"],
    "values": ["6","7","8","9","10","U","O","K","A"],
    "mainCard": "EO"
  }
};

function cardFromName(setName, c, template) {
  const set = SETS[setName];
  const suitName = c[0];
  const suitId = setName + "_" + suitName;
  const value = c.substring(1);
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelectorAll("text").forEach(text => {
    text.textContent = value;
    text.setAttribute("fill", document.getElementById(suitId).getAttribute("fill"));
  });
  card.querySelectorAll("use").forEach(image => {
    image.setAttribute("href", "#" + suitId);
  });

  return card;
}

// from stackoverflow
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function cardDimension(card) {
  const cardHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--card-height"));
  const box = card.firstElementChild.viewBox.baseVal;
  const cardWidth = cardHeight * box.width / box.height;
  return [cardWidth, cardHeight];
}

function placeRow(cards, x, y) {
  for (const card of cards) {
    card.style.setProperty("--pos-x", x);
    card.style.setProperty("--pos-y", y);
    x += cardDimension(card)[0];
  }
}

let activeSet = "french";

function initBoard() {
  for (const card of game.querySelectorAll(".card")) {
    card.remove();
  }
  const params = new URLSearchParams(document.location.search);
  let activeSetP = params.get("set");

  if (!(activeSetP in SETS)) {
    activeSetP = null;
  }
  activeSet = activeSetP || activeSet;
  const set = SETS[activeSet];

  let values = params.get("values");
  if (values === null) {
    values = set.values;
  } else {
    values = values.split(",");
  }
  let cardNames = set.suits.flatMap(s => values.map(v => s + v));
  let cards = cardNames.map(c => cardFromName(activeSet, c, cardTemplate));

  shuffle(cards);

  for (const card of cards) {
    board.appendChild(card);
  }
}

initBoard();

let cards = [];

for (const setName of Object.keys(SETS)) {
  card = cardFromName(setName, SETS[setName].mainCard, setTemplate);
  if (setName == activeSet) {
    card.classList.remove("flipped");
  }
  card.dataset["set"] = setName;
  settings.appendChild(card);
  cards.push(card);
}
requestAnimationFrame(() => placeRow(cards, 0, 0));

addEventListener("deviceorientation", (event) => {
  const rotY = event.gamma / 180 * Math.PI
  const rotX = event.beta / 180 * Math.PI
  let upX = -Math.sin(rotY) * Math.cos(rotX);
  let upY = Math.sin(rotX);
  let upZ = Math.cos(rotX) * Math.cos(rotY);
  if (upZ < 0) {
    upZ = 0;
    const length = Math.sqrt(upX * upX + upY * upY);
    upX /= length;
    upY /= length;
  }

  angleX = Math.asin(upY * Math.pow(Math.abs(upY), 3)) * Math.exp(-(Math.abs(upX) * 4));
  angleY = Math.asin(upX * Math.pow(Math.abs(upX), 3)) * Math.exp(-(Math.abs(upY) * 8));
  document.documentElement.style.setProperty("--orientation-x", angleX + "rad");
  document.documentElement.style.setProperty("--orientation-y", angleY + "rad");
});

let dragCard = null;
let dragStartMouseX, dragStartMouseY, dragStartCardX, dragStartCardY;
let dragStartTime;

addEventListener("pointerdown", (event) => {
  dragCard = event.target.closest(".card");
  if (dragCard === null) {
    return;
  }
  dragStartTime = new Date();
  dragStartMouseX = event.clientX;
  dragStartMouseY = event.clientY;
  dragStartCardX = +dragCard.style.getPropertyValue("--pos-x") || 0;
  dragStartCardY = +dragCard.style.getPropertyValue("--pos-y") || 0;
  event.preventDefault();
}, { passive: false });

const CLICK_MAX_TIME = 0.2 * 1000;
addEventListener("pointerup", (event) => {
  if (dragCard === null) {
    return;
  }
  event.preventDefault();
  const onBoard = dragCard.parentElement.id == "board";
  const onSettings = dragCard.parentElement.id == "settings";
  if (!onBoard && !onSettings) {
    dragCard.classList.remove("flipped");
  } else {
    const time = new Date();
    if (time - dragStartTime < CLICK_MAX_TIME) {
      if (onSettings) {
        if (dragCard.classList.contains("flipped")) {
          for (const card of settings.querySelectorAll(".card")) {
            card.classList.add("flipped");
          }
          dragCard.classList.remove("flipped");
          const params = new URLSearchParams(document.location.search);
          params.set("set", dragCard.dataset["set"]);
          history.replaceState(null, "", "?"+params);
          initBoard();
        }
      } else {
        dragCard.classList.toggle("flipped");
      }
    }
  }
  dragCard = null;
}, { passive: false });

addEventListener("pointermove", (event) => {
  if (event.buttons != 1) {
    dragCard = null;
  }
  if (dragCard === null) {
    return;
  }
  event.preventDefault();
  x = event.clientX - dragStartMouseX + dragStartCardX;
  y = event.clientY - dragStartMouseY + dragStartCardY;
  parentX = dragCard.parentElement.getBoundingClientRect().x;
  parentY = dragCard.parentElement.getBoundingClientRect().y;

  let hoverOver = null;
  const [cardWidth, cardHeight] = cardDimension(dragCard);
  for (const element of document.elementsFromPoint(x + parentX + cardWidth/2, y + parentY + cardHeight/2)) {
    if (element.classList.contains("container")) {
      hoverOver = element;
      break;
    }
  }

  if (hoverOver !== null && (hoverOver !== dragCard.parentElement || dragCard.nextSibling !== null)) {

    parentDiffX = hoverOver.getBoundingClientRect().x - parentX;
    parentDiffY = hoverOver.getBoundingClientRect().y - parentY;
    let transform = getComputedStyle(dragCard).transform;
    hoverOver.appendChild(dragCard);
    x -= parentDiffX;
    y -= parentDiffY;
    dragStartCardX -= parentDiffX;
    dragStartCardY -= parentDiffY;
    dragCard.style.transform = transform;
    setTimeout(() => {
      dragCard.style.transform = "";
    }, 1)
  }

  const SNAP_FULL = 10; // TODO
  const SNAP_HALF = 2 * SNAP_FULL;

  if (dragCard.parentElement.id == "board") {
    for (const card of dragCard.parentElement.querySelectorAll(".card")) {
      if (card === dragCard) {
        continue;
      }
      cardX = +card.style.getPropertyValue("--pos-x") || 0
      cardY = +card.style.getPropertyValue("--pos-y") || 0
      dx = Math.abs(cardX - x)
      dy = Math.abs(cardY - y)
      if (dx < SNAP_FULL && dy < SNAP_FULL) {
        x = cardX;
        y = cardY;
        break;
      } else if (dx < SNAP_FULL && dy < SNAP_HALF) {
        x = cardX;
      } else if (dx < SNAP_HALF && dy < SNAP_FULL) {
        y = cardY;
      }
    }
  }

  dragCard.style.setProperty("--pos-x", x);
  dragCard.style.setProperty("--pos-y", y);

}, { passive: false });

let distanceStart = null;
let cardHeightStart;

function zoomListener(event) {
  if (event.touches.length != 2) {
    touches = null;
    return;
  }
  event.preventDefault();
  const dx = event.touches[0].clientX - event.touches[1].clientX;
  const dy = event.touches[0].clientY - event.touches[1].clientY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance == 0) {
    return;
  }
  if (touches === null) {
    distanceStart = distance;
    cardHeightStart = +getComputedStyle(document.documentElement).getPropertyValue("--card-height");
  }
  const ratio = distance / distanceStart;
  document.documentElement.style.setProperty("--card-height", ratio * cardHeightStart);
}
addEventListener("touchstart", zoomListener, { passive: false });
addEventListener("touchend", zoomListener, { passive: false });
addEventListener("touchmove", zoomListener, { passive: false });
