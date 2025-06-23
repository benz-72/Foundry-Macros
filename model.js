// Assuming data.js is loaded before model.js, ResourceType will be available globally or via import.
// If using ES6 modules, you would uncomment the following line:
// import { ResourceType } from './data.js';

class Settlement {
  constructor(name) {
    this.name = name;
    this.resources = {};
    this.production = {};
    this.goods = {}; // Will be used later for storing produced goods

    // Initialize all known resource types to 0 in resources stockpile
    if (typeof ResourceType !== 'undefined') {
      for (const type in ResourceType) {
        this.resources[ResourceType[type]] = 0;
      }
    }
    // Initialize goods types to 0 in goods stockpile
    if (typeof GoodsType !== 'undefined') {
      for (const type in GoodsType) {
        this.goods[GoodsType[type]] = 0;
      }
    }


    // Dynamic Pricing Parameters
    this.pricingParameters = {
      // Parameters for IRON_ORE (existing)
      [ResourceType.IRON_ORE]: {
        basePrice: 10,
        targetQuantity: 100,
        scarcityMultiplier: 0.1
      },
      // --- Add Parameters for WOOD ---
      [ResourceType.WOOD]: {
        basePrice: 5,         // Base price for Wood
        targetQuantity: 150,  // Target quantity for Wood
        scarcityMultiplier: 0.05 // Scarcity multiplier for Wood
      }
      // We can add parameters for other new resources here
    };

    this.workshops = []; // To hold workshop instances later
  }

  /**
   * Increases the resource quantities based on production rates.
   * This method would typically be called once per game tick or time period.
   */
  updateProduction() {
    for (const resourceKey in this.production) {
      if (this.resources.hasOwnProperty(resourceKey)) {
        this.resources[resourceKey] += this.production[resourceKey];
      } else {
        // If the resource isn't in this.resources yet, initialize it.
        this.resources[resourceKey] = this.production[resourceKey];
      }
    }
  }

  /**
   * Manually set the production rate for a specific resource.
   * @param {string} resourceType - The type of resource (e.g., ResourceType.IRON_ORE).
   * @param {number} rate - The production rate per time step.
   */
  setProductionRate(resourceType, rate) {
    this.production[resourceType] = rate;
  }

  /**
   * Get the current quantity of a specific resource.
   * @param {string} resourceType - The type of resource.
   * @returns {number} The quantity of the resource.
   */
  getResourceQuantity(resourceType) {
    return this.resources[resourceType] || 0;
  }

  /**
   * Gets the dynamic price of a given resource type in this settlement.
   * @param {string} resourceType - The type of resource (e.g., ResourceType.IRON_ORE).
   * @returns {number|null} The calculated price of the resource, or null if not priced.
   */
  getPrice(resourceType) {
    if (this.pricingParameters.hasOwnProperty(resourceType)) {
      const params = this.pricingParameters[resourceType];
      const currentQuantity = this.resources[resourceType] || 0;

      let calculatedPrice = params.basePrice + (params.targetQuantity - currentQuantity) * params.scarcityMultiplier;

      // Ensure a minimum price (e.g., 1)
      if (calculatedPrice < 1) {
        calculatedPrice = 1;
      }
      return calculatedPrice;

    }
    return null; // No price defined for this resource type
  }

  /**
   * Consumes a specified quantity of a resource from the settlement's stockpile.
   * @param {string} resourceType - The type of resource to consume.
   * @param {number} quantity - The amount to consume.
   */
  consumeResource(resourceType, quantity) {
    if (this.resources.hasOwnProperty(resourceType)) {
      if (this.resources[resourceType] >= quantity) {
        this.resources[resourceType] -= quantity;
      } else {
        console.warn(`Not enough ${resourceType} to consume. Available: ${this.resources[resourceType]}, needed: ${quantity}`);
        // Optionally throw an error or return false
      }
    } else {
      console.warn(`Cannot consume unknown resource: ${resourceType}`);
    }
  }

