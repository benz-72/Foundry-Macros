// Define resource types
const ResourceType = {
  IRON_ORE: 'IRON_ORE',
  WOOD: 'WOOD', // Added new resource
  // COAL: 'COAL', // Example for later
};

// Define finished goods types
const GoodsType = {
  WOODEN_SHIELD: 'WOODEN_SHIELD',
  IRON_DAGGER: 'IRON_DAGGER',
  // IRON_SWORD: 'IRON_SWORD', // Example for later
};

// Define recipes for goods
// Each recipe specifies:
// - outputGood: The type of good produced
// - outputQuantity: How many units are produced per recipe execution
// - inputs: An array of required resources/goods, each with its type and quantity
const Recipes = {
  [GoodsType.WOODEN_SHIELD]: {
    outputGood: GoodsType.WOODEN_SHIELD,
    outputQuantity: 1,
    inputs: [
      { type: ResourceType.WOOD, quantity: 5 },
    ],
    // timeToProduce: 10, // Optional: could be added later for production speed
  },
  [GoodsType.IRON_DAGGER]: {
    outputGood: GoodsType.IRON_DAGGER,
    outputQuantity: 1,
    inputs: [
      { type: ResourceType.IRON_ORE, quantity: 2 },
      // { type: ResourceType.COAL, quantity: 1 }, // If we had coal
    ],
  },
  // Example for a more complex recipe later:
  // [GoodsType.IRON_SWORD]: {
  //   outputGood: GoodsType.IRON_SWORD,
  //   outputQuantity: 1,
  //   inputs: [
  //     { type: ResourceType.IRON_ORE, quantity: 5 },
  //     { type: ResourceType.WOOD, quantity: 1 }, // For the hilt
  //     { type: ResourceType.COAL, quantity: 2 }, // For forging
  //   ],
  // },
};

// Make them available (if using modules, use export)
// export { ResourceType, GoodsType, Recipes };
