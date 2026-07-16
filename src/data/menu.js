export const categories = [
  { id: 'all', name: 'All' },
  { id: 'start', name: 'Starters' },
  { id: 'main', name: 'Mains' },
  { id: 'dessert', name: 'Sweets' },
  { id: 'drink', name: 'Drinks' },
  { id: 'veg', name: 'Veg only' },
];

export const categoryNames = {
  start: 'Starter',
  main: 'Main',
  dessert: 'Dessert',
  drink: 'Drink',
};

export const tintByCategory = {
  start: 'var(--tint-start)',
  main: 'var(--tint-main)',
  dessert: 'var(--tint-dessert)',
  drink: 'var(--tint-drink)',
};

export const menuItems = [
  {
    id: 'burrata',
    cat: 'start',
    name: 'Burrata & heirloom',
    desc: 'Stracciatella, basil oil, sourdough crisp',
    price: 16,
    time: 8,
    veg: true,
    model: true,
    tags: ['popular'],
    modifiers: [
      {
        id: 'add',
        name: 'Add-ons',
        type: 'multi',
        required: false,
        options: [
          { id: 'bread', label: 'Extra sourdough', price: 3 },
          { id: 'prosc', label: 'Prosciutto di Parma', price: 5 },
          { id: 'truffle', label: 'Shaved truffle', price: 8 },
        ],
      },
    ],
  },
  { id: 'oysters', cat: 'start', name: 'Wood-grilled oysters', desc: 'Half dozen, brown butter, charred lemon', price: 22, time: 12, tags: ['chef'] },
  { id: 'flatbread', cat: 'start', name: 'Charred flatbread', desc: 'Whipped ricotta, hot honey, chili', price: 14, time: 10, veg: true },
  {
    id: 'ribeye',
    cat: 'main',
    name: 'Dry-aged ribeye',
    desc: '45-day, bone-marrow butter, watercress',
    price: 46,
    time: 22,
    model: true,
    hasVariants: true,
    tags: ['chef', 'popular'],
    variants: [
      { id: '10', label: '10 oz', price: 46 },
      { id: '16', label: '16 oz', price: 64 },
      { id: '24', label: '24 oz · to share', price: 92 },
    ],
    modifiers: [
      {
        id: 'temp',
        name: 'Cooked to',
        type: 'single',
        required: true,
        showDefault: true,
        options: [
          { id: 'mr', label: 'Medium rare' },
          { id: 'rare', label: 'Rare' },
          { id: 'med', label: 'Medium' },
          { id: 'well', label: 'Well done' },
        ],
      },
      {
        id: 'sauce',
        name: 'Add-ons',
        type: 'multi',
        required: false,
        options: [
          { id: 'marrow', label: 'Extra marrow butter', price: 4 },
          { id: 'pepper', label: 'Peppercorn sauce', price: 3 },
          { id: 'chimi', label: 'Chimichurri', price: 3 },
        ],
      },
    ],
  },
  {
    id: 'branzino',
    cat: 'main',
    name: 'Whole roasted branzino',
    desc: 'Salsa verde, fennel, charred lemon',
    price: 34,
    time: 20,
    model: true,
    modifiers: [
      {
        id: 'side',
        name: 'Add a side',
        type: 'single',
        required: true,
        showDefault: false,
        options: [
          { id: 'none', label: 'No side', price: 0 },
          { id: 'fries', label: 'Rosemary fries', price: 6 },
          { id: 'greens', label: 'House greens', price: 7 },
        ],
      },
    ],
  },
  { id: 'mushroom', cat: 'main', name: 'Wood-fired king oyster', desc: 'Garlic cream, thyme, aged parmesan', price: 26, time: 18, veg: true },
  { id: 'chicken', cat: 'main', name: 'Brick chicken', desc: 'Half bird, pan jus, confit potato', price: 29, time: 24, soldOut: true },
  { id: 'tart', cat: 'dessert', name: 'Burnt honey tart', desc: 'Creme fraiche, Maldon salt', price: 12, time: 6, veg: true, tags: ['popular'] },
  { id: 'negroni', cat: 'drink', name: 'Oak-aged negroni', desc: 'Barrel-rested, orange oil', price: 18, time: 4 },
];

