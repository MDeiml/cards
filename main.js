function suitFromUnicode(suitUnicode, color) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><text x="15" y="270" font-family="Serif" font-size="300" fill="' + color + '">&#' + suitUnicode + ';</text></svg>';
  const blob = new Blob([svg], {type: 'image/svg+xml'});
  return URL.createObjectURL(blob);
}

const cardSvgTemplate = document.getElementById("card-svg-template");
function svgFromSuitAndValue(suitUrl, value, color) {
  console.log(suitUrl);
  const svg = cardSvgTemplate.content.firstElementChild.cloneNode(true);
  for (const text of svg.querySelectorAll("text")) {
    text.textContent = value;
    text.setAttribute("fill", color);
  }
  for (const image of svg.querySelectorAll("image")) {
    image.setAttribute("href", suitUrl);
  }

  const blob = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
  console.log(svg);
  return URL.createObjectURL(blob);
}

const cardTemplate = document.getElementById("card-template");
function cardFromSvg(svg) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const image = card.firstElementChild;

  image.src = svg;

  return card;
}

function bavarianCards() {
  const suits = {
    "E": '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="-47 -20 160 160"><path style="fill:Yellow;stroke:black;" d="M13 21 Q13 1 33 1 L33 52 L13 52 Z" /><path style="fill:Red;stroke:black;" d="M33 1 Q53 1 53 21 L53 52 L33 52 Z" /><path style="fill:#0000DF;stroke:black;" d="M13 52 L33 52 L33 62 L13 62 Z" /><path style="fill:#007F00;stroke:black;" d="M37 96 Q37 119 16 119 L24 110 Q25 109 27 108 Q29 107 29 102 L29 96" /><path style="fill:none;stroke:black;" d="M27 108 Q31.2 108 31.2 110.5 Q31.2 114 29 115.57" /><path style="fill:none;stroke:black;" d="M35 96 Q35 107 31 111" /><path style="fill:none;stroke:black;" d="M33 96 Q33 102 31.5 106" /><path style="fill:none;stroke:black;" d="M20 117 L26 111 Q28 109 29 111 Q29.5 112 28 113" /><path style="fill:#000000;stroke:black;" d="M33 52 L33 62 L53 62 L53 52 Z" /><path style="fill:#007F00;stroke:black;" d="M13 62 Q1 62 1 74 Q1 96 33 96 Q64 96 64 74 Q64 62 54 62 Z" /><path style="fill:#000000;stroke:black;" d="M33 66.5 Q28.5 66.5 28.5 71 Q28.5 77 33 87 Q37.5 77 37.5 71 Q37.5 66.5 33 66.5" /><path style="fill:#000000;stroke:black;" d="M21 89 Q10 80 10 74 Q10 67 15 67 Q17 67 17 71 Q17 72 16.5 73 Q16 74 16 75 Q16 80 21 89" /><path style="fill:#000000;stroke:black;" d="M45 89 Q56 80 56 74 Q56 67 51 67 Q49 67 49 71 Q49 72 49.5 73 Q50 74 50 75 Q50 80 45 89" />  <path style="stroke:black;" d="M33 62 L33 96" /><path style="stroke:black;" d="M35.86 1 L35.86 96" /><path style="stroke:black;" d="M38.7 1.8 L38.7 96" /><path style="stroke:black;" d="M41.6 2.7 L41.6 95" /><path style="stroke:black;" d="M44.4 3 L44.4 95" /><path style="stroke:black;" d="M47.3 5.4 L47.3 94.6" /><path style="stroke:black;" d="M50.1 8.8 L50.1 93.7" /><path style="stroke:black;" d="M53 62 L53 92.6" /><path style="stroke:black;" d="M55.8 62.3 L55.8 91" /><path style="stroke:black;" d="M58.7 63 L58.7 88.6" /><path style="stroke:black;" d="M61.6 65 L61.6 84.7" /></svg>',
    "L": '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="-13 -10 93 93"><path style="fill:#007F00;stroke:black;" d="M35 54 Q34 64 28 68 Q25 69 24 72 Q22 69 25 66 Q33 60 30 54" /><path style="fill:none;stroke:black;" d="M33.5 54 Q32.5 64 27.5 66.5" /><path style="fill:none;stroke:black;" d="M25 66 C26 65 28 65 28 68" /><path style="fill:none;stroke:black;" d="M25 70.4 C24.7 67 27 67 26 68" /><path style="fill:#007F00;stroke:black;" d="M33 1 Q24 14 12 24 Q1 33.5 1 47 Q1 63 18 63 Q26 63 33 56 Q40 63 48 63 Q65 63 65 47 Q65 33.5 54 24 Q42 14 33 1" /><path style="stroke:black;" d="M33 1 L33 56 M35 4 L35 57.8 M37 6.7 L37 59.3 M39 9 L39 60.8 M41 11.3 L41 61.5 M43 13.7 L43 62 M45 16 L45 62.5 M47 18 L47 63 M49 19.7 L49 63 M51 21.5 L51 63 M53 23.5 L53 62.7 M55 25.2 L55 62.2 M57 27 L57 61.5 M59 29.3 L59 60.3 M61 32.3 L61 58.8 M63 37 L63 55.5" /><path style="fill:none;stroke:black;" d="M28 18 Q38 25 46 21 M38 18 Q28 25 20 21 M27 22.5 Q23 22.5 19 25 M39 22.5 Q43 22.5 47 25" /><path transform="translate(-23,12) scale(1.7,1)" style="fill:none;stroke:black;" d="M28 18 Q38 25 46 21 M38 18 Q28 25 20 21 M27 22.5 Q23 22.5 19 25 M39 22.5 Q43 22.5 47 25" /><path transform="translate(-33,24) scale(2,1)" style="fill:none;stroke:black;" d="M28 18 Q38 25 46 21 M38 18 Q28 25 20 21 M27 22.5 Q23 22.5 19 25 M39 22.5 Q43 22.5 47 25" /></svg>',
    "H": '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -11 86 86"><path style="fill:#DF0000;stroke:Black;" d="M33 64 Q24 50 12 40 Q1 30.5 1 17 Q1 1 18 1 Q26 1 33 8 Q40 1 48 1 Q65 1 65 17 Q65 30.5 54 40 Q42 50 33 64" /><path style="stroke:black;" d="M33 8 L33 64 M35 6.2 L35 61 M37 4.7 L37 58 M39 3.7 L39 55.7 M41 2.8 L41 53.3 M43 2 L43 51 M45 1.5 L45 48.6 M47 1 L47 46.4 M49 1 L49 44.3 M51 1 L51 42.4 M53 1.3 L53 40.5 M55 1.7 L55 38.8 M57 2.5 L57 37 M59 3.7 L59 34.7 M61 5.2 L61 32.3 M63 8 L63 28" /></svg>',
    "S": '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="-13 -10 92 92"><circle style="stroke:black;fill:#007F00;" cx="33" cy="65" r="5" /><path style="stroke:black;" d="M33 65 L33 70" /><path style="stroke:black;" d="M35 65 L35 69" /><path style="stroke:black;" d="M37 65 L37 68" /><circle style="stroke:none;fill:yellow;" cx="33" cy="33" r="32" /><path style="fill:red;stroke:none;" d="M2.5 23 L63.5 23 Q67 33 63.5 43 L2.5 43 Q-1 33 2.5 23" /><path style="fill:none;stroke:black;" d="M63 23 L63 43" /><path style="stroke:black;" d="M6 43 L6 50" /><path style="stroke:black;" d="M9 43 L9 54" /><path style="stroke:black;" d="M12 43 L12 54" /><path style="stroke:black;" d="M15 43 L15 54" /><path style="stroke:black;" d="M18 43 L18 54" /><path style="stroke:black;" d="M21 43 L21 54" /><path style="stroke:black;" d="M24 43 L24 54" /><path style="stroke:black;" d="M27 43 L27 54" /><path style="stroke:black;" d="M30 43 L30 54" /><path style="stroke:black;" d="M33 23 L33 54" /><path style="stroke:black;" d="M36 23 L36 54" /><path style="stroke:black;" d="M39 23 L39 54" /><path style="stroke:black;" d="M42 23 L42 54" /><path style="stroke:black;" d="M45 23 L45 54" /><path style="stroke:black;" d="M48 23 L48 54" /><path style="stroke:black;" d="M51 23 L51 54" /><path style="stroke:black;" d="M54 23 L54 54" /><path style="stroke:black;" d="M57 23 L57 54" /><path style="stroke:black;" d="M60 23 L60 50" /><path style="stroke:black;fill:#007F00;" d="M27 48 Q25.5 45.5 19 43 Q15 45 15 50 L29 65" /><path style="stroke:black;fill:#007F00;" d="M39 48 Q40.5 45.5 47 43 Q51 45 51 50 L37 65" /><path style="stroke:black;fill:#007F00;" d="M29 65 Q20 50 33 43 Q46 50 37 65" /><path style="stroke:none;fill:#007F00;" d="M3.1 43 L2.8 43 Q6.5 60 29.4 65" /><path style="stroke:black;fill:#007F00;" d="M29 65 Q21 52 15 50 Q8 47 2.8 43" /><path style="stroke:none;fill:#007F00;" d="M62.9 43 L63.2 43 Q59.5 60 36.6 65" /><path style="stroke:black;fill:#007F00;" d="M37 65 Q45 52 51 50 Q58 47 63.2 43" /><path style="stroke:black;" d="M33 43 L33 65" />  <circle style="stroke:black;fill:none;" cx="33" cy="33" r="32" /><path style="stroke:black;" d="M33 1 L33 6.2" /><path style="stroke:black;" d=" M35 1.2 L35 6" /><path style="stroke:black;" d="M31 1.2 L31 6" /><path style="stroke:black;" d="M37 1.2 L37 5" /><path style="stroke:black;" d="M29 1.2 L29 5" /><path style="fill:none;stroke:black;" d="M28 1.2 Q28 6.5 33 6.5 Q38 6.5 38 1.2" /><path style="stroke:black;" d="M2.8 23 L63.2 23" /><path style="stroke:black;" d="M2.8 43 L63.2 43" /><path style="stroke:black;" d="M33 3 L44.5 3" /><path style="stroke:black;" d="M33 6 L50 6" /><path style="stroke:black;" d="M33 9 L54 9" /><path style="stroke:black;" d="M33 12 L57 12" /><path style="stroke:black;" d="M33 15 L59.5 15" /><path style="stroke:black;" d="M33 18 L61 18" /><path style="stroke:black;" d="M33 21 L63 21" /><circle style="stroke:black;fill:none;" cx="10" cy="33" r="5" /><path style="stroke:black;" d="M5 33 L15 33" /><path style="stroke:black;" d="M5.2 31 L14.8 31" /><path style="stroke:black;" d="M5.2 35 L14.8 35" /><path style="stroke:black;" d="M6.8 29 L13.2 29" /><path style="stroke:black;" d="M6.8 37 L13.2 37" />  <circle style="stroke:black;fill:none;" cx="33" cy="33" r="5" /><path style="stroke:black;" d="M28 33 L38 33" /><path style="stroke:black;" d="M28.2 31 L37.8 31" /><path style="stroke:black;" d="M28.2 35 L37.8 35" /><path style="stroke:black;" d="M29.8 29 L36.2 29" /><path style="stroke:black;" d="M29.8 37 L36.2 37" />  <circle style="stroke:black;fill:none;" cx="56" cy="33" r="5" /><path style="stroke:black;" d="M51 33 L61 33" /><path style="stroke:black;" d="M51.2 31 L60.8 31" /><path style="stroke:black;" d="M51.2 35 L60.8 35" /><path style="stroke:black;" d="M52.8 29 L59.2 29" /><path style="stroke:black;" d="M52.8 37 L59.2 37" />  <path style="stroke:black;" d="M33 63 L44.5 63" /><path style="stroke:black;" d="M33 60 L50 60" /><path style="stroke:black;" d="M33 57 L54 57" /><path style="stroke:black;" d="M33 54 L57 54" /><path style="stroke:black;" d="M33 51 L59.5 51" /><path style="stroke:black;" d="M33 48 L61 48" /><path style="stroke:black;" d="M33 45 L63 45" /></svg>',
  };
  for (let s in suits) {
    suits[s] = [URL.createObjectURL(new Blob([suits[s]], {type: 'image/svg+xml'})), "#000"];
  }
  const values = "AKOU".split("").concat(["10"]).concat("9876".split(""));
  return {
    "suits": suits,
    "values": values
  };
}

