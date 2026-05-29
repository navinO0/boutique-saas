#!/bin/bash

API_BASE_URL="http://127.0.0.1:5000/api"
COMPANY_ID=1

# Login
LOGIN_RESP=$(curl -s -X POST "$API_BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amara.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESP | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Response: $LOGIN_RESP"
  exit 1
fi

echo "Login successful."

# Function to add item
add_item() {
  NAME=$1
  CAT=$2
  IMG=$3
  DESC=$4
  
  curl -s -X POST "$API_BASE_URL/catalog" \
    -H "Content-Type: application/json" \
    -H "X-Company-ID: $COMPANY_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"name\": \"$NAME\",
      \"category\": \"$CAT\",
      \"images\": [\"$IMG\"],
      \"description\": \"$DESC\"
    }"
  echo "Added: $NAME"
}

add_item "Transcendent Silk Bridal Set" "Bridal" "https://images.unsplash.com/photo-1583391733956-6c1630fc6e7a?w=1200" "A breathtaking bridal silhouette featuring 1500 hours of hand-embroidered zardozi. Created for an royal destination wedding in Udaipur."
add_item "Midnight Magnolia Gown" "Evening Wear" "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200" "Sculpted from deep midnight velvet with 3D floral appliqués. Designed with a dramatic 4-meter trail for a high-profile gala."
add_item "Crimson Heritage Saree Blouse" "Handwork" "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200" "Fine aari work on heritage raw silk. Each bead was hand-picked to match the customer's ancestral necklace."
add_item "Ethereal Beauty Artistry" "Beauty" "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200" "Custom beauty curation and artistry for the 'Modern Goddess' collection. Focusing on glass-skin aesthetics and artisanal pigments."

echo "Seeding complete!  "
