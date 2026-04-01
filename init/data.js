const sampleListings = [
  {
    title: "Beach Cottage in Goa",
    description: "Relax in a peaceful beachfront cottage with sea breeze and sunset views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Goa",
    country: "India",
  },
  {
    title: "Houseboat in Kerala Backwaters",
    description: "Stay on a traditional Kerala houseboat surrounded by calm backwaters.",
    image: {
      filename: "listingimage",
      url: "https://img.freepik.com/premium-photo/houseboat-alappuzha-backwaters-kerala_78361-13401.jpg?w=2000",
    },
    price: 5000,
    location: "Alleppey",
    country: "India",
  },
  {
    title: "Mountain Stay in Manali",
    description: "Cozy wooden cottage surrounded by snow-capped Himalayas.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Manali",
    country: "India",
  },
  {
    title: "Royal Haveli in Jaipur",
    description: "Experience royal Rajasthani architecture and heritage stay.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Jaipur",
    country: "India",
  },
  {
    title: "Hill View Stay in Darjeeling",
    description: "Beautiful tea gardens and misty mountain views.",
    image: {
      filename: "listingimage",
      url: "https://th.bing.com/th/id/OIP.fRCe3YgmbP-elAgw4PYmbgHaF3?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    price: 2200,
    location: "Darjeeling",
    country: "India",
  },
  {
    title: "Luxury Villa in Udaipur",
    description: "Lake view villa with royal Rajasthani charm.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    },
    price: 6000,
    location: "Udaipur",
    country: "India",
  },
  {
    title: "Beach Resort in Andaman",
    description: "Crystal clear water and private beach experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60",
    },
    price: 4500,
    location: "Havelock Island",
    country: "India",
  },
  {
    title: "City Apartment in Mumbai",
    description: "Modern apartment in the heart of Mumbai city.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Mumbai",
    country: "India",
  },
  {
    title: "Tea Estate Stay in Coorg",
    description: "Stay inside lush green coffee plantations.",
    image: {
      filename: "listingimage",
      url: "https://tse4.mm.bing.net/th/id/OIP.cIi5lbtjgdCtiyenZ0xiSgHaE5?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    price: 1800,
    location: "Coorg",
    country: "India",
  },
  {
    title: "Desert Camp in Jaisalmer",
    description: "Camel rides and desert sunset cultural experience.",
    image: {
      filename: "listingimage",
      url: "https://th.bing.com/th/id/OIP.mwvz4N8dKWbppcneVqwlVwHaEK?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    price: 2000,
    location: "Jaisalmer",
    country: "India",
  },
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Portland",
    country: "United States",
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
  },
  {
    title: "Rustic Cabin by the Lake",
    description:
      "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
  }
];

module.exports = { data: sampleListings };