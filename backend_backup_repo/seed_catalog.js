const axios = require('axios');

const API_BASE_URL = 'http://127.0.0.1:5000/api';
const COMPANY_ID = 1;

const catalogItems = [
  {
    name: "Transcendent Silk Bridal Set",
    category: "Bridal",
    images: ["https://images.unsplash.com/photo-1583391733956-6c1630fc6e7a?w=1200", "https://images.unsplash.com/photo-1594132062137-ee134f59e099?w=1200"],
    description: "A breathtaking bridal silhouette featuring 1500 hours of hand-embroidered zardozi. Created for an royal destination wedding in Udaipur."
  },
  {
    name: "Midnight Magnolia Gown",
    category: "Evening Wear",
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200", "https://images.unsplash.com/photo-1539109132384-3b76961476f7?w=1200"],
    description: "Sculpted from deep midnight velvet with 3D floral appliqués. Designed with a dramatic 4-meter trail for a high-profile gala."
  },
  {
    name: "Crimson Heritage Saree Blouse",
    category: "Handwork",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200", "https://images.unsplash.com/photo-1610030469668-935102a9eecf?w=1200"],
    description: "Fine aari work on heritage raw silk. Each bead was hand-picked to match the customer's ancestral necklace."
  },
  {
    name: "Ethereal Beauty Artistry",
    category: "Beauty",
    images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200", "https://images.unsplash.com/photo-1512496015851-a90fb38ba496?w=1200"],
    description: "Custom beauty curation and artistry for the 'Modern Goddess' collection. Focusing on glass-skin aesthetics and artisanal pigments."
  }
];

async function seed() {
  try {
    console.log('Logging in...');
    const loginResp = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@amara.com',
      password: 'password123'
    });
    
    const token = loginResp.data.token;
    console.log('Login successful.');
    
    for (const item of catalogItems) {
      await axios.post(`${API_BASE_URL}/catalog`, item, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Company-ID': COMPANY_ID
        }
      });
      console.log(`Added: ${item.name}`);
    }
    console.log('Seeding complete! ✨');
  } catch (error) {
    if (error.response) {
      console.error('Seeding failed with response:', error.response.status, error.response.data);
    } else {
      console.error('Seeding failed:', error.message);
    }
  }
}

seed();
