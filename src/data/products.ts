export interface Chemical {
  id: number;
  name: string;
  category: string;
  description: string;
  cas: string;
  quantity: string;
  location: string;
}

export const chemicals: Chemical[] = [
  {
    id: 1,
    name: "Sodium Hydroxide",
    category: "Inorganic Chemicals",
    description: "Caustic soda in pellet form, technical grade",
    cas: "1310-73-2",
    quantity: "40,000 lbs",
    location: "Wisconsin"
  },
  {
    id: 2,
    name: "Citric Acid",
    category: "Organic Acids",
    description: "Anhydrous, food grade",
    cas: "77-92-9",
    quantity: "15,000 kgs",
    location: "South Carolina"
  },
  {
    id: 3,
    name: "Glycerin",
    category: "Alcohols",
    description: "USP grade, 99.7%",
    cas: "56-81-5",
    quantity: "4 totes",
    location: "Texas"
  }
];

export const categories = Array.from(new Set(chemicals.map(chem => chem.category)));