export const itemDetails = {
  burrata: {
    more: 'Pulled to order and dressed at the table, with a creamy stracciatella heart over chilled heirloom tomatoes and basil oil.',
    ing: ['Burrata', 'Heirloom tomato', 'Basil oil', 'Sourdough crisp'],
    alg: 'dairy, gluten',
  },
  oysters: {
    more: 'Grilled in the shell over oak embers until the brown butter froths, smoky, briny and rich with charred lemon.',
    ing: ['Half-dozen oysters', 'Brown butter', 'Charred lemon', 'Parsley'],
    alg: 'shellfish, dairy',
  },
  flatbread: {
    more: 'Blistered in the wood oven, draped with whipped ricotta, then finished with hot honey and chili.',
    ing: ['Wood-oven flatbread', 'Whipped ricotta', 'Hot honey', 'Chili'],
    alg: 'gluten, dairy',
  },
  ribeye: {
    more: 'Dry-aged 45 days for deep, nutty flavour, seared over the fire and rested under bone-marrow butter.',
    ing: ['45-day ribeye', 'Bone-marrow butter', 'Watercress', 'Flaky salt'],
    alg: 'dairy',
  },
  branzino: {
    more: 'A whole fish roasted crisp-skinned over embers, spooned with bright salsa verde and shaved fennel.',
    ing: ['Whole branzino', 'Salsa verde', 'Fennel', 'Charred lemon'],
    alg: 'fish',
  },
  mushroom: {
    more: 'King oyster mushrooms scored and fired until meaty, laid over silky garlic cream with crisped thyme.',
    ing: ['King oyster mushroom', 'Garlic cream', 'Thyme', 'Aged parmesan'],
    alg: 'dairy',
  },
  chicken: {
    more: 'Half a bird pressed under brick for shattering skin, with pan jus and confit potatoes.',
    ing: ['Half chicken', 'Pan jus', 'Confit potato'],
    alg: '',
  },
  tart: {
    more: 'Honey taken right to the edge of bitter, set in a buttery shell with cold creme fraiche.',
    ing: ['Burnt honey', 'Butter pastry', 'Creme fraiche', 'Maldon salt'],
    alg: 'dairy, gluten, egg',
  },
  negroni: {
    more: 'Rested six weeks in oak, softer and rounder, with orange oil expressed over the top.',
    ing: ['Gin', 'Campari', 'Sweet vermouth', 'Orange oil'],
    alg: '',
  },
};

export const orderSteps = [
  { label: 'Received', sub: 'Sent to the kitchen' },
  { label: 'Confirmed', sub: 'Order accepted' },
  { label: 'Preparing', sub: 'On the wood fire' },
  { label: 'Ready', sub: 'Plating up now' },
  { label: 'Served', sub: 'Enjoy your meal' },
];

export const etaByStep = [22, 16, 9];

export const requestTiles = [
  { id: 'WATER', label: 'Water', sub: 'Still or sparkling' },
  { id: 'BILL', label: 'Bill', sub: 'Ready to settle' },
  { id: 'WAITER', label: 'Server', sub: 'Need assistance' },
  { id: 'CLEAN_TABLE', label: 'Clean table', sub: 'Clear dishes' },
  { id: 'REFILL', label: 'Refill', sub: 'Drinks or sides' },
  { id: 'ORDER_ASSISTANCE', label: 'Help ordering', sub: 'Allergy / menu' },
  { id: 'CUSTOM', label: 'Something else', sub: 'Tell us below' },
];

export const requestLabels = {
  WATER: 'Water',
  BILL: 'Bill',
  WAITER: 'Server',
  CLEAN_TABLE: 'Clean table',
  REFILL: 'Refill',
  ORDER_ASSISTANCE: 'Help ordering',
  CUSTOM: 'Custom request',
};

export function money(value) {
  if (value == null) return '-';
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}
