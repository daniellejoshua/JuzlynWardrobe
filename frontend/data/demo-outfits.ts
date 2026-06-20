export interface Outfit {
  id: string;
  name: string;
  description: string;
  image: string;
  colors: string[];
  occasion: string;
  season: string;
}

export const demoOutfits: Outfit[] = [
  {
    id: "1",
    name: "Classic Blazer Ensemble",
    description: "Timeless navy blazer with white shirt",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop",
    colors: ["navy", "white"],
    occasion: "business",
    season: "all",
  },
  {
    id: "2",
    name: "Casual Summer Dress",
    description: "Flowing linen dress perfect for warm days",
    image:
      "https://images.unsplash.com/photo-1572804419301-6b2c2ef11c18?w=300&h=400&fit=crop",
    colors: ["cream", "beige"],
    occasion: "casual",
    season: "summer",
  },
  {
    id: "3",
    name: "Evening Elegance",
    description: "Sophisticated black gown for special occasions",
    image:
      "https://images.unsplash.com/photo-1595777712802-e2c19842edd7?w=300&h=400&fit=crop",
    colors: ["black", "gold"],
    occasion: "formal",
    season: "all",
  },
  {
    id: "4",
    name: "Street Style Chic",
    description: "Trendy jeans with oversized sweater",
    image:
      "https://images.unsplash.com/photo-1525962211207-8a15e7f1731e?w=300&h=400&fit=crop",
    colors: ["grey", "denim"],
    occasion: "casual",
    season: "fall",
  },
  {
    id: "5",
    name: "Monochrome Minimalist",
    description: "All-white minimal outfit for modern look",
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf6f?w=300&h=400&fit=crop",
    colors: ["white"],
    occasion: "casual",
    season: "summer",
  },
  {
    id: "6",
    name: "Vintage Inspired",
    description: "Retro-styled outfit with classic pieces",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
    colors: ["burgundy", "cream"],
    occasion: "casual",
    season: "fall",
  },
  {
    id: "7",
    name: "Luxury Minimalist",
    description: "Premium materials in neutral tones",
    image:
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300&h=400&fit=crop",
    colors: ["beige", "brown"],
    occasion: "business",
    season: "winter",
  },
  {
    id: "8",
    name: "Bohemian Dream",
    description: "Free-spirited boho aesthetic",
    image:
      "https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=300&h=400&fit=crop",
    colors: ["mustard", "brown"],
    occasion: "casual",
    season: "summer",
  },
  {
    id: "9",
    name: "Professional Power",
    description: "Bold statement pieces for impact",
    image:
      "https://images.unsplash.com/photo-1551589985-acba8f45b703?w=300&h=400&fit=crop",
    colors: ["charcoal", "red"],
    occasion: "business",
    season: "all",
  },
  {
    id: "10",
    name: "Athletic Chic",
    description: "Sportswear with style for active lifestyle",
    image:
      "https://images.unsplash.com/photo-1506629082632-33565a1697a1?w=300&h=400&fit=crop",
    colors: ["black", "white"],
    occasion: "casual",
    season: "all",
  },
];