function frenchCards() {
  const spades = 0x2660;
  const hearts = 0x2665;
  const diamonds = 0x2666;
  const clubs = 0x2663;
  let suits = {
    "S": [spades, "#000"],
    "H": [hearts, "#f00"],
    "D": [diamonds, "#f00"],
    "C": [clubs, "#000"]
  };
  for (let s in suits) {
    suits[s][0] = suitFromUnicode(suits[s][0], suits[s][1]);
  }
  const values = "AKQJ".split("").concat(["10"]).concat("98765432".split(""));
  return {
    "suits": suits,
    "values": values
  };
}

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

const sets = {
  "french": frenchCards,
  "bavarian": bavarianCards,
};
const params = new URLSearchParams(document.location.search);
const setName = params.get("set");
let set;

if (setName in sets) {
  set = sets[setName]();
} else {
  set = frenchCards();
}

let values = params.get("values");
if (values === null) {
  values = set.values;
} else {
  values = values.split(",");
}
let cardNames = Object.keys(set.suits).flatMap(s => values.map(v => s + v));
let cards = cardNames.map(c => {
  const suitName = c[0];
  const suit = set.suits[suitName];
  const value = c.substring(1);
  return cardFromSvg(svgFromSuitAndValue(suit[0], value, suit[1]));
});

shuffle(cards);


for (const card of cards) {
  card.classList.add("flipped");
  board.appendChild(card);
}

addEventListener("deviceorientation", (event) => {
  const rotY = event.gamma / 180 * Math.PI
  const rotX = event.beta / 180 * Math.PI
  const upX = -Math.sin(rotY) * Math.cos(rotX);
  const upY = Math.sin(rotX);
  const upZ = Math.cos(rotX) * Math.cos(rotY);

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
});

const CLICK_MAX_TIME = 0.1 * 1000;
addEventListener("pointerup", (event) => {
  if (dragCard === null) {
    return;
  }
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
});

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
  const cardWidth = dragCard.firstElementChild.width;
  const cardHeight = dragCard.firstElementChild.width;
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

});
