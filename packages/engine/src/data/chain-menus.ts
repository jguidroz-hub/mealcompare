/**
 * Top 50 Chain Restaurants — Canonical Menu Items
 * 
 * Phase 2: Menu normalization for popular chains.
 * Each chain has a list of canonical menu items with expected base prices.
 * These are used to match items across platforms and detect markup.
 * 
 * Prices are in cents, representing typical direct/in-store pricing (2026).
 * Platform prices will be compared against these baselines.
 */

export interface ChainMenuItem {
  name: string;
  category: string; // 'entree' | 'side' | 'drink' | 'dessert' | 'combo'
  basePrice: number; // cents, typical direct/in-store price
  aliases?: string[]; // alternate names on different platforms
}

export interface ChainMenu {
  chainName: string;
  slug: string;
  category: string;
  menuItems: ChainMenuItem[];
}

export const TOP_CHAINS: ChainMenu[] = [
  {
    chainName: "McDonald's",
    slug: 'mcdonalds',
    category: 'burgers',
    menuItems: [
      { name: 'Big Mac', category: 'entree', basePrice: 599, aliases: ['big mac sandwich'] },
      { name: 'Quarter Pounder with Cheese', category: 'entree', basePrice: 649, aliases: ['qpc', 'quarter pounder cheese'] },
      { name: 'McChicken', category: 'entree', basePrice: 199 },
      { name: '10 Piece Chicken McNuggets', category: 'entree', basePrice: 549, aliases: ['10pc mcnuggets', '10 pc chicken mcnuggets'] },
      { name: 'Double Cheeseburger', category: 'entree', basePrice: 349 },
      { name: 'Filet-O-Fish', category: 'entree', basePrice: 549, aliases: ['filet o fish'] },
      { name: 'Large Fries', category: 'side', basePrice: 449, aliases: ['french fries large', 'lg fries'] },
      { name: 'Medium Fries', category: 'side', basePrice: 349, aliases: ['french fries medium', 'md fries'] },
      { name: 'Large Coca-Cola', category: 'drink', basePrice: 199, aliases: ['large coke'] },
      { name: 'McFlurry with Oreo', category: 'dessert', basePrice: 449, aliases: ['oreo mcflurry'] },
      { name: 'Big Mac Meal', category: 'combo', basePrice: 999, aliases: ['big mac combo'] },
      { name: 'Egg McMuffin', category: 'entree', basePrice: 449 },
      { name: 'Sausage McMuffin with Egg', category: 'entree', basePrice: 499 },
      { name: 'Hash Browns', category: 'side', basePrice: 199 },
      { name: 'Apple Pie', category: 'dessert', basePrice: 199, aliases: ['baked apple pie'] },
    ],
  },
  {
    chainName: 'Chipotle',
    slug: 'chipotle',
    category: 'mexican',
    menuItems: [
      { name: 'Burrito Bowl', category: 'entree', basePrice: 1095, aliases: ['burrito bowl chicken', 'chicken burrito bowl'] },
      { name: 'Chicken Burrito', category: 'entree', basePrice: 1095, aliases: ['burrito chicken'] },
      { name: 'Steak Burrito Bowl', category: 'entree', basePrice: 1245, aliases: ['burrito bowl steak'] },
      { name: 'Chicken Quesadilla', category: 'entree', basePrice: 1095 },
      { name: 'Chips and Guacamole', category: 'side', basePrice: 595, aliases: ['chips guac', 'chips & guacamole'] },
      { name: 'Chips and Queso Blanco', category: 'side', basePrice: 495, aliases: ['chips queso'] },
      { name: 'Side of Guacamole', category: 'side', basePrice: 310 },
      { name: 'Large Chips', category: 'side', basePrice: 245 },
      { name: 'Mexican Coca-Cola', category: 'drink', basePrice: 345 },
      { name: 'Sofritas Burrito Bowl', category: 'entree', basePrice: 995 },
    ],
  },
  {
    chainName: "Chick-fil-A",
    slug: 'chick-fil-a',
    category: 'chicken',
    menuItems: [
      { name: 'Chick-fil-A Chicken Sandwich', category: 'entree', basePrice: 569, aliases: ['original chicken sandwich', 'chicken sandwich'] },
      { name: 'Spicy Chicken Sandwich', category: 'entree', basePrice: 609, aliases: ['spicy deluxe sandwich'] },
      { name: '12-count Chicken Nuggets', category: 'entree', basePrice: 589, aliases: ['12 pc nuggets', '12 count nuggets'] },
      { name: '8-count Chicken Nuggets', category: 'entree', basePrice: 489, aliases: ['8 pc nuggets'] },
      { name: 'Waffle Fries Medium', category: 'side', basePrice: 259, aliases: ['waffle potato fries medium'] },
      { name: 'Waffle Fries Large', category: 'side', basePrice: 309, aliases: ['waffle potato fries large'] },
      { name: 'Chicken Biscuit', category: 'entree', basePrice: 419 },
      { name: 'Chick-fil-A Cool Wrap', category: 'entree', basePrice: 789 },
      { name: 'Large Lemonade', category: 'drink', basePrice: 279 },
      { name: 'Chicken Sandwich Meal', category: 'combo', basePrice: 899, aliases: ['chick fil a sandwich meal'] },
      { name: 'Mac & Cheese', category: 'side', basePrice: 389, aliases: ['mac and cheese'] },
      { name: 'Chicken Soup', category: 'side', basePrice: 489, aliases: ['chicken tortilla soup'] },
    ],
  },
  {
    chainName: 'Subway',
    slug: 'subway',
    category: 'sandwiches',
    menuItems: [
      { name: 'Italian BMT Footlong', category: 'entree', basePrice: 899, aliases: ['footlong italian bmt'] },
      { name: 'Turkey Breast Footlong', category: 'entree', basePrice: 849, aliases: ['footlong turkey breast'] },
      { name: 'Meatball Marinara Footlong', category: 'entree', basePrice: 799, aliases: ['footlong meatball marinara'] },
      { name: 'Steak & Cheese Footlong', category: 'entree', basePrice: 949, aliases: ['footlong steak cheese', 'philly cheesesteak footlong'] },
      { name: 'Chicken Teriyaki Footlong', category: 'entree', basePrice: 899, aliases: ['footlong sweet onion chicken teriyaki'] },
      { name: 'Tuna Footlong', category: 'entree', basePrice: 899, aliases: ['footlong tuna'] },
      { name: 'Cookie', category: 'dessert', basePrice: 99, aliases: ['chocolate chip cookie'] },
      { name: 'Chips', category: 'side', basePrice: 179 },
      { name: 'Fountain Drink', category: 'drink', basePrice: 229 },
    ],
  },
  {
    chainName: "Taco Bell",
    slug: 'taco-bell',
    category: 'mexican',
    menuItems: [
      { name: 'Crunchy Taco', category: 'entree', basePrice: 199 },
      { name: 'Crunchy Taco Supreme', category: 'entree', basePrice: 249 },
      { name: 'Burrito Supreme', category: 'entree', basePrice: 449 },
      { name: 'Chalupa Supreme', category: 'entree', basePrice: 399 },
      { name: 'Cheesy Gordita Crunch', category: 'entree', basePrice: 449 },
      { name: 'Mexican Pizza', category: 'entree', basePrice: 549 },
      { name: 'Quesadilla Chicken', category: 'entree', basePrice: 549, aliases: ['chicken quesadilla'] },
      { name: 'Crunchwrap Supreme', category: 'entree', basePrice: 549 },
      { name: 'Nachos BellGrande', category: 'entree', basePrice: 549 },
      { name: 'Baja Blast Large', category: 'drink', basePrice: 299, aliases: ['large mtn dew baja blast'] },
      { name: 'Cinnamon Twists', category: 'side', basePrice: 199 },
    ],
  },
  {
    chainName: "Wendy's",
    slug: 'wendys',
    category: 'burgers',
    menuItems: [
      { name: "Dave's Single", category: 'entree', basePrice: 599, aliases: ['daves single'] },
      { name: "Dave's Double", category: 'entree', basePrice: 749, aliases: ['daves double'] },
      { name: 'Baconator', category: 'entree', basePrice: 849 },
      { name: 'Spicy Chicken Sandwich', category: 'entree', basePrice: 599 },
      { name: 'Jr. Bacon Cheeseburger', category: 'entree', basePrice: 299, aliases: ['jr bacon cheeseburger'] },
      { name: '10 Piece Nuggets', category: 'entree', basePrice: 549, aliases: ['10pc chicken nuggets'] },
      { name: 'Large Fries', category: 'side', basePrice: 349 },
      { name: 'Chili Large', category: 'side', basePrice: 449 },
      { name: 'Frosty Medium', category: 'dessert', basePrice: 299, aliases: ['medium chocolate frosty'] },
      { name: 'Biggie Bag', category: 'combo', basePrice: 599 },
    ],
  },
  {
    chainName: 'Burger King',
    slug: 'burger-king',
    category: 'burgers',
    menuItems: [
      { name: 'Whopper', category: 'entree', basePrice: 699 },
      { name: 'Whopper with Cheese', category: 'entree', basePrice: 749, aliases: ['whopper cheese'] },
      { name: 'Double Whopper', category: 'entree', basePrice: 849 },
      { name: 'Chicken Fries', category: 'entree', basePrice: 449 },
      { name: 'Original Chicken Sandwich', category: 'entree', basePrice: 549 },
      { name: 'Impossible Whopper', category: 'entree', basePrice: 799 },
      { name: 'Large Fries', category: 'side', basePrice: 349 },
      { name: 'Onion Rings Medium', category: 'side', basePrice: 299 },
      { name: 'Whopper Meal', category: 'combo', basePrice: 1099, aliases: ['whopper combo'] },
    ],
  },
  {
    chainName: "Popeyes",
    slug: 'popeyes',
    category: 'chicken',
    menuItems: [
      { name: 'Chicken Sandwich', category: 'entree', basePrice: 549, aliases: ['classic chicken sandwich'] },
      { name: 'Spicy Chicken Sandwich', category: 'entree', basePrice: 549 },
      { name: '3 Piece Chicken Tenders', category: 'entree', basePrice: 549, aliases: ['3pc tenders'] },
      { name: '5 Piece Chicken Tenders', category: 'entree', basePrice: 749, aliases: ['5pc tenders'] },
      { name: '2 Piece Mixed Chicken', category: 'entree', basePrice: 599, aliases: ['2pc chicken'] },
      { name: 'Cajun Fries Regular', category: 'side', basePrice: 299, aliases: ['cajun fries'] },
      { name: 'Red Beans and Rice', category: 'side', basePrice: 249 },
      { name: 'Biscuit', category: 'side', basePrice: 149 },
      { name: 'Mashed Potatoes', category: 'side', basePrice: 249, aliases: ['mashed potatoes with cajun gravy'] },
    ],
  },
  {
    chainName: "Domino's",
    slug: 'dominos',
    category: 'pizza',
    menuItems: [
      { name: 'Large Hand Tossed Pepperoni', category: 'entree', basePrice: 1299, aliases: ['pepperoni pizza large'] },
      { name: 'Large Hand Tossed Cheese', category: 'entree', basePrice: 1099, aliases: ['cheese pizza large'] },
      { name: 'Medium 2-Topping Pizza', category: 'entree', basePrice: 999 },
      { name: 'Chicken Wings 8pc', category: 'side', basePrice: 899, aliases: ['8 piece chicken wings'] },
      { name: 'Breadsticks', category: 'side', basePrice: 599 },
      { name: 'Stuffed Cheesy Bread', category: 'side', basePrice: 699 },
      { name: 'Cinnamon Bread Twists', category: 'dessert', basePrice: 599 },
      { name: '2 Liter Coca-Cola', category: 'drink', basePrice: 349 },
    ],
  },
  {
    chainName: 'Pizza Hut',
    slug: 'pizza-hut',
    category: 'pizza',
    menuItems: [
      { name: 'Large Pepperoni Pizza', category: 'entree', basePrice: 1399 },
      { name: 'Large Cheese Pizza', category: 'entree', basePrice: 1199 },
      { name: 'Medium Meat Lovers', category: 'entree', basePrice: 1299, aliases: ["meat lover's pizza medium"] },
      { name: 'Breadsticks', category: 'side', basePrice: 599 },
      { name: 'Garlic Knots', category: 'side', basePrice: 599 },
      { name: 'Cinnabon Mini Rolls', category: 'dessert', basePrice: 599 },
      { name: 'WingStreet Wings 8pc', category: 'side', basePrice: 999 },
    ],
  },
  {
    chainName: "Papa John's",
    slug: 'papa-johns',
    category: 'pizza',
    menuItems: [
      { name: 'Large Pepperoni Pizza', category: 'entree', basePrice: 1499 },
      { name: 'Large Cheese Pizza', category: 'entree', basePrice: 1199 },
      { name: 'Garlic Knots', category: 'side', basePrice: 599 },
      { name: 'Breadsticks', category: 'side', basePrice: 699 },
      { name: 'Garlic Sauce', category: 'side', basePrice: 75 },
      { name: 'Chocolate Chip Cookie', category: 'dessert', basePrice: 699 },
      { name: 'Pepsi 2 Liter', category: 'drink', basePrice: 349 },
    ],
  },
  {
    chainName: 'Panda Express',
    slug: 'panda-express',
    category: 'chinese',
    menuItems: [
      { name: 'Orange Chicken', category: 'entree', basePrice: 599, aliases: ['the original orange chicken'] },
      { name: 'Plate (2 Entrees + 1 Side)', category: 'combo', basePrice: 1099, aliases: ['plate'] },
      { name: 'Bowl (1 Entree + 1 Side)', category: 'combo', basePrice: 899, aliases: ['bowl'] },
      { name: 'Beijing Beef', category: 'entree', basePrice: 599 },
      { name: 'Kung Pao Chicken', category: 'entree', basePrice: 599 },
      { name: 'Broccoli Beef', category: 'entree', basePrice: 599 },
      { name: 'Chow Mein', category: 'side', basePrice: 449 },
      { name: 'Fried Rice', category: 'side', basePrice: 449 },
      { name: 'Egg Roll', category: 'side', basePrice: 249 },
      { name: 'Cream Cheese Rangoon (3pc)', category: 'side', basePrice: 249 },
    ],
  },
  {
    chainName: 'Wingstop',
    slug: 'wingstop',
    category: 'wings',
    menuItems: [
      { name: '10 Piece Classic Wings', category: 'entree', basePrice: 1599, aliases: ['10pc classic wings'] },
      { name: '10 Piece Boneless Wings', category: 'entree', basePrice: 1399, aliases: ['10pc boneless wings'] },
      { name: '6 Piece Classic Wings', category: 'entree', basePrice: 1099, aliases: ['6pc classic wings'] },
      { name: 'Large Cajun Fried Corn', category: 'side', basePrice: 499 },
      { name: 'Large Seasoned Fries', category: 'side', basePrice: 449 },
      { name: 'Ranch Dip', category: 'side', basePrice: 99 },
    ],
  },
  {
    chainName: 'Panera Bread',
    slug: 'panera',
    category: 'sandwiches',
    menuItems: [
      { name: 'Broccoli Cheddar Soup Bread Bowl', category: 'entree', basePrice: 999, aliases: ['broccoli cheddar soup in bread bowl'] },
      { name: 'Bacon Turkey Bravo', category: 'entree', basePrice: 1049 },
      { name: 'Fuji Apple Chicken Salad', category: 'entree', basePrice: 1149 },
      { name: 'Mac & Cheese', category: 'entree', basePrice: 899, aliases: ['mac and cheese'] },
      { name: 'Frontega Chicken Panini', category: 'entree', basePrice: 1049 },
      { name: 'Mediterranean Veggie Sandwich', category: 'entree', basePrice: 949 },
      { name: 'Baguette', category: 'side', basePrice: 349 },
      { name: 'Apple', category: 'side', basePrice: 149 },
      { name: 'Cookie', category: 'dessert', basePrice: 349 },
      { name: 'Large Coffee', category: 'drink', basePrice: 299 },
    ],
  },
  {
    chainName: "Five Guys",
    slug: 'five-guys',
    category: 'burgers',
    menuItems: [
      { name: 'Cheeseburger', category: 'entree', basePrice: 1199 },
      { name: 'Little Cheeseburger', category: 'entree', basePrice: 899 },
      { name: 'Bacon Cheeseburger', category: 'entree', basePrice: 1399 },
      { name: 'Hamburger', category: 'entree', basePrice: 1049 },
      { name: 'Little Hamburger', category: 'entree', basePrice: 799 },
      { name: 'Hot Dog', category: 'entree', basePrice: 749 },
      { name: 'Regular Fries', category: 'side', basePrice: 599, aliases: ['fries regular'] },
      { name: 'Cajun Fries Regular', category: 'side', basePrice: 599, aliases: ['cajun fries'] },
      { name: 'Veggie Sandwich', category: 'entree', basePrice: 649 },
      { name: 'Grilled Cheese', category: 'entree', basePrice: 549 },
    ],
  },
  {
    chainName: 'Starbucks',
    slug: 'starbucks',
    category: 'cafe',
    menuItems: [
      { name: 'Grande Caffe Latte', category: 'drink', basePrice: 595, aliases: ['caffe latte grande'] },
      { name: 'Venti Iced Coffee', category: 'drink', basePrice: 395, aliases: ['iced coffee venti'] },
      { name: 'Grande Caramel Macchiato', category: 'drink', basePrice: 635, aliases: ['caramel macchiato grande'] },
      { name: 'Grande Cold Brew', category: 'drink', basePrice: 495, aliases: ['cold brew grande'] },
      { name: 'Grande Pumpkin Spice Latte', category: 'drink', basePrice: 695, aliases: ['psl grande'] },
      { name: 'Bacon Gouda Breakfast Sandwich', category: 'entree', basePrice: 495 },
      { name: 'Sausage Cheddar Egg Sandwich', category: 'entree', basePrice: 445 },
      { name: 'Cake Pop', category: 'dessert', basePrice: 345 },
      { name: 'Chocolate Croissant', category: 'dessert', basePrice: 395 },
    ],
  },
  {
    chainName: 'Chipotle Mexican Grill', // some platforms list full name
    slug: 'chipotle-2',
    category: 'mexican',
    menuItems: [], // redirect to chipotle
  },
  {
    chainName: "Raising Cane's",
    slug: 'raising-canes',
    category: 'chicken',
    menuItems: [
      { name: 'The Box Combo', category: 'combo', basePrice: 999, aliases: ['box combo'] },
      { name: 'The 3 Finger Combo', category: 'combo', basePrice: 799, aliases: ['3 finger combo'] },
      { name: 'The Caniac Combo', category: 'combo', basePrice: 1599, aliases: ['caniac combo', '6 finger combo'] },
      { name: 'Chicken Fingers (3)', category: 'entree', basePrice: 599 },
      { name: 'Crinkle-Cut Fries', category: 'side', basePrice: 249 },
      { name: 'Texas Toast', category: 'side', basePrice: 99 },
      { name: 'Coleslaw', category: 'side', basePrice: 149 },
      { name: "Cane's Sauce", category: 'side', basePrice: 49 },
    ],
  },
  {
    chainName: 'Whataburger',
    slug: 'whataburger',
    category: 'burgers',
    menuItems: [
      { name: 'Whataburger', category: 'entree', basePrice: 599, aliases: ['original whataburger'] },
      { name: 'Double Meat Whataburger', category: 'entree', basePrice: 799 },
      { name: 'Patty Melt', category: 'entree', basePrice: 599 },
      { name: 'Honey BBQ Chicken Strip Sandwich', category: 'entree', basePrice: 649 },
      { name: '#1 Whataburger Whatameal', category: 'combo', basePrice: 949, aliases: ['whataburger meal'] },
      { name: 'Large Fries', category: 'side', basePrice: 349 },
      { name: 'Large Onion Rings', category: 'side', basePrice: 399 },
      { name: 'Honey Butter Chicken Biscuit', category: 'entree', basePrice: 449 },
    ],
  },
  {
    chainName: 'Sonic Drive-In',
    slug: 'sonic',
    category: 'burgers',
    menuItems: [
      { name: 'Cheeseburger', category: 'entree', basePrice: 599 },
      { name: 'SuperSONIC Bacon Double Cheeseburger', category: 'entree', basePrice: 799 },
      { name: 'Popcorn Chicken', category: 'entree', basePrice: 449 },
      { name: 'Large Tots', category: 'side', basePrice: 349, aliases: ['tater tots large'] },
      { name: 'Large Cherry Limeade', category: 'drink', basePrice: 349 },
      { name: 'Large Ocean Water', category: 'drink', basePrice: 349 },
      { name: 'Medium Blast', category: 'dessert', basePrice: 549, aliases: ['oreo blast medium'] },
    ],
  },
  {
    chainName: "Dunkin'",
    slug: 'dunkin',
    category: 'cafe',
    menuItems: [
      { name: 'Medium Iced Coffee', category: 'drink', basePrice: 349 },
      { name: 'Medium Hot Coffee', category: 'drink', basePrice: 249 },
      { name: 'Medium Cold Brew', category: 'drink', basePrice: 399 },
      { name: 'Medium Caramel Swirl Iced Latte', category: 'drink', basePrice: 529 },
      { name: 'Bacon Egg and Cheese Bagel', category: 'entree', basePrice: 549 },
      { name: 'Sausage Egg and Cheese Croissant', category: 'entree', basePrice: 549 },
      { name: 'Half Dozen Donuts', category: 'dessert', basePrice: 699 },
      { name: 'Dozen Donuts', category: 'dessert', basePrice: 1199, aliases: ['box of donuts'] },
      { name: 'Hash Browns', category: 'side', basePrice: 199 },
      { name: 'Munchkins (25)', category: 'dessert', basePrice: 699 },
    ],
  },
  {
    chainName: "Arby's",
    slug: 'arbys',
    category: 'sandwiches',
    menuItems: [
      { name: 'Classic Roast Beef', category: 'entree', basePrice: 549 },
      { name: 'Beef n Cheddar Classic', category: 'entree', basePrice: 549 },
      { name: 'Chicken Bacon Swiss', category: 'entree', basePrice: 749 },
      { name: 'Curly Fries Medium', category: 'side', basePrice: 299 },
      { name: 'Jamocha Shake', category: 'dessert', basePrice: 449 },
      { name: 'Mozzarella Sticks (4pc)', category: 'side', basePrice: 399 },
    ],
  },
  {
    chainName: 'KFC',
    slug: 'kfc',
    category: 'chicken',
    menuItems: [
      { name: '8 Piece Chicken Bucket', category: 'entree', basePrice: 2499, aliases: ['8pc bucket'] },
      { name: '3 Piece Chicken Tenders', category: 'entree', basePrice: 649 },
      { name: 'Famous Bowl', category: 'entree', basePrice: 649 },
      { name: 'Chicken Sandwich', category: 'entree', basePrice: 549 },
      { name: 'Mashed Potatoes and Gravy', category: 'side', basePrice: 249 },
      { name: 'Coleslaw', category: 'side', basePrice: 249 },
      { name: 'Mac & Cheese', category: 'side', basePrice: 249 },
      { name: 'Biscuit', category: 'side', basePrice: 149 },
    ],
  },
  {
    chainName: 'Chipotle',
    slug: 'chipotle-duplicate',
    category: 'mexican',
    menuItems: [], // redirect
  },
  {
    chainName: 'In-N-Out Burger',
    slug: 'in-n-out',
    category: 'burgers',
    menuItems: [
      { name: 'Double-Double', category: 'entree', basePrice: 549 },
      { name: 'Cheeseburger', category: 'entree', basePrice: 399 },
      { name: 'Hamburger', category: 'entree', basePrice: 349 },
      { name: 'French Fries', category: 'side', basePrice: 249 },
      { name: 'Shake', category: 'dessert', basePrice: 299 },
      { name: 'Animal Style Burger', category: 'entree', basePrice: 549, aliases: ['double double animal style'] },
    ],
  },
  {
    chainName: 'Shake Shack',
    slug: 'shake-shack',
    category: 'burgers',
    menuItems: [
      { name: 'ShackBurger', category: 'entree', basePrice: 799, aliases: ['shack burger'] },
      { name: 'SmokeShack', category: 'entree', basePrice: 949 },
      { name: 'Chick\'n Shack', category: 'entree', basePrice: 849 },
      { name: 'Fries', category: 'side', basePrice: 399 },
      { name: 'Cheese Fries', category: 'side', basePrice: 499 },
      { name: 'Vanilla Shake', category: 'dessert', basePrice: 649 },
      { name: 'Chocolate Shake', category: 'dessert', basePrice: 649 },
      { name: 'Concrete', category: 'dessert', basePrice: 599 },
    ],
  },
  {
    chainName: "Jersey Mike's",
    slug: 'jersey-mikes',
    category: 'sandwiches',
    menuItems: [
      { name: 'Regular #13 The Original Italian', category: 'entree', basePrice: 1049, aliases: ['13 original italian regular'] },
      { name: 'Regular #7 Turkey and Provolone', category: 'entree', basePrice: 999, aliases: ['7 turkey provolone'] },
      { name: 'Regular #6 Roast Beef and Provolone', category: 'entree', basePrice: 1099, aliases: ['6 roast beef provolone'] },
      { name: 'Regular Chipotle Cheese Steak', category: 'entree', basePrice: 1149 },
      { name: 'Regular Club Supreme', category: 'entree', basePrice: 1149 },
    ],
  },
  {
    chainName: 'CAVA',
    slug: 'cava',
    category: 'mediterranean',
    menuItems: [
      { name: 'Greens + Grains Bowl', category: 'entree', basePrice: 1099 },
      { name: 'Pita', category: 'entree', basePrice: 1099 },
      { name: 'Grilled Chicken', category: 'entree', basePrice: 0, aliases: ['chicken protein'] },
      { name: 'Braised Lamb', category: 'entree', basePrice: 250 },
      { name: 'Hummus', category: 'side', basePrice: 0 },
      { name: 'Crazy Feta', category: 'side', basePrice: 125 },
      { name: 'Pita Chips', category: 'side', basePrice: 299 },
    ],
  },
  {
    chainName: 'Sweetgreen',
    slug: 'sweetgreen',
    category: 'healthy',
    menuItems: [
      { name: 'Harvest Bowl', category: 'entree', basePrice: 1295 },
      { name: 'Crispy Rice Bowl', category: 'entree', basePrice: 1395 },
      { name: 'Kale Caesar', category: 'entree', basePrice: 1195 },
      { name: 'Custom Salad', category: 'entree', basePrice: 1195 },
      { name: 'Bread', category: 'side', basePrice: 195 },
      { name: 'Limeade', category: 'drink', basePrice: 395 },
    ],
  },
  {
    chainName: 'Firehouse Subs',
    slug: 'firehouse-subs',
    category: 'sandwiches',
    menuItems: [
      { name: 'Medium Hook & Ladder', category: 'entree', basePrice: 899 },
      { name: 'Medium Smokehouse Beef & Cheddar', category: 'entree', basePrice: 999 },
      { name: 'Medium Turkey Bacon Ranch', category: 'entree', basePrice: 949 },
      { name: 'Medium Meatball', category: 'entree', basePrice: 849 },
    ],
  },
  {
    chainName: 'Zaxby\'s',
    slug: 'zaxbys',
    category: 'chicken',
    menuItems: [
      { name: 'Chicken Fingerz Plate', category: 'combo', basePrice: 899 },
      { name: 'Signature Sandwich', category: 'entree', basePrice: 699 },
      { name: 'Wings & Things', category: 'combo', basePrice: 999 },
      { name: 'Kickin Chicken Sandwich', category: 'entree', basePrice: 749 },
      { name: 'Crinkle Fries', category: 'side', basePrice: 249 },
      { name: 'Texas Toast', category: 'side', basePrice: 99 },
    ],
  },
  {
    chainName: 'Jack in the Box',
    slug: 'jack-in-the-box',
    category: 'burgers',
    menuItems: [
      { name: 'Jumbo Jack', category: 'entree', basePrice: 449 },
      { name: 'Jumbo Jack with Cheese', category: 'entree', basePrice: 499 },
      { name: '2 Tacos', category: 'entree', basePrice: 199, aliases: ['two tacos'] },
      { name: 'Spicy Chicken Sandwich', category: 'entree', basePrice: 549 },
      { name: 'Curly Fries Medium', category: 'side', basePrice: 299 },
      { name: 'Egg Roll (3pc)', category: 'side', basePrice: 349 },
      { name: 'Large Oreo Cookie Shake', category: 'dessert', basePrice: 549 },
    ],
  },
  {
    chainName: 'Noodles & Company',
    slug: 'noodles-company',
    category: 'restaurant',
    menuItems: [
      { name: 'Regular Wisconsin Mac & Cheese', category: 'entree', basePrice: 849, aliases: ['wisconsin mac and cheese'] },
      { name: 'Regular Penne Rosa', category: 'entree', basePrice: 849 },
      { name: 'Regular Pad Thai', category: 'entree', basePrice: 899 },
      { name: 'Regular Japanese Pan Noodles', category: 'entree', basePrice: 849 },
      { name: 'Crispy', category: 'side', basePrice: 399 },
    ],
  },
  {
    chainName: 'Tropical Smoothie Cafe',
    slug: 'tropical-smoothie',
    category: 'cafe',
    menuItems: [
      { name: 'Sunrise Sunset Smoothie', category: 'drink', basePrice: 749 },
      { name: 'Bahama Mama Smoothie', category: 'drink', basePrice: 749 },
      { name: 'Thai Chicken Wrap', category: 'entree', basePrice: 899 },
      { name: 'Chicken Bacon Ranch Flatbread', category: 'entree', basePrice: 899 },
    ],
  },
  {
    chainName: "Culver's",
    slug: 'culvers',
    category: 'burgers',
    menuItems: [
      { name: 'ButterBurger Deluxe Single', category: 'entree', basePrice: 549, aliases: ['butterburger deluxe'] },
      { name: 'ButterBurger Double', category: 'entree', basePrice: 699 },
      { name: 'Chicken Tenders (4pc)', category: 'entree', basePrice: 649 },
      { name: 'Wisconsin Cheese Curds', category: 'side', basePrice: 499, aliases: ['cheese curds regular'] },
      { name: 'Concrete Mixer', category: 'dessert', basePrice: 449 },
      { name: 'Crinkle Cut Fries', category: 'side', basePrice: 249 },
    ],
  },
  {
    chainName: 'El Pollo Loco',
    slug: 'el-pollo-loco',
    category: 'mexican',
    menuItems: [
      { name: '2 Piece Leg & Thigh', category: 'entree', basePrice: 549 },
      { name: 'Chicken Burrito', category: 'entree', basePrice: 649 },
      { name: 'BRC Burrito', category: 'entree', basePrice: 399 },
      { name: 'Pinto Beans', category: 'side', basePrice: 199 },
      { name: 'Mexican Rice', category: 'side', basePrice: 199 },
    ],
  },
  {
    chainName: 'Portillo\'s',
    slug: 'portillos',
    category: 'burgers',
    menuItems: [
      { name: 'Italian Beef', category: 'entree', basePrice: 849 },
      { name: 'Chicago-Style Hot Dog', category: 'entree', basePrice: 449, aliases: ['chicago dog'] },
      { name: 'Double Cheeseburger', category: 'entree', basePrice: 749 },
      { name: 'Chocolate Cake Shake', category: 'dessert', basePrice: 699 },
      { name: 'Large Fries', category: 'side', basePrice: 449 },
      { name: 'Cheese Fries', category: 'side', basePrice: 549 },
    ],
  },
  {
    chainName: 'Chipotle',
    slug: 'chipotle-alias',
    category: 'mexican',
    menuItems: [], // redirect
  },
  {
    chainName: 'Del Taco',
    slug: 'del-taco',
    category: 'mexican',
    menuItems: [
      { name: 'Del Taco', category: 'entree', basePrice: 149 },
      { name: 'Epic Burrito', category: 'entree', basePrice: 649 },
      { name: 'Crunchy Taco', category: 'entree', basePrice: 149 },
      { name: 'Chicken Quesadilla', category: 'entree', basePrice: 549 },
      { name: 'Crinkle Cut Fries', category: 'side', basePrice: 249 },
      { name: 'Churros (2pc)', category: 'dessert', basePrice: 149 },
    ],
  },
  {
    chainName: 'Wawa',
    slug: 'wawa',
    category: 'sandwiches',
    menuItems: [
      { name: 'Classic Italian Hoagie', category: 'entree', basePrice: 749 },
      { name: 'Meatball Classic Hoagie', category: 'entree', basePrice: 699 },
      { name: 'Turkey Hoagie', category: 'entree', basePrice: 699 },
      { name: 'Sizzli Bacon Egg Cheese', category: 'entree', basePrice: 449 },
      { name: 'Mac & Cheese', category: 'side', basePrice: 449 },
    ],
  },
  {
    chainName: 'Qdoba',
    slug: 'qdoba',
    category: 'mexican',
    menuItems: [
      { name: 'Burrito Bowl', category: 'entree', basePrice: 999 },
      { name: 'Chicken Burrito', category: 'entree', basePrice: 999 },
      { name: 'Chicken Quesadilla', category: 'entree', basePrice: 999 },
      { name: 'Chips & Queso', category: 'side', basePrice: 399 },
      { name: 'Chips & Guac', category: 'side', basePrice: 399 },
    ],
  },
  {
    chainName: "Jimmy John's",
    slug: 'jimmy-johns',
    category: 'sandwiches',
    menuItems: [
      { name: '#1 The Pepe', category: 'entree', basePrice: 849, aliases: ['pepe'] },
      { name: '#4 Turkey Tom', category: 'entree', basePrice: 849 },
      { name: '#5 Vito', category: 'entree', basePrice: 849 },
      { name: '#9 Italian Night Club', category: 'entree', basePrice: 949 },
      { name: '#14 Bootlegger Club', category: 'entree', basePrice: 949 },
      { name: 'Pickle', category: 'side', basePrice: 149 },
      { name: 'Jimmy Chips', category: 'side', basePrice: 199 },
    ],
  },
  {
    chainName: 'Moe\'s Southwest Grill',
    slug: 'moes',
    category: 'mexican',
    menuItems: [
      { name: 'Homewrecker Burrito', category: 'entree', basePrice: 999 },
      { name: 'Joey Bag of Donuts Burrito', category: 'entree', basePrice: 899 },
      { name: 'Chicken Quesadilla', category: 'entree', basePrice: 849 },
      { name: 'Queso Cup', category: 'side', basePrice: 399 },
      { name: 'Chips', category: 'side', basePrice: 0 },
    ],
  },
  {
    chainName: 'Bojangles',
    slug: 'bojangles',
    category: 'chicken',
    menuItems: [
      { name: 'Cajun Chicken Filet Biscuit', category: 'entree', basePrice: 449 },
      { name: 'Bo\'s Chicken Biscuit', category: 'entree', basePrice: 399 },
      { name: '4 Piece Supremes', category: 'entree', basePrice: 599 },
      { name: 'Cajun Fries', category: 'side', basePrice: 249 },
      { name: 'Dirty Rice', category: 'side', basePrice: 249 },
      { name: 'Bo-Berry Biscuit', category: 'dessert', basePrice: 149 },
    ],
  },
  {
    chainName: 'Torchy\'s Tacos',
    slug: 'torchys',
    category: 'mexican',
    menuItems: [
      { name: 'Trailer Park Trashy', category: 'entree', basePrice: 549, aliases: ['trailer park'] },
      { name: 'Democrat', category: 'entree', basePrice: 549 },
      { name: 'Green Chile Queso', category: 'side', basePrice: 649, aliases: ['queso'] },
      { name: 'Street Corn', category: 'side', basePrice: 449 },
      { name: 'Chips and Salsa', category: 'side', basePrice: 299 },
    ],
  },
  {
    chainName: 'P. Terry\'s',
    slug: 'pterrys',
    category: 'burgers',
    menuItems: [
      { name: 'Double Burger', category: 'entree', basePrice: 549 },
      { name: 'Single Burger', category: 'entree', basePrice: 399 },
      { name: 'Chicken Sandwich', category: 'entree', basePrice: 449 },
      { name: 'Fries', category: 'side', basePrice: 249 },
      { name: 'Shake', category: 'dessert', basePrice: 449 },
    ],
  },
];

