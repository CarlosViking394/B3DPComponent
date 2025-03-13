interface MaterialResonance {
  strength: string;
  flexibility: string;
  heatResistance: string;
  printDifficulty: string;
  nozzleTemp: string;
  bedTemp: string;
  printSpeed: string;
  layerHeight: string;
}

// Rename this to avoid conflict
const materialProperties: Record<string, MaterialResonance> = {
  'PLA': {
    strength: 'Medium',
    flexibility: 'Low',
    heatResistance: 'Low (60°C)',
    printDifficulty: 'Easy',
    nozzleTemp: '190-220°C',
    bedTemp: '20-60°C',
    printSpeed: '50-60mm/s',
    layerHeight: '0.1-0.3mm',
  },
  
  'ABS': {
    strength: 'High',
    flexibility: 'Medium',
    heatResistance: 'High (100°C)',
    printDifficulty: 'Moderate',
    nozzleTemp: '230-250°C',
    bedTemp: '95-110°C',
    printSpeed: '40-60mm/s',
    layerHeight: '0.1-0.3mm',
  },
  
  'PETG': {
    strength: 'High',
    flexibility: 'Medium',
    heatResistance: 'Medium (75°C)',
    printDifficulty: 'Easy',
    nozzleTemp: '230-250°C',
    bedTemp: '70-80°C',
    printSpeed: '40-60mm/s',
    layerHeight: '0.1-0.3mm',
  },
  
  'TPU': {
    strength: 'Medium',
    flexibility: 'High',
    heatResistance: 'Medium (80°C)',
    printDifficulty: 'Challenging',
    nozzleTemp: '220-250°C',
    bedTemp: '30-60°C',
    printSpeed: '20-30mm/s',
    layerHeight: '0.1-0.2mm',
  },
};

export function getMaterialResonanceData(materialType: string): MaterialResonance | null {
  return materialProperties[materialType] || null;
}

export const materialResonanceData = {
  PLA: {
    advantages: [
      "Good vibration damping characteristics",
      "Cost-effective for prototyping resonant structures",
      "Easy to print complex resonant geometries",
      "Suitable for acoustic applications",
    ],
    applications: [
      "Musical instrument prototypes",
      "Speaker enclosures",
      "Acoustic dampeners",
      "Vibration isolation mounts",
    ],
    technicalDetails: {
      dampingRatio: "0.02-0.04",
      naturalFrequency: "20-1000 Hz typical range",
      acousticProperties: "Good sound absorption at mid frequencies",
    },
  },
  PETG: {
    advantages: [
      "Better impact resistance than PLA for vibrating parts",
      "Good fatigue resistance for resonant applications",
      "Excellent layer adhesion for structural integrity",
      "Chemical resistance to environmental factors",
    ],
    applications: [
      "Industrial resonators",
      "Mechanical dampeners",
      "Protective casings for vibrating equipment",
      "Acoustic panels",
    ],
    technicalDetails: {
      dampingRatio: "0.03-0.05",
      naturalFrequency: "15-800 Hz typical range",
      acousticProperties: "Moderate sound transmission loss",
    },
  },
  TPU: {
    advantages: [
      "Excellent vibration absorption",
      "High flexibility for tuned damping",
      "Good fatigue resistance",
      "Variable shore hardness options",
    ],
    applications: [
      "Vibration isolators",
      "Flexible mounts",
      "Dampening components",
      "Acoustic isolation",
    ],
    technicalDetails: {
      dampingRatio: "0.1-0.3",
      naturalFrequency: "5-200 Hz typical range",
      acousticProperties: "High damping capacity across frequencies",
    },
  },
  // Add more materials as needed
}; 