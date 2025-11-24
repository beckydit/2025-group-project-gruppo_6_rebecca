/*
  VISUALIZZAZIONE FINALE COMPLETA:
  - Transizione Animata Spirale <-> Colonna (Movimento Delicato)
  - Gradiente Funghi: #7E7163 (scuro) -> #D8C9BB (chiaro)
  - Gradiente Piante: #92A38B (scuro) -> #D0E0C8 (chiaro)
  - Layout migliorato: spirale centrata a sinistra, design elegante
*/

// =======================================================
// --- VARIABILI GLOBALI DI STATO E ANIMAZIONE ---
let comparisonEnabled = false; 
let comparisonCheckbox; 
let hoveredCause = null; 

let transitionFactor = 0; 
const TRANSITION_SPEED = 0.015; 
// =======================================================

// Dati (invariati)
const fungiData = {
  "Uso di risorse biologiche": 7, 
  "Cambiamenti climatici e meteo severo": 5, 
  "Sviluppo residenziale e commerciale": 4, 
  "Corridoi di trasporto e servizi": 4, 
  "Modifiche ai sistemi naturali": 4, 
  "Agricoltura e acquacoltura": 2, 
  "Produzione di energia e miniere": 2, 
  "Intrusioni umane e disturbo": 2, 
  "Specie invasive/problematiche": 2, 
  "Inquinamento": 1, 
  "Altro/sconosciuto": 1
};

const plantaeData = {
  "Agricoltura e acquacoltura": 2887, 
  "Uso di risorse biologiche": 2154, 
  "Modifiche ai sistemi naturali": 818, 
  "Specie invasive/problematiche": 772, 
  "Cambiamenti climatici e meteo severo": 480, 
  "Sviluppo residenziale e commerciale": 465, 
  "Produzione di energia e miniere": 370, 
  "Intrusioni umane e disturbo": 243, 
  "Corridoi di trasporto e servizi": 258, 
  "Inquinamento": 148, 
  "Eventi geologici": 84, 
  "Altro/sconosciuto": 18
};

let fungiCauses = [];
let plantaeCauses = [];

// --- PARAMETRI FISICI MIGLIORATI ---
const MARRONE_START = [126, 113, 99];   // #7E7163
const MARRONE_END = [216, 201, 187];    // #D8C9BB

const VERDE_START = [146, 163, 139];    // #92A38B
const VERDE_END = [208, 224, 200];      // #D0E0C8

const MAX_R = 65; 
const MIN_R = 25; 
const SPIRAL_FULL = { startR: 140, growth: 15 }; 
const COL_Y_STEP = 60;

function setup() {
  createCanvas(1200, 900);
  angleMode(DEGREES); 
  textFont('serif'); 
  
  comparisonCheckbox = createCheckbox('Fai un confronto', false);
  comparisonCheckbox.position(50, 60); 
  comparisonCheckbox.style('font-family', 'serif');
  comparisonCheckbox.style('font-size', '18px');
  comparisonCheckbox.style('color', '#5a5a5a');
  comparisonCheckbox.changed(toggleComparison);
  
  fungiCauses = prepareData(fungiData, "Funghi");
  plantaeCauses = prepareData(plantaeData, "Piante");
}

function toggleComparison() {
  comparisonEnabled = comparisonCheckbox.checked(); 
}

function prepareData(data, kingdomName) {
    let causes = [];
    let total = 0;
    for (const [key, value] of Object.entries(data)) {
        if (value > 0) {
            causes.push({ label: key, value: value, kingdom: kingdomName });
            total += value;
        }
    }
    causes.sort((a, b) => b.value - a.value); 
    return causes;
}

function draw() {
  background(245, 240, 235); // Sfondo beige caldo
  hoveredCause = null;
  
  // Titolo principale in basso a sinistra
  push();
  fill(60);
  textFont('serif');
  textSize(48);
  textAlign(LEFT, BOTTOM);
  text("Europa", 50, height - 40);
  pop();
  
  // 1. GESTIONE DELLA TRANSIZIONE ANIMATA
  if (comparisonEnabled) {
    transitionFactor = min(transitionFactor + TRANSITION_SPEED, 1);
  } else {
    transitionFactor = max(transitionFactor - TRANSITION_SPEED, 0);
  }
  
  // 2. Disegna la Visualizzazione Fungi (sempre animata)
  drawAnimatedVisualization(fungiCauses, color(MARRONE_START), color(MARRONE_END), transitionFactor);
  
  // 3. Disegna la Visualizzazione Piante (fade-in in colonna)
  if (transitionFactor > 0) { 
      drawColumn(plantaeCauses, color(VERDE_START), color(VERDE_END), 850, 450, transitionFactor);
  }
  
  // 4. Disegna il tooltip
  if (hoveredCause) {
      drawTooltip(hoveredCause);
  }
}

