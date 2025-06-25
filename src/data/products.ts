export interface Chemical {
  id: number;
  name: string;
  category: string;
  description: string;
  cas: string;
  quantity: string;
  location: string;
  manufacturer?: string;
  purity?: string;
  applications?: string[];
  safetyInfo?: {
    hazardClass?: string;
    storageTemp?: string;
    handling?: string[];
  };
  specifications?: {
    appearance?: string;
    molarMass?: string;
    meltingPoint?: string;
    boilingPoint?: string;
  };
}

export const chemicals: Chemical[] = [
  {
    id: 1,
    name: "Sodium Hydroxide",
    category: "Inorganic Chemicals",
    description: "Caustic soda in pellet form, technical grade. Widely used in various industrial processes including chemical manufacturing, paper production, and water treatment.",
    cas: "1310-73-2",
    quantity: "40,000 lbs",
    location: "Wisconsin",
    manufacturer: "Major Chemical Corporation",
    purity: "99% min",
    applications: [
      "pH adjustment",
      "Chemical manufacturing",
      "Soap production",
      "Water treatment",
      "Pulp and paper processing"
    ],
    safetyInfo: {
      hazardClass: "Class 8 - Corrosive",
      storageTemp: "Room temperature",
      handling: [
        "Use appropriate PPE",
        "Store in dry area",
        "Avoid contact with acids"
      ]
    }
  },
  {
    id: 2,
    name: "Citric Acid",
    category: "Organic Acids",
    description: "Anhydrous, food grade citric acid. Essential ingredient in food and beverage manufacturing, pharmaceutical formulations, and cleaning products.",
    cas: "77-92-9",
    quantity: "15,000 kgs",
    location: "South Carolina",
    manufacturer: "BioChemical Industries",
    purity: "99.5% min",
    applications: [
      "Food and beverage production",
      "Pharmaceutical manufacturing",
      "Cleaning products",
      "pH adjustment",
      "Metal cleaning"
    ],
    safetyInfo: {
      hazardClass: "Class 8 - Mild Irritant",
      storageTemp: "Cool and dry",
      handling: [
        "Avoid dust formation",
        "Keep container tightly closed",
        "Protect from moisture"
      ]
    }
  },
  {
    id: 3,
    name: "Glycerin",
    category: "Alcohols",
    description: "USP grade, 99.7% pure glycerin. Versatile ingredient used in pharmaceutical, personal care, and food applications. Known for its humectant properties.",
    cas: "56-81-5",
    quantity: "4 totes",
    location: "Texas",
    manufacturer: "PharmaChem Solutions",
    purity: "99.7% min",
    applications: [
      "Pharmaceutical formulations",
      "Cosmetics manufacturing",
      "Food production",
      "Industrial lubricants",
      "Chemical synthesis"
    ],
    safetyInfo: {
      hazardClass: "Non-hazardous",
      storageTemp: "Room temperature",
      handling: [
        "Keep container sealed",
        "Avoid extreme temperatures",
        "Protect from moisture"
      ]
    }
  },
  {
    id: 4,
    name: "Potassium Chloride",
    category: "Inorganic Chemicals",
    description: "High purity potassium chloride suitable for various industrial applications including fertilizers, pharmaceuticals, and food processing.",
    cas: "7447-40-7",
    quantity: "25,000 kgs",
    location: "Michigan",
    manufacturer: "Mineral Solutions Inc.",
    purity: "99.5% min",
    applications: [
      "Fertilizer production",
      "Pharmaceutical manufacturing",
      "Food processing",
      "Water treatment",
      "Chemical synthesis"
    ],
    safetyInfo: {
      hazardClass: "Non-hazardous",
      storageTemp: "Room temperature",
      handling: [
        "Avoid moisture exposure",
        "Use in well-ventilated area",
        "Standard PPE required"
      ]
    }
  },
  {
    id: 5,
    name: "Methanol",
    category: "Alcohols",
    description: "Technical grade methanol for industrial use. Essential solvent for various chemical processes and manufacturing applications.",
    cas: "67-56-1",
    quantity: "6 tankers",
    location: "Louisiana",
    manufacturer: "PetroSynth Corp",
    purity: "99.9% min",
    applications: [
      "Solvent applications",
      "Fuel production",
      "Chemical synthesis",
      "Biodiesel manufacturing",
      "Industrial cleaning"
    ],
    safetyInfo: {
      hazardClass: "Class 3 - Flammable",
      storageTemp: "Cool, ventilated area",
      handling: [
        "Keep away from ignition sources",
        "Use explosion-proof equipment",
        "Proper ventilation required"
      ]
    }
  },
  {
    id: 6,
    name: "Sulfuric Acid",
    category: "Inorganic Acids",
    description: "Industrial grade sulfuric acid. Fundamental chemical for various industrial processes and manufacturing applications.",
    cas: "7664-93-9",
    quantity: "3 rail cars",
    location: "Texas",
    manufacturer: "Industrial Chemicals Ltd",
    purity: "98% min",
    applications: [
      "Metal processing",
      "Fertilizer production",
      "Chemical synthesis",
      "Wastewater treatment",
      "Battery manufacturing"
    ],
    safetyInfo: {
      hazardClass: "Class 8 - Corrosive",
      storageTemp: "Controlled environment",
      handling: [
        "Strict PPE requirements",
        "Secondary containment required",
        "Acid-resistant equipment only"
      ]
    }
  },
  {
    id: 7,
    name: "Ethylene Glycol",
    category: "Alcohols",
    description: "Industrial grade ethylene glycol. Widely used in antifreeze formulations and as a chemical intermediate.",
    cas: "107-21-1",
    quantity: "8 totes",
    location: "Illinois",
    manufacturer: "ChemSynth Industries",
    purity: "99.5% min",
    applications: [
      "Antifreeze production",
      "Heat transfer fluid",
      "Polyester manufacturing",
      "Industrial humectant",
      "De-icing applications"
    ],
    safetyInfo: {
      hazardClass: "Class 6.1 - Toxic",
      storageTemp: "Room temperature",
      handling: [
        "Avoid ingestion",
        "Use proper ventilation",
        "Keep away from children and pets"
      ]
    }
  },
  {
    id: 8,
    name: "Sodium Carbonate",
    category: "Inorganic Chemicals",
    description: "Pure soda ash suitable for various industrial applications. Essential in glass manufacturing and chemical processing.",
    cas: "497-19-8",
    quantity: "50,000 lbs",
    location: "Wyoming",
    manufacturer: "Mineral Processing Corp",
    purity: "99.2% min",
    applications: [
      "Glass manufacturing",
      "Detergent production",
      "Water treatment",
      "Chemical processing",
      "pH adjustment"
    ],
    safetyInfo: {
      hazardClass: "Class 8 - Irritant",
      storageTemp: "Dry area",
      handling: [
        "Avoid dust formation",
        "Keep containers sealed",
        "Use appropriate PPE"
      ]
    }
  },
  {
    id: 9,
    name: "Acetic Acid",
    category: "Organic Acids",
    description: "Glacial acetic acid for industrial use. Key ingredient in various chemical processes and manufacturing applications.",
    cas: "64-19-7",
    quantity: "12 totes",
    location: "New Jersey",
    manufacturer: "Organic Synthetics Inc",
    purity: "99.8% min",
    applications: [
      "Chemical synthesis",
      "Textile processing",
      "Food preservation",
      "Pharmaceutical manufacturing",
      "Polymer production"
    ],
    safetyInfo: {
      hazardClass: "Class 8 - Corrosive",
      storageTemp: "Cool, ventilated area",
      handling: [
        "Use acid-resistant equipment",
        "Proper ventilation required",
        "Avoid contact with bases"
      ]
    }
  },
  {
    id: 10,
    name: "Hydrogen Peroxide",
    category: "Oxidizing Agents",
    description: "Industrial strength hydrogen peroxide. Essential for bleaching, disinfection, and chemical synthesis.",
    cas: "7722-84-1",
    quantity: "5 totes",
    location: "Georgia",
    manufacturer: "OxyChem Solutions",
    purity: "35% w/w",
    applications: [
      "Pulp bleaching",
      "Water treatment",
      "Electronics manufacturing",
      "Chemical synthesis",
      "Surface disinfection"
    ],
    safetyInfo: {
      hazardClass: "Class 5.1 - Oxidizer",
      storageTemp: "Cool, dark area",
      handling: [
        "Keep away from combustibles",
        "Use vented caps",
        "Regular stability testing"
      ]
    }
  },
    {
    id: 11,
    name: "Tyler",
    category: "Organic Acids",
    description: "",
    cas: "",
    quantity: "12 totes",
    location: "",
    manufacturer: "",
    purity: "",
    applications: [
    ],
    safetyInfo: {
      hazardClass: "",
      storageTemp: "",
      handling: [
      ]
    }
  },
];

export const categories = Array.from(new Set(chemicals.map(chem => chem.category)));