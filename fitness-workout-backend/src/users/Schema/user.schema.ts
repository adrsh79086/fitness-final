import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true})
export class User {
 
@Prop({default : ()=>uuidv4(),unique:true,})
userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 0 })
  streak: number;

  @Prop({ default: 0 })
  longestStreak: number;

  @Prop({
  required: true,
  enum: ['user', 'admin'],
  default: 'user',
})
role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);