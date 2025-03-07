const materialDescriptionTexts: Record<string, string> = {
  'PLA': 'PLA (Polylactic Acid) is one of the most popular materials for 3D printing. It\'s biodegradable, easy to print with, and available in a wide range of colors. PLA is ideal for decorative items, prototypes, and low-stress applications.',
  
  'ABS': 'ABS (Acrylonitrile Butadiene Styrene) is known for its strength and durability. It has good heat resistance and is commonly used for functional parts. ABS requires higher printing temperatures and can produce fumes during printing.',
  
  'PETG': 'PETG (Polyethylene Terephthalate Glycol) combines the ease of printing of PLA with better durability and heat resistance. It\'s food-safe, has good layer adhesion, and is more flexible than ABS or PLA.',
  
  'TPU': 'TPU (Thermoplastic Polyurethane) is a flexible filament that produces rubber-like parts. It\'s ideal for items that need to bend or compress, such as phone cases, toys, or protective covers. TPU requires slower print speeds but offers excellent impact resistance.',
};

export function getMaterialDescription(materialType: string): string {
  return materialDescriptionTexts[materialType] || '';
}

export const materialDescriptions = {
  PLA: {
    title: "PLA (Polylactic Acid)",
    advantages: [
      "Biodegradable and eco-friendly",
      "Easy to print with minimal warping",
      "Good for prototypes and decorative items",
      "Excellent detail and surface finish",
      "Low cost and widely available"
    ],
    bestFor: [
      "Prototypes and proof of concepts",
      "Decorative items and display pieces",
      "Low-wear household items",
      "Educational projects",
      "Indoor use items"
    ],
    limitations: [
      "Low heat resistance (softens around 60°C)",
      "Not suitable for outdoor use",
      "Limited mechanical strength",
      "Can degrade with prolonged UV exposure"
    ],
    typicalApplications: [
      "Architectural models",
      "Toys and figurines",
      "Display props",
      "Low-stress mechanical parts",
      "Rapid prototyping"
    ]
  },
  PETG: {
    title: "PETG (Polyethylene Terephthalate Glycol)",
    advantages: [
      "Excellent strength and durability",
      "Good chemical resistance",
      "Food safe when properly processed",
      "Better impact resistance than PLA",
      "Good layer adhesion"
    ],
    bestFor: [
      "Functional parts requiring strength",
      "Water-tight applications",
      "Food-related items",
      "Mechanical components",
      "Items needing chemical resistance"
    ],
    limitations: [
      "Can be slightly more difficult to print than PLA",
      "May show scratches more easily",
      "Can be hygroscopic (absorbs moisture)",
      "Slightly more expensive than PLA"
    ],
    typicalApplications: [
      "Food containers",
      "Medical components",
      "Mechanical parts",
      "Protective covers",
      "Liquid containers"
    ]
  },
  ABS: {
    title: "ABS (Acrylonitrile Butadiene Styrene)",
    advantages: [
      "High impact resistance",
      "Good heat resistance",
      "Durable and tough",
      "Can be post-processed (acetone smoothing)",
      "UV resistant"
    ],
    bestFor: [
      "Functional parts requiring durability",
      "Outdoor applications",
      "High-temperature environments",
      "Parts requiring strength",
      "Items needing impact resistance"
    ],
    limitations: [
      "Requires higher printing temperatures",
      "Prone to warping during printing",
      "Needs enclosed printer environment",
      "Produces fumes while printing",
      "Not biodegradable"
    ],
    typicalApplications: [
      "Automotive parts",
      "Tool handles",
      "Electronic enclosures",
      "Outdoor fixtures",
      "Mechanical components"
    ]
  },
  TPU: {
    title: "TPU (Thermoplastic Polyurethane)",
    advantages: [
      "Highly flexible and elastic",
      "Excellent wear resistance",
      "Good chemical resistance",
      "Shock absorbing properties",
      "Abrasion resistant"
    ],
    bestFor: [
      "Flexible parts and components",
      "Shock absorbers",
      "Protective cases",
      "Wearable items",
      "Parts requiring elasticity"
    ],
    limitations: [
      "Can be challenging to print",
      "Requires slower print speeds",
      "May be difficult to get precise details",
      "More expensive than rigid filaments",
      "Can be hygroscopic"
    ],
    typicalApplications: [
      "Phone cases",
      "Wheels and tires",
      "Gaskets and seals",
      "Flexible hinges",
      "Sports equipment"
    ]
  },
  Nylon: {
    title: "Nylon (Polyamide)",
    advantages: [
      "High strength-to-weight ratio",
      "Excellent wear resistance",
      "Good flexibility",
      "High impact resistance",
      "Low friction coefficient"
    ],
    bestFor: [
      "High-wear applications",
      "Moving parts",
      "Mechanical components",
      "Tools and fixtures",
      "Functional prototypes"
    ],
    limitations: [
      "Highly hygroscopic (absorbs moisture)",
      "Requires high printing temperatures",
      "Can be difficult to achieve good bed adhesion",
      "More expensive than basic filaments",
      "Requires careful storage"
    ],
    typicalApplications: [
      "Gears and bearings",
      "Tools and fixtures",
      "End-use parts",
      "Mechanical components",
      "Industrial applications"
    ]
  }
}; 