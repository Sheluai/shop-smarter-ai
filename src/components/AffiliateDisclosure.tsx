import { Info } from "lucide-react";

interface AffiliateDisclosureProps {
  className?: string;
}

const AffiliateDisclosure = ({ className = "" }: AffiliateDisclosureProps) => (
  <p className={`flex items-start gap-1.5 text-xs text-muted-foreground ${className}`}>
    <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
    <span>This app uses affiliate links. We may earn a commission at no extra cost to you.</span>
  </p>
);

export default AffiliateDisclosure;
