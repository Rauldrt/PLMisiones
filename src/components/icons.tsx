'use client';
import {
  Newspaper,
  Users,
  UserPlus,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  Trash2,
  Edit,
  Save,
  LogIn,
  LogOut,
  Settings,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  Columns,
  ListCollapse,
  UsersRound,
  Link as LinkIcon,
} from 'lucide-react';
import type { SVGProps } from 'react';
import NextImage from 'next/image';

const Logo = ({ className, ...props }: { className?: string }) => (
  <NextImage 
    src="/logo.png" 
    alt="Logo del Partido Libertario" 
    width={32} 
    height={32} 
    className={className} 
    {...props} 
    unoptimized // Use unoptimized for simple SVGs or placeholders if needed, or remove for real PNG/JPG
  />
);

export const Icons = {
  News: Newspaper,
  Team: Users,
  Join: UserPlus,
  Contact: Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Menu,
  Close: X,
  Plus: PlusCircle,
  Trash: Trash2,
  Edit,
  Save,
  Login: LogIn,
  Logout: LogOut,
  Settings,
  Dashboard: LayoutDashboard,
  Submissions: FileText,
  Forms: MessageSquare,
  AI: Sparkles,
  Banner: ImageIcon,
  Mosaic: Columns,
  Accordion: ListCollapse,
  Referentes: UsersRound,
  Social: LinkIcon,
  Logo,
};

export type IconName = keyof typeof Icons;

export const getIcon = (name: string): React.ComponentType<{ className?: string }> => {
  const IconComponent = Icons[name as IconName];
  // Ensure we return a valid component, or a fallback that doesn't crash.
  return IconComponent || (() => null);
};