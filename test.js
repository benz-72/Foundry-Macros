// Assuming data.js and model.js are loaded in the environment (e.g., via script tags in an HTML file in that order)

function runTest() {
  console.log("Starting economic model test (with Dynamic Pricing)...");

  if (typeof ResourceType === 'undefined') {
    console.error("ResourceType is not defined. Make sure data.js is loaded.");
    return;
  }
  if (typeof Settlement === 'undefined') {
    console.error("Settlement is not defined. Make sure model.js is loaded.");
    return;
  }

  // 1. Create a settlement
  const mySettlement = new Settlement("Northwood");
  console.log(`Created settlement: ${mySettlement.name}`);

  // (Optional) Adjust pricing parameters if different from default for testing
  // mySettlement.pricingParameters[ResourceType.IRON_ORE].basePrice = 15;
  // mySettlement.pricingParameters[ResourceType.IRON_ORE].targetQuantity = 150;
  // mySettlement.pricingParameters[ResourceType.IRON_ORE].scarcityMultiplier = 0.2;
  console.log(`Pricing parameters for ${ResourceType.IRON_ORE}:`, mySettlement.pricingParameters[ResourceType.IRON_ORE]);


  // 2. Set production rate for Iron Ore
  mySettlement.setProductionRate(ResourceType.IRON_ORE, 10); // Produces 10 Iron Ore per update
  console.log(`Set ${ResourceType.IRON_ORE} production rate to 10.`);

  // 3. Check initial resource quantity and price
  // Initial quantity is 0, so price should be higher than base
  console.log(`Initial ${ResourceType.IRON_ORE} quantity: ${mySettlement.getResourceQuantity(ResourceType.IRON_ORE)}`);
  console.log(`Initial ${ResourceType.IRON_ORE} price: ${mySettlement.getPrice(ResourceType.IRON_ORE)}`); // Should be basePrice + (targetQuantity - 0) * scarcityMultiplier

  // 4. Simulate production until targetQuantity is reached
  const targetQty = mySettlement.pricingParameters[ResourceType.IRON_ORE].targetQuantity;
  console.log(`Simulating production until ${ResourceType.IRON_ORE} quantity reaches target of ${targetQty}...`);
  let cycles = 0;
  while(mySettlement.getResourceQuantity(ResourceType.IRON_ORE) < targetQty && cycles < 20) { // Safety break for cycles
    mySettlement.updateProduction();
    cycles++;
  }
  console.log(`After ${cycles} production cycles:`);
  console.log(`  ${ResourceType.IRON_ORE} quantity: ${mySettlement.getResourceQuantity(ResourceType.IRON_ORE)}`);
  console.log(`  ${ResourceType.IRON_ORE} price (at target): ${mySettlement.getPrice(ResourceType.IRON_ORE)}`); // Should be close to basePrice

  // 5. Simulate more production (creating surplus)
  console.log("Simulating 5 more production updates (creating surplus)...");
  for (let i = 0; i < 5; i++) {
    mySettlement.updateProduction();
  }
  console.log(`After surplus production:`);
  console.log(`  ${ResourceType.IRON_ORE} quantity: ${mySettlement.getResourceQuantity(ResourceType.IRON_ORE)}`);
  console.log(`  ${ResourceType.IRON_ORE} price (in surplus): ${mySettlement.getPrice(ResourceType.IRON_ORE)}`); // Should be lower than basePrice

  // 6. Manually set quantity to very low (scarcity)
  console.log("Manually setting quantity to a very low value (10)...");
  mySettlement.resources[ResourceType.IRON_ORE] = 10;
  console.log(`  ${ResourceType.IRON_ORE} quantity: ${mySettlement.getResourceQuantity(ResourceType.IRON_ORE)}`);
  console.log(`  ${ResourceType.IRON_ORE} price (scarce): ${mySettlement.getPrice(ResourceType.IRON_ORE)}`); // Should be high

  // 7. Manually set quantity to very high (extreme surplus)
  console.log("Manually setting quantity to a very high value (500)...");
  mySettlement.resources[ResourceType.IRON_ORE] = 500;
  console.log(`  ${ResourceType.IRON_ORE} quantity: ${mySettlement.getResourceQuantity(ResourceType.IRON_ORE)}`);
  console.log(`  ${ResourceType.IRON_ORE} price (extreme surplus): ${mySettlement.getPrice(ResourceType.IRON_ORE)}`); // Should be low, capped at minimum 1

  console.log("Economic model dynamic pricing test finished.");
}

// Instructions to run: (same as before)
// Create test.html, include data.js, model.js, test.js, then call runTest().
