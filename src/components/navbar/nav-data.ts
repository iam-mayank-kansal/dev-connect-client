// components/navbar/nav-data.ts
import { BookOpen, Users, MessageCircle, CloudUpload } from 'lucide-react';

export const NAV_LINKS = [
  { href: '/documentation', icon: BookOpen, label: 'Docs' },
  { href: '/connections', icon: Users, label: 'Connect' },
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/create-blog', icon: CloudUpload, label: 'Post' },
];
