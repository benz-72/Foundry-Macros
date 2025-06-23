// Assuming data.js and model.js are loaded

function runTest() {
  console.log("Starting economic model test (Goods, Recipes, Workshops)...");

  // --- Helper function to log settlement status ---
  const logSettlementStatus = (settlement) => {
    console.log(`--- Status for ${settlement.name} ---`);
    console.log("Resources:");
    for (const resourceType in ResourceType) {
      const key = ResourceType[resourceType];
      console.log(`  ${key}: ${settlement.getResourceQuantity(key)} (Price: ${settlement.getPrice(key) || 'N/A'})`);
    }
    console.log("Goods:");
    for (const goodType in GoodsType) {
      const key = GoodsType[goodType];
      console.log(`  ${key}: ${settlement.getGoodQuantity(key)}`);
    }
    console.log("--------------------------");
  };

  // --- Test Setup ---
  if (typeof ResourceType === 'undefined' || typeof GoodsType === 'undefined' || typeof Recipes === 'undefined') {
    console.error("ResourceType, GoodsType, or Recipes not defined. Make sure data.js is loaded.");
    return;
  }
  if (typeof Settlement === 'undefined' || typeof Workshop === 'undefined') {
    console.error("Settlement or Workshop not defined. Make sure model.js is loaded.");
    return;
  }

  // 1. Create a settlement
  const mySettlement = new Settlement("Craftown");
  console.log(`Created settlement: ${mySettlement.name}`);

  // 2. Add initial resources to the settlement
  // (Manually, as raw resource production isn't the focus of this test)
  mySettlement.resources[ResourceType.WOOD] = 50;
  mySettlement.resources[ResourceType.IRON_ORE] = 30;
  console.log("Added initial resources to Craftown.");
  logSettlementStatus(mySettlement);

  // 3. Create and add workshops
  const shieldWorkshop = new Workshop(mySettlement, GoodsType.WOODEN_SHIELD);
  mySettlement.addWorkshop(shieldWorkshop);
  console.log(`Added Wooden Shield workshop to ${mySettlement.name}.`);

  const daggerWorkshop = new Workshop(mySettlement, GoodsType.IRON_DAGGER);
  mySettlement.addWorkshop(daggerWorkshop);
  console.log(`Added Iron Dagger workshop to ${mySettlement.name}.`);

  // 4. Run workshops a few times
  console.log("Running workshops (Cycle 1)...");
  mySettlement.runWorkshops();
  logSettlementStatus(mySettlement);
  // Expected: 1 Wooden Shield (cost 5 Wood), 1 Iron Dagger (cost 2 Iron Ore)

  console.log("Running workshops (Cycle 2)...");
  mySettlement.runWorkshops();
  logSettlementStatus(mySettlement);
  // Expected: 2 Wooden Shields total, 2 Iron Daggers total

  // 5. Run workshops until resources are depleted for one item
  console.log("Running workshops repeatedly until WOOD is likely depleted for shields...");
  // Shield recipe: 5 WOOD. Initial WOOD: 50. Max shields from wood: 10.
  // Dagger recipe: 2 IRON_ORE. Initial IRON_ORE: 30. Max daggers from iron: 15.
  // We expect to make 8 more shields (total 10) and 8 more daggers (total 10) in the next 8 cycles.
  for (let i = 0; i < 8; i++) {
    console.log(`Workshop run cycle ${i + 3}`);
    mySettlement.runWorkshops();
  }
  logSettlementStatus(mySettlement);
  // Expected: Wood: 0 (50 - 10*5), Iron Ore: 10 (30 - 10*2)
  // Wooden Shields: 10, Iron Daggers: 10

  console.log("Trying to run workshops again (should produce nothing if resources depleted)...");
  mySettlement.runWorkshops(); // Attempt another run
  logSettlementStatus(mySettlement);
  // Expected: No change in goods if resources for a particular good are gone.
  // Daggers might still be produced if Iron Ore is left and Wood is out for shields.

  // Test specific workshop production directly (optional)
  console.log("Directly telling shield workshop to produce 1 (should fail if no wood)...");
  const producedShields = shieldWorkshop.produce(1);
  console.log(`Shield workshop directly produced: ${producedShields}`);
  logSettlementStatus(mySettlement);


  console.log("--- Trying to produce daggers until Iron Ore is depleted ---");
  // Current Iron Ore: 10. Daggers: 10. Max 5 more daggers.
  let daggersMade = 0;
  for(let i=0; i<10; ++i) { // Try up to 10 times
      const count = daggerWorkshop.produce(1);
      if (count === 0) break;
      daggersMade += count;
  }
  console.log(`Made ${daggersMade} more daggers directly.`);
  logSettlementStatus(mySettlement);
  // Expected Iron Ore: 0 (if 10 initially, 5*2=10 consumed)
  // Expected Iron Daggers: 15 (10 + 5)

  console.log("Economic model goods and workshop test finished.");
}

// Instructions to run: (same as before)
// Create test.html, include data.js, model.js, test.js, then call runTest().
