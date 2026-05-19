export const BOUTIQUE_CONFIG = {
  name: "Amara Boutique",
  motto: "Exquisite Custom Stitches for the Modern Woman",
  admin: {
    email: "admin@amara.com",
    password: "password123"
  },
  contact: {
    phone: "+91 98765 43210",
    email: "contact@amaraboutique.com",
    address: "123 Elegance St, Fashion District, Bangalore"
  },
  services: [
    {
      id: "stitching",
      title: "Custom Stitching",
      description: "Perfectly tailored outfits designed to fit you like a second skin. We specialize in precise measurements and faultless finishing for all body types.",
      icon: "Scissors",
      image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217779/service_stitching_xglzyk.jpg",
      details: ["Blouse Stitching", "Dress Making", "Saree Fall & Picot", "Alterations"]
    },
    {
      id: "embroidery",
      title: "Fine Embroidery",
      description: "Intricate thread work, zardozi, and sequence embellishments by master artisans who bring patterns to life on any fabric.",
      icon: "Flower",
      image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217780/service_embroidery_oeixon.jpg",
      details: ["Hand Embroidery", "Machine Work", "Sequence Work", "Thread Art"]
    },
    {
      id: "arya-work",
      title: "Arya Work (Hand Work)",
      description: "Traditional hand-crafted aari work for a regal touch. Each piece is a masterpiece of patient craftsmanship and cultural heritage.",
      icon: "Sparkles",
      image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217780/service_arya_ftn1es.jpg",
      details: ["Bridal Blouses", "Maguam Work", "Bead Work", "Stone Fixing"]
    },
    {
      id: "uniforms",
      title: "School & Corporate Uniforms",
      description: "High-quality, durable uniforms for schools and businesses. We ensure comfort and professional standards in every stitch.",
      icon: "Briefcase",
      image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217781/service_uniform_olbanw.jpg",
      details: ["School Uniforms", "Hospital Scrubs", "Corporate Blazers", "Hotel Staff Attire"]
    },
    {
      id: "bridal",
      title: "Bridal Couture",
      description: "Creating your dream wedding ensemble with ultimate precision. From lehengas to reception gowns, we make you glow.",
      icon: "Heart",
      image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217779/service_bridal_ifc8ly.jpg",
      details: ["Bridal Lehengas", "Reception Gowns", "Engagement Sarees", "Bridesmaid Dresses"]
    }
  ],
  categories: [
    { id: "sarees", name: "Sarees", image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217783/saree_silk_po1xsi.jpg" },
    { id: "lehengas", name: "Lehengas", image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217781/lehenga_bridal_rmymce.jpg" },
    { id: "frocks", name: "Long Frocks", image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217780/variation_lehenga_prs2qt.jpg" },
    { id: "blouses", name: "Designer Blouses", image: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217779/variation_saree_y80fby.jpg" }
  ],
  themes: {
    blush: {
      name: "Blush Pink",
      primary: "#e9a3a3",
      secondary: "#4a3737",
      accent: "#fff9f9",
      background: "#fffcfc",
      text: "#4a3737"
    },
    midnight: {
      name: "Midnight Luxury",
      primary: "#d4af37",
      secondary: "#0a0a0a",
      accent: "#1a1a1a",
      background: "#050505",
      text: "#ffffff"
    },
    sage: {
      name: "Sage Minimalist",
      primary: "#84a59d",
      secondary: "#2f3e46",
      accent: "#f7ede2",
      background: "#fdf8f5",
      text: "#2f3e46"
    },
    noir: {
      name: "Noir Et Blanc",
      primary: "#000000",
      secondary: "#1a1a1a",
      accent: "#f5f5f5",
      background: "#ffffff",
      text: "#000000"
    }
  },
  currentTheme: "blush"
};

const generateProducts = () => {
  const products = [];
  const categoryKeys = ["sarees", "lehengas", "frocks", "blouses"];
  const images = {
    sarees: [
      "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217783/saree_silk_po1xsi.jpg",
      "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217779/variation_saree_y80fby.jpg"
    ],
    lehengas: [
      "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217781/lehenga_bridal_rmymce.jpg",
      "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217780/variation_lehenga_prs2qt.jpg"
    ],
    frocks: [
      "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217780/variation_lehenga_prs2qt.jpg",
      "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217783/saree_silk_po1xsi.jpg"
    ],
    blouses: [
      "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217779/variation_saree_y80fby.jpg",
      "https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217781/lehenga_bridal_rmymce.jpg"
    ]
  };

  categoryKeys.forEach(cat => {
    for (let i = 1; i <= 10; i++) {
      const discountedPrice = 1500 + (i * 250);
      const discount = i % 3 === 0 ? 20 : 0; // 20% discount on every 3rd item
      const actualPrice = discount > 0 ? Math.round(discountedPrice / (1 - discount/100)) : discountedPrice;

      products.push({
        id: `${cat}-${i}`,
        name: `${cat.charAt(0).toUpperCase() + cat.slice(0, -1)} Collection #${i}`,
        category: cat,
        price: actualPrice,
        discount: discount,
        discountedPrice: discountedPrice,
        image: images[cat][i % 2],
        images: [images[cat][0], images[cat][1], images[cat][i % 2]], // At least 3 images
        stock: i % 5 === 0 ? 0 : 10,
        description: `Premium quality ${cat} with hand-crafted details and exquisite fabric. Ideal for festive occasions.`
      });
    }
  });
  return products;
};

export const PRODUCTS = generateProducts();

export const MOCK_ORDERS = [
  { id: "ORD001", customer: "Priya Sharma", item: "Silk Saree Stitching", status: "In Progress", date: "2024-05-15", total: 2500 },
  { id: "ORD002", customer: "Anjali Rao", item: "Bridal Lehenga", status: "Completed", date: "2024-05-10", total: 15500 },
  { id: "ORD003", customer: "Sneha Kapoor", item: "Cotton Dress Material", status: "Delivered", date: "2024-05-08", total: 1200 },
  { id: "ORD004", customer: "Riya Sen", item: "Arya Work Blouse", status: "Cutting", date: "2024-05-18", total: 3500 }
];

export const MOCK_APPOINTMENTS = [
  { id: "APP001", customer: "Meera Nair", service: "Bridal Consultation", date: "2024-05-20", time: "10:30 AM", status: "Upcoming" },
  { id: "APP002", customer: "Saritha V", service: "Custom Stitching", date: "2024-05-21", time: "02:00 PM", status: "Upcoming" }
];
