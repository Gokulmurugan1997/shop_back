import mongoose from "./index.js";

const productSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    product: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    collections: "Shop_myCart",
    versionKey: false         
  }
);

const cartModel = mongoose.model("MyCart", productSchema);

export default cartModel;
