
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
  Lightbulb,
  Footprints,
} from 'lucide-react';
import type { SVGProps } from 'react';


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
  Proposals: Lightbulb,
  Footer: Footprints,
};

export type IconName = keyof typeof Icons;

export const getIcon = (name: string): React.ComponentType<{ className?: string }> => {
  const IconComponent = Icons[name as IconName];
  // Ensure we return a valid component, or a fallback that doesn't crash.
  return IconComponent || (() => null);
};
