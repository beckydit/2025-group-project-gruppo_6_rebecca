// sketch.js
// VERSIONE FINALE - TOTAL TEXTURE LOOK + EFFETTO ACQUERELLO PIÙ SATURO
// - Navbar & Sfondo: 'immagini/cartagiusta.jpg' (gestito esternamente o in draw).
// - Popup & Legenda: 'immagini/carta2.jpg' come sfondo con bordi arrotondati.
// - Grafico: Spicchi Resi Cliccabili (Simulazione Navigazione).
// - INTERAZIONE AGGIORNATA: Tutti i popup con layout alternato (1/3 immagine, 2/3 testo).

let table;
let areas = [];
const kingdoms = ["animalia", "plantae", "fungi", "chromista"];

// --- DATI POPUP AGGIORNATI CON DIVISIONE IN DUE PARTI ---
const popupData = {
  animalia: {
    title: "Regno Animalia",
    description_part1: "Il regno Animalia comprende milioni di specie, dalle forme più semplici come spugne e meduse fino agli organismi altamente complessi come uccelli e mammiferi. Questa diversità sostiene gli equilibri ecologici di ogni ambiente del pianeta: gli animali impollinano, regolano popolazioni, mantengono suoli sani e trasportano nutrienti.",
    description_part2: "Si stima che 45.242 di 147.240 specie risultano attualmente minacciate. Quando una specie animale si estingue, l’effetto non è isolato: intere reti ecologiche possono indebolirsi o collassare. La perdita di biodiversità nel regno animale è oggi una delle emergenze più serie per la stabilità degli ecosistemi globali."
  },
  plantae: {
    title: "Regno Plantae",
    description_part1: "Il regno delle piante comprende tutto, dai minuscoli muschi alle gigantesche sequoie. Le piante producono ossigeno, stabilizzano gli ecosistemi terrestri e costituiscono la base della maggior parte delle catene alimentari. Molte specie vegetali sono fondamentali anche per impollinatori, animali e perfino per la regolazione delle risorse idriche.",
    description_part2: "Su 24.064 specie di piante valutate, ben 29.623 sono classificate come minacciate, evidenziando una pressione ecologica notevole, specialmente sulla classe Magnoliopsida. Quando una pianta scompare, spesso scompaiono con lei funghi, insetti e animali che da essa dipendono. La perdita di specie vegetali rappresenta una minaccia diretta alla resilienza del pianeta."
  },
  fungi: {
    title: "Regno Fungi",
    description_part1: "I funghi formano un regno estremamente vasto, con oltre due milioni di specie stimate, molte delle quali non ancora descritte. Sono indispensabili per la decomposizione, la fertilità dei suoli e la simbiosi con la maggior parte delle piante attraverso le reti micorriziche. Alcuni funghi regolano persino cicli biogeochimici planetari.",
    description_part2: "Su 1.298 specie fungine valutate, 399 sono state classificate come minacciate. L’estinzione di specie fungine è particolarmente allarmante perché spesso passa inosservata, ma può compromettere la rigenerazione degli habitat e il funzionamento di interi ecosistemi. Proteggerli significa proteggere i sistemi naturali alla loro base."
  },
  chromista: {
    title: "Regno Chromista",
    description_part1: "Il regno Chromista include organismi molto diversi tra loro: dalle diatomee microscopiche che producono una grande percentuale dell’ossigeno globale, alle alghe brune giganti che formano vere foreste marine. Questi organismi non solo sostengono le catene alimentari oceaniche, ma regolano l’assorbimento di carbonio, influenzando direttamente il clima.",
    description_part2: "Sebbene le specie valutate siano 18, 6 di queste, principalmente alghe brune, risultano già minacciate. La perdita di specie all’interno dei chromisti ha ripercussioni profonde sulla salute dei mari e sulla capacità del pianeta di mantenere gli equilibri climatici."
  }
};

const palette = {
  fungi:    "#A59382",
  plantae:  "#A6C3A0",
  animalia: "#B96A82",
  chromista:"#95A6B7"
};

