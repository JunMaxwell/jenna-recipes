import { Recipe } from '../../types';

export const STOCK_RECIPES: Partial<Recipe>[] = [
  {
    title: "Classic Avocado Toast",
    category: "Breakfast",
    rating: 5,
    estimatedTime: 10,
    ingredients: [
      "2 slices of sourdough bread",
      "1 ripe avocado",
      "1/2 lemon, juiced",
      "Pinch of sea salt and black pepper",
      "Red pepper flakes (optional)",
      "1 tbsp olive oil"
    ],
    instructions: [
      "Toast the sourdough bread slices until golden brown and crispy.",
      "In a small bowl, mash the avocado with lemon juice, salt, and pepper.",
      "Spread the mashed avocado evenly over the toasted bread.",
      "Drizzle with olive oil and sprinkle with red pepper flakes if desired."
    ],
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Mediterranean Quinoa Bowl",
    category: "Lunch",
    rating: 4,
    estimatedTime: 20,
    ingredients: [
      "1 cup cooked quinoa",
      "1/2 cup cherry tomatoes, halved",
      "1/4 cup cucumber, diced",
      "1/4 cup kalamata olives, pitted",
      "1/4 cup feta cheese, crumbled",
      "2 tbsp hummus",
      "1 tbsp lemon vinaigrette"
    ],
    instructions: [
      "Place the cooked quinoa in the base of a bowl.",
      "Arrange the cherry tomatoes, cucumber, olives, and feta cheese on top of the quinoa.",
      "Add a dollop of hummus in the center.",
      "Drizzle the lemon vinaigrette over the entire bowl before serving."
    ],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Garlic Butter Salmon",
    category: "Dinner",
    rating: 5,
    estimatedTime: 25,
    ingredients: [
      "2 salmon fillets",
      "3 cloves garlic, minced",
      "2 tbsp butter, melted",
      "1 tbsp fresh parsley, chopped",
      "1/2 lemon, sliced",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C) and line a baking sheet with parchment paper.",
      "Place salmon fillets on the baking sheet and season generously with salt and pepper.",
      "In a small bowl, mix melted butter, minced garlic, and chopped parsley.",
      "Brush the garlic butter mixture over the salmon fillets.",
      "Top with lemon slices and bake for 12-15 minutes until salmon is flaky."
    ],
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Fudgy Chocolate Brownies",
    category: "Dessert",
    rating: 5,
    estimatedTime: 45,
    ingredients: [
      "1/2 cup unsalted butter, melted",
      "1 cup granulated sugar",
      "2 large eggs",
      "1 tsp vanilla extract",
      "1/3 cup cocoa powder",
      "1/2 cup all-purpose flour",
      "1/4 tsp salt",
      "1/2 cup chocolate chips"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C) and grease an 8x8 inch baking pan.",
      "In a large bowl, whisk together melted butter and sugar until well combined.",
      "Beat in the eggs and vanilla extract until the mixture is smooth.",
      "Fold in the cocoa powder, flour, and salt until just combined (do not overmix).",
      "Stir in the chocolate chips.",
      "Pour the batter into the prepared pan and bake for 20-25 minutes.",
      "Let cool completely before cutting into squares."
    ],
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Spicy Roasted Chickpeas",
    category: "Snack",
    rating: 4,
    estimatedTime: 35,
    ingredients: [
      "1 can (15 oz) chickpeas, rinsed and thoroughly dried",
      "1 tbsp olive oil",
      "1 tsp smoked paprika",
      "1/2 tsp garlic powder",
      "1/4 tsp cayenne pepper",
      "1/2 tsp sea salt"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C) and line a baking sheet with parchment paper.",
      "Ensure chickpeas are completely dry to ensure crispiness.",
      "Toss the chickpeas with olive oil, paprika, garlic powder, cayenne pepper, and salt.",
      "Spread them in a single layer on the baking sheet.",
      "Roast for 25-30 minutes, shaking the pan halfway through, until crispy.",
      "Let cool slightly before serving."
    ],
    imageUrl: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Refreshing Berry Smoothie",
    category: "Drink",
    rating: 5,
    estimatedTime: 5,
    ingredients: [
      "1 cup mixed frozen berries (strawberries, blueberries, raspberries)",
      "1/2 cup Greek yogurt",
      "1/2 cup almond milk",
      "1 tbsp honey or maple syrup",
      "1/2 banana"
    ],
    instructions: [
      "Add all ingredients into a blender.",
      "Blend on high speed until smooth and creamy.",
      "If the smoothie is too thick, add a splash more almond milk.",
      "Pour into a glass and serve immediately."
    ],
    imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  }
];
