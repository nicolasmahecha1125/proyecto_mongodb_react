import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: {type: String},
});

export default mongoose.model("Product", productSchema);
