import {
  Plane,
  Truck,
  Wallet,
  Package,
  MessageCircle,
  Sparkles,
  Search,
  Heart,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/content/site";

const ICONS: Record<IconName, React.ComponentType<LucideProps>> = {
  plane: Plane,
  truck: Truck,
  wallet: Wallet,
  package: Package,
  message: MessageCircle,
  sparkles: Sparkles,
  search: Search,
  heart: Heart,
};

/** Resuelve el nombre de ícono que usa `lib/content/home.ts`. */
export function ContentIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon {...props} />;
}
