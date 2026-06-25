export interface Outfit {
  id: string;
  name: string;
  image_url: string;
  clothing_type: string;
  category: string;
  primary_color: string | null;
  style_tags: string[];
  occasion: string | null;
}

export const demoOutfits: Outfit[] = [
  {
    id: "1",
    name: "Navy Blazer Jacket",
    image_url:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop",
    clothing_type: "Jacket",
    category: "Business",
    primary_color: "navy,white",
    style_tags: ["classic", "blazer"],
    occasion: "business",
  },
  {
    id: "2",
    name: "Cream Linen Dress",
    image_url:
      "https://images.unsplash.com/photo-1572804419301-6b2c2ef11c18?w=300&h=400&fit=crop",
    clothing_type: "Dress",
    category: "Casual",
    primary_color: "cream,beige",
    style_tags: ["linen", "flowing"],
    occasion: "casual",
  },
  {
    id: "3",
    name: "Black Gold Gown",
    image_url:
      "https://images.unsplash.com/photo-1595777712802-e2c19842edd7?w=300&h=400&fit=crop",
    clothing_type: "Dress",
    category: "Formal",
    primary_color: "black,gold",
    style_tags: ["elegant", "gown"],
    occasion: "formal",
  },
  {
    id: "4",
    name: "Grey Denim Top",
    image_url:
      "https://images.unsplash.com/photo-1525962211207-8a15e7f1731e?w=300&h=400&fit=crop",
    clothing_type: "Top",
    category: "Casual",
    primary_color: "grey,denim",
    style_tags: ["trendy", "comfortable"],
    occasion: "casual",
  },
  {
    id: "5",
    name: "White Minimal Top",
    image_url:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf6f?w=300&h=400&fit=crop",
    clothing_type: "Top",
    category: "Casual",
    primary_color: "white",
    style_tags: ["minimal", "modern"],
    occasion: "casual",
  },
  {
    id: "6",
    name: "Burgundy Vintage Dress",
    image_url:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
    clothing_type: "Dress",
    category: "Vintage",
    primary_color: "burgundy,cream",
    style_tags: ["retro", "classic"],
    occasion: "casual",
  },
  {
    id: "7",
    name: "Beige Business Blouse",
    image_url:
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300&h=400&fit=crop",
    clothing_type: "Top",
    category: "Business",
    primary_color: "beige,brown",
    style_tags: ["premium", "neutral"],
    occasion: "business",
  },
  {
    id: "8",
    name: "Mustard Boho Dress",
    image_url:
      "https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=300&h=400&fit=crop",
    clothing_type: "Dress",
    category: "Bohemian",
    primary_color: "mustard,brown",
    style_tags: ["boho", "free-spirited"],
    occasion: "casual",
  },
  {
    id: "9",
    name: "Charcoal Statement Jacket",
    image_url:
      "https://images.unsplash.com/photo-1551589985-acba8f45b703?w=300&h=400&fit=crop",
    clothing_type: "Jacket",
    category: "Business",
    primary_color: "charcoal,red",
    style_tags: ["bold", "statement"],
    occasion: "business",
  },
  {
    id: "10",
    name: "Black Athletic Tee",
    image_url:
      "https://images.unsplash.com/photo-1506629082632-33565a1697a1?w=300&h=400&fit=crop",
    clothing_type: "Top",
    category: "Athletic",
    primary_color: "black,white",
    style_tags: ["sportswear", "active"],
    occasion: "casual",
  },
];
