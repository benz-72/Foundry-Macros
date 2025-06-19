// Assuming data.js is loaded before model.js, ResourceType will be available globally or via import.
// If using ES6 modules, you would uncomment the following line:
// import { ResourceType } from './data.js';

class Settlement {
  constructor(name) {
    this.name = name;
    this.resources = {}; // Stores quantity of each resource, e.g., { IRON_ORE: 100 }
    this.production = {}; // Defines production rate, e.g., { IRON_ORE: 5 } (5 units per time step)

    // Initialize all known resource types to 0 if not specified,
    // though for now we only have IRON_ORE.
    // This could be expanded if ResourceType is an object with more keys.
    if (typeof ResourceType !== 'undefined') {
      for (const type in ResourceType) {
        this.resources[ResourceType[type]] = 0;
      }
    }

    // --- New Dynamic Pricing Parameters for IRON_ORE ---
    this.pricingParameters = {
      [ResourceType.IRON_ORE]: {
        basePrice: 10,        // Base price when quantity is at target
        targetQuantity: 100,  // Target quantity for base price
        scarcityMultiplier: 0.1 // How much price changes per unit deviation from target
                                // e.g., if quantity is 90, price increases by (100-90)*0.1 = 1
                                // if quantity is 110, price decreases by (100-110)*0.1 = -1
      }
      // We can add parameters for other resources here later
    };
    // --- End of New Parameters ---
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
}

// If using ES6 modules, we would add:
// export { Settlement };
