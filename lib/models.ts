import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  language: 'fr' | 'en';
  createdAt: Date;
}

export interface Category {
  _id?: ObjectId;
  name: string;
  slug: string;
}

export interface Leak {
  _id?: ObjectId;
  userId: ObjectId;
  categoryId: ObjectId;
  title: string;
  message: string;
  link: string;
  image?: string;
  views: number;
  downloads: number;
  createdAt: Date;
}

export interface Comment {
  _id?: ObjectId;
  leakId: ObjectId;
  userId: ObjectId;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
