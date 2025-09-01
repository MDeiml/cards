function suitFromUnicode(suitUnicode) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><text x="15" y="270" font-family="Serif" font-size="300">&#' + suitUnicode + ';</text></svg>';
  const blob = new Blob([svg], {type: 'image/svg+xml'});
  return URL.createObjectURL(blob);
}

let spades = 0x2660;

const cardSvgTemplate = document.getElementById("card-svg-template");
function svgFromSuitAndValue(suitUrl, value) {
  const svg = cardSvgTemplate.content.firstElementChild.cloneNode(true);
  for (const text of svg.querySelectorAll("text")) {
    text.textContent = value;
  }
  for (const image of svg.querySelectorAll("image")) {
    image.setAttribute("href", suitUrl);
  }
  return svg;
}

const cardTemplate = document.getElementById("card-template");
function cardFromSvg(svg) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const image = card.firstElementChild;

  const blob = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  console.log(image);
  image.src = url;

  return card;
}

document.getElementById("board").appendChild(cardFromSvg(svgFromSuitAndValue(suitFromUnicode(spades), "A")));

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

var dragCard = null;
var dragStartMouseX, dragStartMouseY, dragStartCardX, dragStartCardY;

addEventListener("pointerdown", (event) => {
  dragCard = event.target.closest(".card");
  if (dragCard === null) {
    return;
  }
  dragStartMouseX = event.clientX;
  dragStartMouseY = event.clientY;
  dragStartCardX = +dragCard.style.getPropertyValue("--pos-x") || 0;
  dragStartCardY = +dragCard.style.getPropertyValue("--pos-y") || 0;
  event.preventDefault();
});

addEventListener("pointerup", (event) => {
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

  var hoverOver = null;
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