const bgColor   = "#F2F0E5";
const textColor = "#333333";
const neutralColor = "#E0E0E0"; 

let outerRadius, wedgeAngles = [];
let maxTotal = 0;
let cartaSfondo; 
let cartaPopup;  

// --- VARIABILI IMMAGINI (PNG) ---
let imgAnimali1, imgAnimali2; 
let imgPiante1, imgPiante2;
let imgFunghi1, imgFunghi2;
let imgChromisti1, imgChromisti2;

const INNER_FIXED_RADIUS = 40; 
const MIN_SEGMENT_THICKNESS = 8; 

const REFERENCE_1 = 1000;
const REFERENCE_2 = 5000; 
const REFERENCE_3 = 10000;
const REFERENCE_VALUES = [REFERENCE_1, REFERENCE_2, REFERENCE_3];

let wheelCenterX;

// STATO INTERAZIONE
let hoveredAreaIndex = -1; 
let clickedAreaIndex = -1; // NUOVO STATO: Indice dell'area cliccata
let isPopupOpen = false;
let infoIconBounds = []; 
let currentPopupContent = null;

// DIMENSIONI POPUP
const POPUP_WIDTH = 600;  
const POPUP_HEIGHT = 300; 
const MIN_POPUP_HEIGHT = 60; 
const IMAGE_WIDTH_MAX = 200; 

// ANIMAZIONI
let animProgress = 0.0; 
const ANIM_SPEED = 0.03;
let wheelProgress = 0.0; 
const WHEEL_SPEED = 0.015;

let finalGapAngle;
let finalWedgeAngle; 

// --- PARAMETRI ACQUERELLO AGGIORNATI PER MAGGIORE SATURAZIONE ---
let noiseOffset = 0; 
const WATERCOLOR_LAYERS = 3; 
const WATERCOLOR_ALPHA = 70; 
const WATERCOLOR_BLEED = 2; 


