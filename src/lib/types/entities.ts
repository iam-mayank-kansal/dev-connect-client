// user
export interface User {
  _id: string;
  email: string;
  name: string;
  bio: string;
  designation: string;
  age: number;
  dob: string;
  profilePicture: string;
  profilePictureId: string;
  resume: string;
  resumeId: string;
  createdAt: string;

  mobile: IMobile;

  location: ILocation;

  connections: {
    requestSent: string[];
    connected: string[];
    requestReceived: string[];
    blocked: string[];
    ignored: string[];
  };

  skills: string[];

  education: Education[];

  experience: Experience[];

  socialLinks: SocialLink[];

  certification: Certification[];

  blogs: string[];
}

export interface IMobile {
  countryCode: string | null;
  number: string | null;
}

export interface ILocation {
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
}

// ------------------->

export interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | string;
  url: string;
}

export interface Certification {
  company: string;
  certificate: string;
  issuedBy: string;
  issueDate: string;
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

// ------------------->

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: Date;
  isRead: boolean;
  readAt?: Date;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  thumbnail?: string;
  tags?: string[];
  likes?: number;
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface Connection {
  _id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: Date;
  respondedAt?: Date;
}

export enum IConnectionStatus {
  'self',
  'connected',
  'requestSent',
  'requestReceived',
  'blocked',
  'ignored',
  'not_connected',
  null,
}
