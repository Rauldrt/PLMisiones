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
  Plus,
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
  MapPin,
  ChevronUp,
  ChevronDown,
  Bell,
  Image as GalleryIcon,
} from 'lucide-react';
import type { SVGProps } from 'react';


const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M50 0L61.226 38.774L100 50L61.226 61.226L50 100L38.774 61.226L0 50L38.774 38.774L50 0Z" fill="currentColor" />
    </svg>
);


export const Icons = {
  Logo,
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
  ChevronUp,
  ChevronDown,
  Menu,
  Close: X,
  Plus,
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
  Location: MapPin,
  Notification: Bell,
  Gallery: GalleryIcon,
};

export type IconName = keyof typeof Icons;

export const getIcon = (name: string): React.ComponentType<{ className?: string }> => {
  const IconComponent = Icons[name as IconName];
  // Ensure we return a valid component, or a fallback that doesn't crash.
  return IconComponent || (() => null);
};