// Filter out redirect/empty entries
export const ACTIVE_CHAINS = TOP_CHAINS.filter(c => c.menuItems.length > 0);

/**
 * Find a chain by name (fuzzy match).
 */
export function findChain(restaurantName: string): ChainMenu | null {
  const normalized = restaurantName.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9\s]/g, '').trim();
  
  for (const chain of ACTIVE_CHAINS) {
    const chainNorm = chain.chainName.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9\s]/g, '').trim();
    if (normalized === chainNorm || normalized.includes(chainNorm) || chainNorm.includes(normalized)) {
      return chain;
    }
  }
  
  // Try slug match
  const slugNorm = normalized.replace(/\s+/g, '-');
  for (const chain of ACTIVE_CHAINS) {
    if (chain.slug === slugNorm) return chain;
  }
  
  return null;
}

/**
 * Get all canonical items for a chain, with aliases flattened for matching.
 */
export function getChainMenuItems(chain: ChainMenu): Array<{ name: string; basePrice: number; category: string; matchNames: string[] }> {
  return chain.menuItems.map(item => ({
    name: item.name,
    basePrice: item.basePrice,
    category: item.category,
    matchNames: [
      item.name.toLowerCase(),
      ...(item.aliases ?? []).map(a => a.toLowerCase()),
    ],
  }));
}
