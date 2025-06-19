// Define resource types
const ResourceType = {
  IRON_ORE: 'IRON_ORE',
  // We can add more resources here later, e.g., WOOD: 'WOOD', GRAIN: 'GRAIN'
};

// Make it available for other modules if we're using a module system (e.g., Node.js or ES6 Modules)
// For simplicity in a browser environment, we might just rely on global scope or a single script bundle.
// If using ES6 modules, we would add:
// export { ResourceType };
// For now, let's assume a simple browser environment or that model.js will be loaded after data.js
