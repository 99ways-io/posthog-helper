export const general=()=>{
 
const updateElementsStyle = (selector, updates) => {
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
const applyVariantSetting = (variations, variant) => {
  const config = variations[variant];
  config.forEach(({ selector, updates }) => {
    updateElementsStyle(selector, updates);
  });
  console.log(variant, "activated");
};

// Retrieve query parameter by key
  const getQueryParamByKey = (key) => new URLSearchParams(window.location.search).get(key);

// Main function to evaluate test group and apply variations
const testGroupValue = (variations, testSlug) => {
  
  let groupValue = getQueryParamByKey(testSlug);

  if (groupValue) {
    applyVariantSetting(variations, groupValue);
  } else {
    posthog.onFeatureFlags(() => {
      let groupValue = posthog.getFeatureFlag(testSlug);
      if (variations.hasOwnProperty(groupValue)) {
        applyVariantSetting(variations, groupValue);
      } else {
        console.log("Test not started yet, showing control.");
        applyVariantSetting(variations, 'control');
      }
    });
  }
};
  
}
// utils.js (or index.js if it's the main entry point)

// Utility function to apply updates to elements




export const idVersion=()=>{
  // User inputs should be easily modified as per the A/B test requirements
  const variationElements = {
    'control': ['headline-control'], // ALWAYS keep the control key as 'control'
    'test': ['headline-test-1'], // Should match feature flag Variant keys. by default: 'test'
    'test_group_2': ['headline-test-2']
  };
  const testSlug = '003-og1-header'; // get feature flag key from posthog


  // Ignore the next lines. That was all :)

  // Utility function to change the display style of given element IDs
  const changeElementDisplay = (elementId, displayNew) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = displayNew;
      console.log('Element', elementId, 'updated to ', displayNew);
    } else {
      console.warn('Element not found:', elementId);
    }
  };

  // Function to toggle visibility of variants based on configuration
  const toggleVariantVisibility = (variant, isVisible) => {
    variationElements[variant].forEach((elementId) => {
      changeElementDisplay(elementId, isVisible ? "block" : "none");
    });
  };

  const applyVariantsVisibility = (groupValue) => {
    // Collect all element IDs first, marked by which variant(s) they should appear in
    let allElementsWithVisibility = {};

    // Initialize visibility based on groupValue
    Object.keys(variationElements).forEach(variant => {
      const isVisible = variant === groupValue;
      variationElements[variant].forEach(elementId => {
        // If already present, we ensure not to overwrite 'true' with 'false' 
        // i.e., if an element is needed in any of the active variants, it should be visible
        if (!allElementsWithVisibility.hasOwnProperty(elementId) || isVisible) {
          allElementsWithVisibility[elementId] = isVisible;
        }
      });
    });

    // Now toggle visibility for all collected elements based on their determined states
    Object.entries(allElementsWithVisibility).forEach(([elementId, isVisible]) => {
      changeElementDisplay(elementId, isVisible ? "block" : "none");
    });

    console.log(`Test group "${groupValue}" activated`);
  };

  // Retrieve query parameter value by its key
  const getQueryParamByKey = (key) => new URLSearchParams(window.location.search).get(key);

  // Determine and apply visibility of variants based on URL parameter or feature flag
  const evaluateTestGroup = () => {
    let groupValue = getQueryParamByKey('test_group');

    // Added condition to await feature flag evaluation when query parameter is not present
    if (!groupValue) {
      posthog.onFeatureFlags(() => {
        const flagValue = posthog.getFeatureFlag(testSlug);
        // Ensure groupValue is only overwritten if flagValue is indeed one of the expected variants
        if (variationElements.hasOwnProperty(flagValue)) {
          groupValue = flagValue;
          applyVariantsVisibility(groupValue);
        } else { // Add this else condition
          // When test hasn't started (flagValue is falsy) and isn't in URL params, we do nothing. 
          // OR you can uncomment the next line and ensure control visibility.
          // toggleVariantVisibility('control', true);
          console.log("Test not started yet, showing control.");
        }
      });
    } else {
      applyVariantsVisibility(groupValue); // Use this helper function for code reuse (defined next)
    }
  };

  evaluateTestGroup();
}



evaluateTestGroup();