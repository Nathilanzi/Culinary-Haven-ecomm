import mongoose from "mongoose";

const shoppingItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    purchased: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const shoppingListSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    items: [shoppingItemSchema],
  },
  { timestamps: true }
);

export const ShoppingList =
  mongoose.models.ShoppingList ||
  mongoose.model("ShoppingList", shoppingListSchema);
