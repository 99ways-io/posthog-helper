// utils.js (or index.js if it's the main entry point)

// Utility function to apply updates to elements
export const applyUpdates = (selector, updates) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    Object.entries(updates).forEach(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          element[key][nestedKey] = nestedValue;
        });
      } else {
        element[key] = value;
      }
    });
  });
};

// Utility function to apply variant configuration
export const applyVariantConfig = (variations, variant) => {
  const config = variations[variant];
  config.forEach(({ selector, updates }) => {
    applyUpdates(selector, updates);
  });
  console.log(variant, "activated");
};

// Retrieve query parameter by key
export const getQueryParamByKey = (key) => new URLSearchParams(window.location.search).get(key);

// Main function to evaluate test group and apply variations
export const evaluateTestGroup = (variations, testSlug) => {
  let groupValue = getQueryParamByKey(testSlug);

  if (groupValue) {
    applyVariantConfig(variations, groupValue);
  } else {
    posthog.onFeatureFlags(() => {
      let groupValue = posthog.getFeatureFlag(testSlug);
      if (variations.hasOwnProperty(groupValue)) {
        applyVariantConfig(variations, groupValue);
      } else {
        console.log("Test not started yet, showing control.");
        applyVariantConfig(variations, 'control');
      }
    });
  }
};

