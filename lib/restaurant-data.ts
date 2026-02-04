export const restaurants = [
  {
    id: 1,
    name: 'Urban Dhaba',
    cuisine: 'Contemporary Indian',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=90&fit=crop',
    slug: 'urban-dhaba',
    description: 'Experience authentic Indian flavors elevated to fine dining standards. Our signature dishes blend traditional recipes with modern culinary techniques.',
    openingHours: '11:30 AM - 11:00 PM',
    capacity: 'Up to 60 guests',
    address: 'Ground Floor, The Myriad Hotel',
    highlights: [
      'Award-winning chef',
      'Tandoori specialties',
      'Curated wine selection',
      'Private dining available',
    ],
    menu: {
      appetizers: [
        { name: 'Tandoori Paneer Tikka', price: '₹450', description: 'Grilled cottage cheese with spices' },
        { name: 'Chicken 65', price: '₹480', description: 'Spicy fried chicken bites' },
        { name: 'Vegetable Samosa', price: '₹180', description: 'Crispy pastry with spiced vegetables' },
      ],
      mains: [
        { name: 'Butter Chicken', price: '₹650', description: 'Creamy tomato-based curry' },
        { name: 'Dal Makhani', price: '₹450', description: 'Slow-cooked black lentils' },
        { name: 'Biryani', price: '₹750', description: 'Fragrant basmati rice with spices' },
      ],
      desserts: [
        { name: 'Gulab Jamun', price: '₹250', description: 'Sweet milk dumplings in syrup' },
        { name: 'Kulfi', price: '₹280', description: 'Traditional Indian ice cream' },
      ],
    },
  },
  {
    id: 2,
    name: 'Coastal Sea Food',
    cuisine: 'Fresh Seafood',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=90&fit=crop',
    slug: 'coastal-seafood',
    description: 'Dive into our exquisite seafood collection sourced daily from premium suppliers. Immerse yourself in the flavors of the ocean.',
    openingHours: '12:00 PM - 11:30 PM',
    capacity: 'Up to 80 guests',
    address: '2nd Floor, The Myriad Hotel',
    highlights: [
      'Fresh daily catch',
      'Chef\'s tasting menu',
      'Beachfront ambiance',
      'Sommelier-curated pairs',
    ],
    menu: {
      appetizers: [
        { name: 'Lobster Bisque', price: '₹850', description: 'Creamy soup with fresh lobster' },
        { name: 'Grilled Prawns', price: '₹750', description: 'Jumbo prawns with garlic butter' },
        { name: 'Fish Tacos', price: '₹550', description: 'Crispy fish with fresh salsa' },
      ],
      mains: [
        { name: 'Grilled Salmon', price: '₹1200', description: 'Atlantic salmon with herbs' },
        { name: 'Lobster Thermidor', price: '₹1800', description: 'Baked lobster with cheese' },
        { name: 'Seafood Platter', price: '₹2200', description: 'Assorted fresh seafood' },
      ],
      desserts: [
        { name: 'Key Lime Pie', price: '₹350', description: 'Tangy lime dessert' },
        { name: 'Chocolate Lava Cake', price: '₹380', description: 'Warm chocolate cake' },
      ],
    },
  },
  {
    id: 3,
    name: 'Winking Owl – The Lounge Bar',
    cuisine: 'Craft Cocktails & Tapas',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=90&fit=crop',
    slug: 'winking-owl',
    description: 'A sophisticated lounge bar featuring signature cocktails crafted by award-winning mixologists. Perfect for evening entertainment.',
    openingHours: '5:00 PM - 2:00 AM',
    capacity: 'Up to 100 guests',
    address: '3rd Floor, The Myriad Hotel',
    highlights: [
      'Craft cocktails',
      'Live music evenings',
      'Small plates menu',
      'Rooftop terrace',
    ],
    menu: {
      cocktails: [
        { name: 'Old Fashioned', price: '₹650', description: 'Whiskey, sugar, bitters' },
        { name: 'Mojito', price: '₹550', description: 'Rum, mint, lime, soda' },
        { name: 'Cosmopolitan', price: '₹600', description: 'Vodka, cranberry, lime' },
      ],
      tapas: [
        { name: 'Bruschetta', price: '₹380', description: 'Toasted bread with tomatoes' },
        { name: 'Chicken Wings', price: '₹450', description: 'Spicy buffalo wings' },
        { name: 'Cheese Platter', price: '₹650', description: 'Assorted cheeses and crackers' },
      ],
      desserts: [
        { name: 'Tiramisu', price: '₹350', description: 'Classic Italian dessert' },
        { name: 'Churros', price: '₹320', description: 'Spanish fried dough' },
      ],
    },
  },
];
