import { Document, Schema, model, models } from "mongoose"

export interface IHouses extends Document {
    _id: string;
    type: string;
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    price: string;
    isAvailable: boolean;
    category: { _id: string, name: string }
    agent: { _id: string, firstName: string, lastName: string }
}
const HouseSchema = new Schema({
    type: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true },
    price: { type: String },
    isAvailable: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    agent: { type: Schema.Types.ObjectId, ref: 'User' },
    organiser: { type: Schema.Types.ObjectId, ref: 'User' },
})

const House = models.House || model('House', HouseSchema);

export default House;