  /**
   * Adds a specified quantity of a good to the settlement's stockpile.
   * @param {string} goodType - The type of good to add.
   * @param {number} quantity - The amount to add.
   */
  addGood(goodType, quantity) {
    if (this.goods.hasOwnProperty(goodType)) {
      this.goods[goodType] += quantity;
    } else {
      // This case should ideally be handled by initializing all goods types in constructor
      this.goods[goodType] = quantity;
      console.warn(`Good type ${goodType} was not pre-initialized in settlement.goods.`);
    }
  }

  /**
   * Get the current quantity of a specific good.
   * @param {string} goodType - The type of good.
   * @returns {number} The quantity of the good.
   */
  getGoodQuantity(goodType) {
    return this.goods[goodType] || 0;
  }

  /**
   * Adds a workshop to the settlement.
   * @param {Workshop} workshop - The workshop instance to add.
   */
  addWorkshop(workshop) {
    this.workshops.push(workshop);
  }

  /**
   * Iterates through all workshops in the settlement and instructs them to produce.
   * Each workshop will attempt to produce based on its own logic (e.g., one unit).
   */
  runWorkshops() {
    if (this.workshops.length === 0) {
      // console.log(`${this.name} has no workshops to run.`);
      return;
    }

    // console.log(`Running workshops in ${this.name}...`);
    for (const workshop of this.workshops) {
      // For now, each workshop attempts to produce 1 unit of its good.
      // This could be made more complex later (e.g., based on demand, targets, etc.)
      const producedCount = workshop.produce(1);
      // if (producedCount > 0) {
      //   console.log(`${workshop.goodTypeToProduce} workshop produced ${producedCount} item(s).`);
      // }
    }
  }
}

// If using ES6 modules, we would add:
// export { Settlement };

// ... (Settlement class definition above)

class Workshop {
  constructor(settlement, goodTypeToProduce) {
    this.settlement = settlement; // Reference to the parent settlement
    this.goodTypeToProduce = goodTypeToProduce; // e.g., GoodsType.WOODEN_SHIELD
    this.recipe = Recipes[goodTypeToProduce]; // Get the recipe for this good

    if (!this.recipe) {
      console.error(`Workshop created for ${goodTypeToProduce}, but no recipe found in data.js.`);
      // Or throw an error: throw new Error(`Recipe not found for ${goodTypeToProduce}`);
    }
  }

  /**
   * Attempts to produce a given quantity of its specialized good.
   * @param {number} quantityToProduce - The number of items to try and produce.
   * @returns {number} The number of items actually produced.
   */
  produce(quantityToProduce = 1) {
    if (!this.recipe) {
      console.warn(`Cannot produce ${this.goodTypeToProduce}: recipe not found or invalid.`);
      return 0;
    }

    let itemsSuccessfullyProduced = 0;
    for (let i = 0; i < quantityToProduce; i++) {
      // Check if settlement has enough resources for one unit of the good
      let canProduceOneUnit = true;
      for (const input of this.recipe.inputs) {
        if (this.settlement.getResourceQuantity(input.type) < input.quantity) {
          canProduceOneUnit = false;
          break;
        }
      }

      if (canProduceOneUnit) {
        // Consume resources from the settlement
        for (const input of this.recipe.inputs) {
          this.settlement.consumeResource(input.type, input.quantity);
        }
        // Add produced good to the settlement
        this.settlement.addGood(this.recipe.outputGood, this.recipe.outputQuantity);
        itemsSuccessfullyProduced++;
      } else {
        // Not enough resources for this unit, stop trying for this batch
        // console.log(`Not enough resources in ${this.settlement.name} to produce ${this.goodTypeToProduce}`);
        break;
      }
    }
    return itemsSuccessfullyProduced;
  }
}

// If using ES6 modules, add Workshop to exports:
// export { Settlement, Workshop };