function preload() {
  // --- CARICAMENTO SFONDI CON NUOVO PERCORSO "immagini/" ---
  try { cartaSfondo = loadImage('immagini/cartagiusta.jpg'); } catch(e) {}
  try { cartaPopup = loadImage('immagini/carta2.jpg'); } catch(e) {} 
  
  // --- CARICAMENTO IMMAGINI POPUP CON NUOVO PERCORSO "immagini/" ---
  // Animalia
  try { imgAnimali1 = loadImage('immagini/infoanimali1.png'); } catch(e) { console.error("Errore nel caricamento di immagini/infoanimali1.png"); }
  try { imgAnimali2 = loadImage('immagini/infoanimali2.png'); } catch(e) { console.error("Errore nel caricamento di immagini/infoanimali2.png"); }
  // Plantae
  try { imgPiante1 = loadImage('immagini/infopiante1.png'); } catch(e) { console.error("Errore nel caricamento di immagini/infopiante1.png"); }
  try { imgPiante2 = loadImage('immagini/infopiante2.png'); } catch(e) { console.error("Errore nel caricamento di immagini/infopiante2.png"); }
  // Fungi
  try { imgFunghi1 = loadImage('immagini/infofunghi1.png'); } catch(e) { console.error("Errore nel caricamento di immagini/infofunghi1.png"); }
  try { imgFunghi2 = loadImage('immagini/infofunghi2.png'); } catch(e) { console.error("Errore nel caricamento di immagini/infofunghi2.png"); }
  // Chromista
  try { imgChromisti1 = loadImage('immagini/infocromisti1.png'); } catch(e) { console.error("Errore nel caricamento di immagini/infocromisti1.png"); }
  try { imgChromisti2 = loadImage('immagini/infocromisti2.png'); } catch(e) { console.error("Errore nel caricamento di immagini/infocromisti2.png"); }
  
  table = loadTable("regni_aree.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  angleMode(RADIANS);
  textFont("cormorant-garamond");

  // Applica sfondo alla navbar se presente 
  let navbar = select('.navbar');
  if (navbar) {
    navbar.style('background-image', 'url("immagini/carta2.jpg")');
    navbar.style('background-size', 'cover');
    navbar.style('background-position', 'center');
    navbar.style('border-bottom', '1px solid #d4d4d4'); 
  }

  parseData();
  sortAreasBySize(); 
  computeLayout();
  loop(); 
}

function sortAreasBySize() {
  areas.sort((a, b) => a.total - b.total);
}

function parseData() {
  areas = [];
  maxTotal = 0;
  for (let r = 0; r < table.getRowCount(); r++) {
    const label = table.getString(r, 0);
    if (!label || label.toLowerCase() === "total") continue; 

    const entry = { area: label, values: {}, total: 0 };
    kingdoms.forEach(k => { 
      const val = parseFloat(table.getString(r, k)) || 0;
      entry.values[k] = val;
      entry.total += val;
    });
    maxTotal = max(entry.total, maxTotal);
    areas.push(entry);
  }
}

function computeLayout() {
  const sizeMin = min(width, height);
  outerRadius = sizeMin * 0.35; 
  wheelCenterX = width * 0.7; 

  const n = areas.length;
  const full = TWO_PI;
  finalGapAngle = full * 0.004;
  finalWedgeAngle = (full - n * finalGapAngle) / n;
  
  wedgeAngles = [];
  let start = -HALF_PI;

  for (let i = 0; i < n; i++) {
    const s = start + i * (finalWedgeAngle + finalGapAngle);
    wedgeAngles.push({ start: s, end: s + finalWedgeAngle });
  }
}

function updateHoverState() {
  hoveredAreaIndex = -1;
  // Non permettiamo hover se il popup è aperto
  if (wheelProgress < 0.99 || isPopupOpen || animProgress > 0) return;

  const relX = mouseX - wheelCenterX;
  const relY = mouseY - height/2;
  const distMouse = sqrt(relX*relX + relY*relY);
  
  if (distMouse < INNER_FIXED_RADIUS || distMouse > outerRadius + 60) return;

  let mAng = atan2(relY, relX);
  if (mAng < 0) mAng += TWO_PI;

  for (let i = 0; i < areas.length; i++) {
    let s = wedgeAngles[i].start;
    let e = wedgeAngles[i].end;
    let sNorm = (s % TWO_PI + TWO_PI) % TWO_PI;
    let eNorm = (e % TWO_PI + TWO_PI) % TWO_PI;
    
    let hit = false;
    if (sNorm < eNorm) {
      if (mAng >= sNorm && mAng <= eNorm) hit = true;
    } else {
      if (mAng >= sNorm || mAng <= eNorm) hit = true;
    }

    if (hit) {
      const areaMaxR = map(areas[i].total, 0, maxTotal, INNER_FIXED_RADIUS + 20, outerRadius);
      if (distMouse <= areaMaxR + 5) {
        hoveredAreaIndex = i;
        // Cambia il cursore per indicare la cliccabilità
        cursor(HAND); 
        return;
      }
    }
  }
  if (hoveredAreaIndex === -1) {
      cursor(ARROW);
  }
}

function draw() {
  if (!isPopupOpen && wheelProgress < 1.0) {
    wheelProgress = min(wheelProgress + WHEEL_SPEED, 1.0);
  }
  if (isPopupOpen) {
    animProgress = min(animProgress + ANIM_SPEED, 1.0);
  } else {
    animProgress = max(animProgress - ANIM_SPEED, 0.0);
  }

  updateHoverState();

  if (cartaSfondo) image(cartaSfondo, 0, 0, width, height);
  else background(bgColor);

  drawTitle(); 
  drawLegend();

  push(); 
  translate(wheelCenterX, height/2); 
  
  for (let i = 0; i < areas.length; i++) {
    drawAnimatedWedge(i); 
    if (wheelProgress > 0.8) drawCurvedLabel(i); 
  }

  if (wheelProgress > 0.8) drawReferenceCircles();
  pop(); 
  
  // Il tooltip appare solo su hover, non su click
  if (hoveredAreaIndex !== -1 && clickedAreaIndex === -1 && !isPopupOpen && animProgress <= 0) {
    drawTooltip(hoveredAreaIndex);
  }

  if (animProgress > 0) drawPopup();
}

function drawAnimatedWedge(i) {
  const N = areas.length;
  const startT = i / N;
  const endT = (i + 1) / N;
  
  if (wheelProgress < startT) return; 

  let localP = map(wheelProgress, startT, endT, 0, 1);
  localP = constrain(localP, 0, 1);

  const { start, end } = wedgeAngles[i];
  const currentEnd = map(localP, 0, 1, start, end);

  const area = areas[i];
  const total = area.total;
  
  const minRadius = INNER_FIXED_RADIUS; 
  const outerLimit = map(total, 0, maxTotal, minRadius + 20, outerRadius); 
  const currentRange = outerLimit - minRadius;

  const segments = kingdoms.map(k => ({ k, v: area.values[k] }));
  const relevant = segments.filter(s => s.v > 0);
  const sumVals = relevant.reduce((acc, o) => acc + o.v, 0);

  if (sumVals <= 0.0001) return;

  let rInner = minRadius; 
  const isDimmed = (hoveredAreaIndex !== -1 && hoveredAreaIndex !== i) || (clickedAreaIndex !== -1 && clickedAreaIndex !== i);
  // Aggiungi un highlight se l'area è cliccata
  const isClicked = (clickedAreaIndex === i);
  
  const minThicknessNeeded = relevant.length * MIN_SEGMENT_THICKNESS;
  const availRange = max(0, currentRange - minThicknessNeeded); 

  for (const { k, v } of segments) {
    if (v <= 0) continue;
    let thick = MIN_SEGMENT_THICKNESS; 
    if (availRange > 0 && sumVals > 0) {
      thick += map(v, 0, sumVals, 0, availRange);
    }
    let rOuter = rInner + thick;
    if (rOuter > outerLimit) rOuter = outerLimit;

    // --- MODIFICA ACQUERELLO: Impostazione Alpha Aumentata ---
    let baseColor = color(palette[k]);
    baseColor.setAlpha(230); 
    
    let c = baseColor;
    let dimming = 0;
    if (isDimmed) dimming = 0.7; 
    if (isClicked) c = color(hue(c), saturation(c), brightness(c) + 20); // Rende più chiaro
    
    c = lerpColor(c, color(225, 225, 220, 230), dimming);
    // --- FINE MODIFICA ---

    drawRingSegment(start, currentEnd, rInner, rOuter, c);
    rInner = rOuter;
  }
}

function drawRingSegment(start, end, rIn, rOut, col) {
  if (abs(end - start) < 0.0001) return;
  
  let layerColor = color(col);
  
  noStroke();
  
  for (let j = 0; j < WATERCOLOR_LAYERS; j++) {
    let currentAlpha = WATERCOLOR_ALPHA + j * 10;
    layerColor.setAlpha(currentAlpha);
    fill(layerColor);

    let rInnerLayer = rIn - j * 0.5;
    let rOuterLayer = rOut + j * WATERCOLOR_BLEED; 

    const steps = 30 + j * 5; 
    const da = (end - start) / steps;
    
    noiseOffset += 0.01; 
    
    beginShape();
    
    for (let i = 0; i <= steps; i++) {
      let angle = start + i*da;
      let noiseR = noise(cos(angle)*0.1 + noiseOffset, sin(angle)*0.1 + noiseOffset) * 2;
      let r = rOuterLayer + noiseR;
      vertex(cos(angle)*r, sin(angle)*r);
    }
    
    for (let i = steps; i >= 0; i--) {
      let angle = start + i*da;
      vertex(cos(angle)*rInnerLayer, sin(angle)*rInnerLayer);
    }
    endShape(CLOSE);
  }
}

function drawCurvedLabel(i) {
  const { start, end } = wedgeAngles[i];
  const label = areas[i].area;
  const textR = outerRadius + 15; 
  
  textSize(constrain(width * 0.012, 10, 14));
  
  if (hoveredAreaIndex === i || clickedAreaIndex === i) {
      fill(0); textStyle(BOLD);
  } else if (hoveredAreaIndex !== -1 || clickedAreaIndex !== -1) {
      fill(180, 180, 180, 180); textStyle(NORMAL);
  } else {
      fill(textColor); textStyle(NORMAL);
  }

  noStroke();
  textAlign(CENTER, CENTER);

  const arcLen = end - start;
  const totalW = textWidth(label);
  const desiredSpan = totalW / textR;
  let scaleFactor = 1;
  if (desiredSpan > arcLen * 0.9) scaleFactor = (arcLen * 0.9) / desiredSpan;

  let centerAngle = (start + end) / 2;
  let isBottom = sin(centerAngle) > 0.001; 

  let currentAngle = start + (arcLen - desiredSpan*scaleFactor)/2;
  let angleStep = 1; 
  let angleFlip = 0;

  if (isBottom) {
      angleFlip = PI; 
      currentAngle = end - (arcLen - desiredSpan*scaleFactor)/2;
      angleStep = -1;
  }

  for (let j = 0; j < label.length; j++) {
    const ch = label[j];
    const cw = textWidth(ch) * scaleFactor;
    const ca = cw / textR;
    
    let ang = currentAngle + (ca/2 * angleStep);
    let x = cos(ang) * textR;
    let y = sin(ang) * textR;
    
    push();
    translate(x, y);
    rotate(ang + HALF_PI + angleFlip);
    textSize(constrain(width * 0.012, 10, 14) * scaleFactor);
    text(ch, 0, 0);
    pop();
    
    currentAngle += ca * angleStep;
  }
}

function drawTooltip(index) {
  const area = areas[index];
  const padding = 12;
  const lineHeight = 20;
  
  let content = [];
  content.push({ t: area.area.toUpperCase(), b: true, c: textColor });
  content.push({ t: `Totale: ${area.total}`, b: false, c: textColor });
  
  kingdoms.forEach(k => {
    if (area.values[k] > 0) {
      content.push({ 
        t: `${capitalize(k)}: ${area.values[k]}`, 
        b: false, 
        c: textColor, 
        dotColor: palette[k] 
      });
    }
  });

  textSize(14);
  let maxW = 0;
  content.forEach(l => {
    textStyle(l.b ? BOLD : NORMAL);
    let w = textWidth(l.t) + (l.dotColor ? 15 : 0);
    if (w > maxW) maxW = w;
  });
  
  const boxW = maxW + padding*2;
  const boxH = content.length * lineHeight + padding*2;
  
  let tx = mouseX + 15;
  let ty = mouseY + 15;
  if (tx + boxW > width) tx = mouseX - boxW - 5;
  if (ty + boxH > height) ty = mouseY - boxH - 5;

  push();
  fill(255, 250);
  stroke(200);
  rect(tx, ty, boxW, boxH, 6);
  
  let cy = ty + padding;
  textAlign(LEFT, TOP);
  noStroke();
  
  content.forEach(l => {
    let cx = tx + padding;
    if (l.dotColor) {
      fill(l.dotColor);
      circle(cx + 4, cy + 7, 8);
      cx += 15;
    }
    fill(l.c);
    textStyle(l.b ? BOLD : NORMAL);
    text(l.t, cx, cy);
    cy += lineHeight;
  });
  pop();
}

function mouseClicked() {
  if (animProgress > 0 && animProgress < 1) return; 

  // 1. GESTIONE CLICK SUI SEGMENTI DEL GRAFICO
  if (!isPopupOpen && wheelProgress >= 1.0 && hoveredAreaIndex !== -1) {
    const areaName = areas[hoveredAreaIndex].area;
    clickedAreaIndex = hoveredAreaIndex; 
    
    // SIMULAZIONE NAVIGAZIONE: logga l'azione e l'area cliccata
    console.log(`Navigazione simulata: Click sul segmento "${areaName}". Qui andrebbe il reindirizzamento alla pagina di dettaglio.`);
    
    // Potresti reindirizzare qui, ad esempio: window.location.href = `dettaglio_${areaName}.html`;
    return;
  }
  
  // 2. GESTIONE CLICK X POPUP
  if (isPopupOpen) {
    const popX = width / 2;
    const popY = height / 2;
    const margin = 30; 
    
    const boxLeft = popX - POPUP_WIDTH / 2;
    const boxTop = popY - POPUP_HEIGHT / 2;
    
    const closeBtnX = boxLeft + POPUP_WIDTH - margin;
    const closeBtnY = boxTop + margin;
    const btnSize = 30;

    if (dist(mouseX, mouseY, closeBtnX, closeBtnY) < btnSize) {
      isPopupOpen = false;
      return;
    }
  }
  
  // 3. GESTIONE CLICK ICONE LEGENDA
  if (!isPopupOpen && wheelProgress >= 1.0) {
    for (let b of infoIconBounds) {
      if (dist(mouseX, mouseY, b.x, b.y) < 15) {
        currentPopupContent = popupData[b.k];
        isPopupOpen = true;
        clickedAreaIndex = -1; // Reset dello stato di click sul grafico se apro il popup
        animProgress = 0;
        return;
      }
    }
  }
}

function drawTitle() {
  push();
  fill(textColor);
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(NORMAL); 
  const sz = constrain(width * 0.05, 30, 60); 
  textSize(sz);
  const startX = 60;
  const maxWheelRadius = outerRadius + 15; 
  let startY = height / 2 - maxWheelRadius; 
  text("Atlante delle", startX, startY);
  startY += sz * 1.1; 
  text("Specie a", startX, startY);
  startY += sz * 1.1;
  text("Rischio", startX, startY);
  pop();
}

// --- LEGENDA CON TEXTURE ---
function drawLegend() {
  push();
  textStyle(NORMAL); 
  if (wheelProgress >= 1.0) infoIconBounds = []; 

  const sz = constrain(width * 0.05, 30, 60); 
  const wheelTop = (height/2) - (outerRadius + 15);
  let sy = max(30, wheelTop);
  const titleH = sz * 3.3; 
  
  const legendX = 60; 
  let currentY = sy + titleH + 40; 

  const rowH = 30;
  const legendWidth = 220; 
  const legendHeight = rowH * (kingdoms.length + 1) + 30;

  // Calcolo box per texture
  const lx = legendX - 15;
  const ly = currentY - 15;
  const lw = legendWidth;
  const lh = legendHeight;

  // Disegno Sfondo Legenda con Texture e Ritaglio
  push();
  drawingContext.save();
  drawingContext.beginPath();
  // Rettangolo arrotondato standard
  const r = 8;
  drawingContext.moveTo(lx + r, ly);
  drawingContext.arcTo(lx + lw, ly, lx + lw, ly + lh, r);
  drawingContext.arcTo(lx + lw, ly + lh, lx, ly + lh, r);
  drawingContext.arcTo(lx, ly + lh, lx, ly, r);
  drawingContext.arcTo(lx, ly, lx + lw, ly, r);
  drawingContext.closePath();
  drawingContext.clip();

  if (cartaPopup && cartaPopup.width > 1) {
     image(cartaPopup, lx, ly, lw, lh);
     // Velo bianco per leggibilità
     fill(255, 180); 
     noStroke();
     rect(lx, ly, lw, lh);
  } else {
     fill(255, 240);
     noStroke();
     rect(lx, ly, lw, lh);
  }
  drawingContext.restore();
  pop();
  
  // Contenuto Legenda
  textSize(18); 
  textAlign(LEFT, CENTER);
  fill(textColor);
  textStyle(BOLD);
  text("Regni", legendX, currentY); 
  textStyle(NORMAL);
  currentY += rowH;

  kingdoms.forEach(k => { 
    // MODIFICA: Uso del cerchio per la legenda per coerenza con l'effetto (o un piccolo quadrato)
    fill(palette[k]);
    rect(legendX, currentY - 9, 18, 18, 4); 
    fill(textColor);
    text(capitalize(k), legendX + 26, currentY);
    const iconX = legendX + 26 + textWidth(capitalize(k)) + 15;
    drawInfoIconText(iconX, currentY);
    
    if (wheelProgress >= 1.0) {
      infoIconBounds.push({x: iconX, y: currentY, size: 16, k: k});
    }
    currentY += rowH;
  });
  pop();
}

function drawInfoIconText(x, y) {
  push();
  const iconSize = 16; 
  noFill();
  stroke(textColor);
  strokeWeight(1);
  circle(x, y, iconSize);

  fill(textColor);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text("i", x, y - 1); 
  pop();
}

function drawReferenceCircles() {
  push();
  noFill(); 
  stroke(150);
  strokeWeight(1);
  circle(0, 0, INNER_FIXED_RADIUS * 2);

  if (maxTotal > 0) {
    for (const val of REFERENCE_VALUES) {
        if (val > maxTotal * 1.5) continue; 
        const r = map(val, 0, maxTotal, INNER_FIXED_RADIUS, outerRadius);
        noFill(); 
        stroke(100); 
        strokeWeight(0.5); 
        drawingContext.setLineDash([4, 4]); 
        circle(0, 0, r * 2);
        drawingContext.setLineDash([]); 
        fill(textColor); 
        noStroke(); 
        textSize(10);
        textAlign(LEFT, CENTER);
        text(val, r + 5, 0);
    }
  }
  pop();
}

function drawPopup() {
  fill(0, 100 * animProgress); 
  noStroke();
  rect(0, 0, width, height);

  const popX = width / 2;
  const popY = height / 2;
  
  let curH;
  if (animProgress < 0.3) {
    curH = MIN_POPUP_HEIGHT;
  } else {
    let expandP = map(animProgress, 0.3, 1.0, 0, 1);
    curH = map(expandP, 0, 1, MIN_POPUP_HEIGHT, POPUP_HEIGHT);
  }

  // Dimensioni e posizioni del popup
  const boxLeft = popX - POPUP_WIDTH / 2;
  const boxTop = popY - curH / 2;
  const textMargin = 30;

  push();
  // Clipping
  drawingContext.save();
  drawingContext.beginPath();
  const r = 10;
  const x = boxLeft, y = boxTop, w = POPUP_WIDTH, h = curH;
  drawingContext.moveTo(x + r, y);
  drawingContext.arcTo(x + w, y, x + w, y + h, r);
  drawingContext.arcTo(x + w, y + h, x, y + h, r);
  drawingContext.arcTo(x, y + h, x, y, r);
  drawingContext.arcTo(x, y, x + w, y, r);
  drawingContext.closePath();
  drawingContext.clip();

  if (cartaPopup && cartaPopup.width > 1) {
     image(cartaPopup, boxLeft, boxTop, POPUP_WIDTH, curH);
  } else {
     fill(255, 250);
     noStroke();
     rectMode(CORNER);
     rect(boxLeft, boxTop, POPUP_WIDTH, curH);
  }
  drawingContext.restore();

  noFill();
  stroke(textColor);
  strokeWeight(1);
  rectMode(CORNER);
  rect(boxLeft, boxTop, POPUP_WIDTH, curH, 10);

  if (curH >= MIN_POPUP_HEIGHT) {
    fill(textColor);
    noStroke();
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(22);
    
    let t = currentPopupContent ? currentPopupContent.title : "Info";
    text(t, popX, boxTop + 18);

    if (animProgress >= 0.99) {
      
      const contentYStart = boxTop + 70;
      const contentH = curH - 80;
      
      const regno = currentPopupContent ? currentPopupContent.title.replace("Regno ", "").toLowerCase() : '';
      let img1, img2, part1, part2;

      // Mappatura dinamica dei contenuti (immagini e testo)
      if (regno === 'animalia') {
          img1 = imgAnimali1; img2 = imgAnimali2;
          part1 = popupData.animalia.description_part1;
          part2 = popupData.animalia.description_part2;
      } else if (regno === 'plantae') {
          img1 = imgPiante1; img2 = imgPiante2;
          part1 = popupData.plantae.description_part1;
          part2 = popupData.plantae.description_part2;
      } else if (regno === 'fungi') {
          img1 = imgFunghi1; img2 = imgFunghi2;
          part1 = popupData.fungi.description_part1;
          part2 = popupData.fungi.description_part2;
      } else if (regno === 'chromista') {
          img1 = imgChromisti1; img2 = imgChromisti2;
          part1 = popupData.chromista.description_part1;
          part2 = popupData.chromista.description_part2;
      }

      textStyle(NORMAL);
      textSize(16);
      
      // Controlla se il regno corrente usa il layout 1/3 - 2/3 (cioè se ha le parti di descrizione separate)
      if (part1 && part2) {
        
        // --- CALCOLO GRIGLIA 1/3 - 2/3 ---
        const ROW_HEIGHT = (contentH - 5) / 2; // Due righe di contenuto con piccolo spazio
        const COL_W_THIRD = (POPUP_WIDTH - textMargin * 2) / 3;
        const COL_W_TWOTHIRDS = COL_W_THIRD * 2;
        const Gutter = 5; // Spazio tra immagine e testo
        
        // --- RIGA 1: Immagine 1 (1/3 Sinistra) + Paragrafo 1 (2/3 Destra) ---
        
        // 1A. Disegna Immagine 1 (Sinistra)
        if (img1) {
            const scaleFactor = min((COL_W_THIRD - Gutter) / img1.width, (ROW_HEIGHT - Gutter) / img1.height);
            const w = img1.width * scaleFactor;
            const h = img1.height * scaleFactor;
            
            image(img1, 
                  boxLeft + textMargin + (COL_W_THIRD - w) / 2, // Centrata nello slot 1/3
                  contentYStart + (ROW_HEIGHT - h) / 2,         // Centrata in verticale
                  w, 
                  h);
        }
        
        // 1B. Disegna Testo 1 (Destra)
        let text1X = boxLeft + textMargin + COL_W_THIRD + Gutter;
        textAlign(LEFT, TOP);
        text(part1, 
             text1X, 
             contentYStart, 
             COL_W_TWOTHIRDS - Gutter, // Larghezza del testo
             ROW_HEIGHT);
             
        // --- RIGA 2: Paragrafo 2 (2/3 Sinistra) + Immagine 2 (1/3 Destra) ---
        
        const row2YStart = contentYStart + ROW_HEIGHT + Gutter;
        
        // 2A. Disegna Testo 2 (Sinistra)
        let text2X = boxLeft + textMargin;
        textAlign(LEFT, TOP);
        text(part2, 
             text2X, 
             row2YStart, 
             COL_W_TWOTHIRDS - Gutter, // Larghezza del testo
             ROW_HEIGHT);

        // 2B. Disegna Immagine 2 (Destra)
        if (img2) {
            const scaleFactor = min((COL_W_THIRD - Gutter) / img2.width, (ROW_HEIGHT - Gutter) / img2.height);
            const w = img2.width * scaleFactor;
            const h = img2.height * scaleFactor;
            
            let img2X = boxLeft + textMargin + COL_W_TWOTHIRDS + Gutter;

            image(img2, 
                  img2X + (COL_W_THIRD - w) / 2, // Centrata nello slot 1/3
                  row2YStart + (ROW_HEIGHT - h) / 2, // Centrata in verticale
                  w, 
                  h);
        }

      } else if (currentPopupContent.description) {
        // Logica di fallback (regni con descrizione singola)
        textAlign(LEFT, TOP);
        text(currentPopupContent.description, 
             boxLeft + textMargin, 
             contentYStart, 
             POPUP_WIDTH - textMargin*2, 
             contentH);
      }
      
      // --- Bottone Chiudi ---
      const btnSize = 30;
      const btnMargin = 30;
      const closeCx = boxLeft + POPUP_WIDTH - btnMargin;
      const closeCy = boxTop + btnMargin;
      
      rectMode(CENTER);
      stroke(textColor);
      strokeWeight(1.5);
      noFill();
      rect(closeCx, closeCy, btnSize, btnSize, 5);
      strokeWeight(2);
      line(closeCx - 6, closeCy - 6, closeCx + 6, closeCy + 6);
      line(closeCx + 6, closeCy - 6, closeCx - 6, closeCy + 6);
    }
  }
  pop();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeLayout(); 
  redraw(); 
}