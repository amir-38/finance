import { getCategoryIcon } from '@/entities/category/model/icon-map';
import { cn } from '@/shared/utils/index';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'size-8 [&_svg]:size-3.5',
  md: 'size-10 [&_svg]:size-4.5',
  lg: 'size-12 [&_svg]:size-5',
};

export function CategoryIcon({ icon, color, size = 'md', className }: CategoryIconProps) {
  const Icon = getCategoryIcon(icon);

  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-xl', sizeStyles[size], className)}
      style={{ backgroundColor: `${color}1f`, color }}
    >
      <Icon />
    </div>
  );
}