// Funzione per la visualizzazione Fungi con Transizione (Posizione)
function drawAnimatedVisualization(data, colorStart, colorEnd, factor) {
    let numCauses = data.length;
    let maxValue = data[0].value;
    let minValue = data[data.length - 1].value;

    // --- COORDINATE INIZIALI (SPIRALE CENTRATA A SINISTRA) ---
    let spiralCoords = [];
    let angle = 180; // Inizia da sinistra
    let maxRadiusSpiral = SPIRAL_FULL.startR + (numCauses - 1) * SPIRAL_FULL.growth;
    let centerX_S = 480; // Spostato più a sinistra
    let centerY_S = 380; // Spostato più in alto
    
    for (let i = 0; i < numCauses; i++) {
        let radius = maxRadiusSpiral - i * SPIRAL_FULL.growth;
        let x = centerX_S + cos(angle) * radius;
        let y = centerY_S + sin(angle) * radius;
        spiralCoords.push({ x: x, y: y });
        angle -= map(i, 0, numCauses - 1, 25, 15);
    }

    // --- COORDINATE FINALI (COLONNA COMP.) ---
    let columnCoords = [];
    let columnTopY = 450 - (numCauses / 2) * COL_Y_STEP + (COL_Y_STEP / 2); 
    let centerX_C = 350; 

    for (let i = 0; i < numCauses; i++) {
        columnCoords.push({ x: centerX_C, y: columnTopY + i * COL_Y_STEP });
    }

    // --- DISEGNO ANIMATO ---
    for (let i = 0; i < numCauses; i++) {
        let cause = data[i];
        
        // INTERPOLAZIONE DELLA POSIZIONE
        let dotX = lerp(spiralCoords[i].x, columnCoords[i].x, factor);
        let dotY = lerp(spiralCoords[i].y, columnCoords[i].y, factor);

        let mappedRadius = map(cause.value, minValue, maxValue, MIN_R, MAX_R);
        
        let interCol = map(i, 0, numCauses - 1, 0, 1); 
        let currentColor = lerpColor(colorStart, colorEnd, interCol); 
        
        // --- RILEVAMENTO HOVER ---
        if (dist(mouseX, mouseY, dotX, dotY) < mappedRadius) {
            hoveredCause = { x: dotX, y: dotY, label: cause.label, value: cause.value, kingdom: cause.kingdom };
        }
        
        drawDot(dotX, dotY, mappedRadius, currentColor, 255); 
        drawCauseText(dotX, dotY, mappedRadius, cause.label);
    }
}

// Funzione di disegno della Colonna Piante (con Fade-in Alpha)
function drawColumn(data, colorStart, colorEnd, centerX, centerY, alphaFactor) {
    let numCauses = data.length;
    let maxValue = data[0].value;
    let minValue = data[data.length - 1].value;

    let columnTopY = centerY - (numCauses / 2) * COL_Y_STEP + (COL_Y_STEP / 2);

    let alpha = lerp(0, 255, alphaFactor); 

    for (let i = 0; i < numCauses; i++) {
        let cause = data[i];
        
        let interCol = map(i, 0, numCauses - 1, 0, 1); 
        let currentColor = lerpColor(colorStart, colorEnd, interCol); 
        
        let mappedRadius = map(cause.value, minValue, maxValue, MIN_R, MAX_R);
        
        let dotX = centerX;
        let dotY = columnTopY + i * COL_Y_STEP;

        // --- RILEVAMENTO HOVER ---
        if (dist(mouseX, mouseY, dotX, dotY) < mappedRadius) {
            hoveredCause = { x: dotX, y: dotY, label: cause.label, value: cause.value, kingdom: cause.kingdom };
        }
        
        drawDot(dotX, dotY, mappedRadius, currentColor, alpha);
        drawCauseText(dotX, dotY, mappedRadius, cause.label, alpha);
    }
}

// Funzione Ausiliaria per disegnare il cerchio (con evidenziazione delicata)
function drawDot(dotX, dotY, mappedRadius, baseColor, alpha) {
    push();
    if (hoveredCause && hoveredCause.x === dotX && hoveredCause.y === dotY) {
        fill(255, 200, 0, alpha * 0.5); 
        noStroke();
        ellipse(dotX, dotY, mappedRadius * 2 + 8, mappedRadius * 2 + 8);
    }
    
    let finalColor = color(red(baseColor), green(baseColor), blue(baseColor), alpha);
    
    fill(finalColor);
    stroke(255, alpha * 0.8); 
    strokeWeight(2); 
    ellipse(dotX, dotY, mappedRadius * 2, mappedRadius * 2);
    pop();
}

// Funzione di utilità per disegnare il testo interno al pallino (con Alpha)
function drawCauseText(dotX, dotY, mappedRadius, originalLabel, alpha = 255) {
    push();
    fill(255, alpha); 
    textFont('serif'); 
    textAlign(CENTER, CENTER);
    
    let textScaleFactor = mappedRadius > 40 ? 0.18 : 0.25; 
    textSize(mappedRadius * textScaleFactor); 
    
    let finalLabel;
    if (originalLabel.length > 20) { 
        let midIndex = Math.floor(originalLabel.length / 2);
        let breakIndex = originalLabel.lastIndexOf(' ', midIndex);
        
        if (breakIndex !== -1 && breakIndex > 5 && breakIndex < originalLabel.length - 5) {
            finalLabel = originalLabel.substring(0, breakIndex) + '\n' + originalLabel.substring(breakIndex + 1);
        } else {
            finalLabel = originalLabel.replace(/ and | e /, '\n& ');
        }
    } else {
        finalLabel = originalLabel;
    }
    
    text(finalLabel, dotX, dotY);
    pop();
}

// Funzione per disegnare il tooltip sopra il pallino
function drawTooltip(data) {
    let tooltipText = "specie a rischio: " + data.value;
    let padding = 10;
    
    push();
    textFont('sans-serif'); 
    textSize(16); 
    textAlign(LEFT, TOP);
    
    let tw = textWidth(tooltipText);
    
    let boxWidth = tw + padding * 2;
    let boxHeight = 16 + padding * 2;
    
    let boxX = mouseX + 15;
    let boxY = mouseY - 30;
    
    fill(50, 50, 50, 230); 
    rect(boxX, boxY, boxWidth, boxHeight, 5); 
    
    fill(255);
    text(tooltipText, boxX + padding, boxY + padding);
    
    pop();
}