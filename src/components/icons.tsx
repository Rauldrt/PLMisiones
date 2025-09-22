
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
  MessageCircle,
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
  Eye,
  Heading1,
  Video,
  EyeOff,
  Palette,
  Music2,
  Upload,
} from 'lucide-react';
import type { SVGProps } from 'react';

const TiktokIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16.17 6.41a4.5 4.5 0 0 1-5.63.36 4.5 4.5 0 0 1-3.1-4.95V2h-3.44v10.37a6.5 6.5 0 0 0 6.5 6.51h.03a6.5 6.5 0 0 0 6.5-6.51V7.12a2.51 2.51 0 0 0-2.5-2.51h-.01a2.5 2.5 0 0 0-1.85 1.8Z" />
    </svg>
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
  Tiktok: TiktokIcon,
  Whatsapp: MessageCircle,
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
  Palette: Palette,
  Footer: Footprints,
  View: Eye,
  Hide: EyeOff,
  Header: Heading1,
  Media: Video,
  Music2,
  Upload,
};

export type IconName = keyof typeof Icons;

/**
 * Converts a kebab-case or regular string to PascalCase for icon lookup.
 * @param name The string to convert (e.g., "youtube", "music-2").
 * @returns The PascalCase string (e.g., "Youtube", "Music2").
 */
function toPascalCase(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export const getIcon = (name: string): React.ComponentType<{ className?: string }> => {
  if (!name) return Icons.Social; // Return a default icon if name is empty
  const pascalCaseName = toPascalCase(name) as IconName;
  const IconComponent = Icons[pascalCaseName];
  return IconComponent || Icons.Social; // Fallback to a default icon
};
