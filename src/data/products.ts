export interface Chemical {
  id: number;
  name: string;
  category: string;
  description: string;
  quantity: string;
}

export const chemicals: Chemical[] = [
  {
    id: 1,
    name: "Sodium Hydroxide",
    category: "Inorganic Chemicals",
    description: "Caustic soda in pellet form, technical grade. Widely used in various industrial processes including chemical manufacturing, paper production, and water treatment.",
    quantity: "40,000 lbs"
  },
  {
    id: 2,
    name: "Citric Acid",
    category: "Organic Acids",
    description: "Anhydrous, food grade citric acid. Essential ingredient in food and beverage manufacturing, pharmaceutical formulations, and cleaning products.",
    quantity: "15,000 kgs"
  },
  {
    id: 3,
    name: "Glycerin",
    category: "Alcohols",
    description: "USP grade, 99.7% pure glycerin. Versatile ingredient used in pharmaceutical, personal care, and food applications. Known for its humectant properties.",
    quantity: "4 totes"
  },
  {
    id: 4,
    name: "Potassium Chloride",
    category: "Inorganic Chemicals",
    description: "High purity potassium chloride suitable for various industrial applications including fertilizers, pharmaceuticals, and food processing.",
    quantity: "25,000 kgs"
  },
  {
    id: 5,
    name: "Methanol",
    category: "Alcohols",
    description: "Technical grade methanol for industrial use. Essential solvent for various chemical processes and manufacturing applications.",
    quantity: "6 tankers"
  },
  {
    id: 6,
    name: "Sulfuric Acid",
    category: "Inorganic Acids",
    description: "Industrial grade sulfuric acid. Fundamental chemical for various industrial processes and manufacturing applications.",
    quantity: "3 rail cars"
  },
  {
    id: 7,
    name: "Ethylene Glycol",
    category: "Alcohols",
    description: "Industrial grade ethylene glycol. Widely used in antifreeze formulations and as a chemical intermediate.",
    quantity: "8 totes"
  },
  {
    id: 8,
    name: "Sodium Carbonate",
    category: "Inorganic Chemicals",
    description: "Pure soda ash suitable for various industrial applications. Essential in glass manufacturing and chemical processing.",
    quantity: "50,000 lbs"
  },
  {
    id: 9,
    name: "Acetic Acid",
    category: "Organic Acids",
    description: "Glacial acetic acid for industrial use. Key ingredient in various chemical processes and manufacturing applications.",
    quantity: "12 totes"
  },
  {
    id: 10,
    name: "Hydrogen Peroxide",
    category: "Oxidizing Agents",
    description: "Industrial strength hydrogen peroxide. Essential for bleaching, disinfection, and chemical synthesis.",
    quantity: "5 totes"
  }
];

export const categories = Array.from(new Set(chemicals.map(chem => chem.category)));