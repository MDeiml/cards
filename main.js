const cardTemplate = document.getElementById("card-template");
function cardFromSuitAndValue(suitId, value, color) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  for (const text of card.querySelectorAll("text")) {
    text.textContent = value;
    text.setAttribute("fill", document.getElementById(suitId).getAttribute("fill"));
  }
  for (const image of card.querySelectorAll("use")) {
    image.setAttribute("href", "#" + suitId);
  }

  return card;
}

const SETS = {
  "german": {
    "suits": ["E", "L", "H", "S"],
    "values": ["6","7","8","9","10","U","O","K","A"]
  },
  "french": {
    "suits": ["S", "H", "D", "C"],
    "values": ["2", "3", "4", "5", "6","7","8","9","10","J","Q","K","A"]
  },
};

// from stackoverflow
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const params = new URLSearchParams(document.location.search);
let setName = params.get("set");

if (!(setName in SETS)) {
  setName = null;
}
setName = setName || "french";
const set = SETS[setName];

let values = params.get("values");
if (values === null) {
  values = set.values;
} else {
  values = values.split(",");
}
let cardNames = Object.keys(set.suits).flatMap(s => values.map(v => s + v));
let cards = cardNames.map(c => {
  const suitName = c[0];
  const suit = setName + "_" + set.suits[suitName];
  const value = c.substring(1);
  return cardFromSuitAndValue(suit, value, suit[1]);
});

shuffle(cards);


for (const card of cards) {
  card.classList.add("flipped");
  board.appendChild(card);
}

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
  // document.getElementById("output").textContent = upX + "," + upY;
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

const CLICK_MAX_TIME = 0.1 * 1000;
addEventListener("pointerup", (event) => {
  if (dragCard === null) {
    return;
  }
  event.preventDefault();
  const onBoard = dragCard.parentElement.id == "board";
  if (!onBoard) {
    dragCard.classList.remove("flipped");
  } else {
    const time = new Date();
    if (time - dragStartTime < CLICK_MAX_TIME) {
      dragCard.classList.toggle("flipped");
    }
  }
  dragCard = null;
}, { passive: false });

addEventListener("pointermove", (event) => {
  if (event.buttons == 0) {
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
  const cardHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--card-height"));
  const box = dragCard.firstElementChild.viewBox.baseVal;
  const cardWidth = cardHeight * box.width / box.height;
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
