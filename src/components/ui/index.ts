/**
 * UI Components Index
 * 
 * Central export point for all UI components.
 * Makes imports cleaner and more maintainable.
 * 
 * @example
 * ```tsx
 * import { Button, Input, Card, Toast } from '@/components/ui';
 * ```
 */

// Form Components
export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button';

export { Input, Textarea, SearchInput, inputVariants } from './Input';
export type { InputProps, TextareaProps, SearchInputProps } from './Input';

// Layout Components
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export type { CardProps } from './Card';

// Data Display
export { Badge, badgeVariants } from './Badge';
export type { BadgeProps } from './Badge';

// Feedback Components
export { ToastContainer } from './Toast';

export { Modal } from './Modal';

// Loading Components
export {
  LoadingSpinner,
  FullPageLoading,
  InlineLoading,
  LoadingOverlay,
  LoadingDots,
} from './Loading';
export type {
  LoadingSpinnerProps,
  FullPageLoadingProps,
  InlineLoadingProps,
  LoadingOverlayProps,
} from './Loading';

// Skeleton Components
export {
  Skeleton,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
  SkeletonButton,
  SkeletonInput,
  SkeletonList,
  SkeletonMissionCard,
} from './Skeleton';
export type {
  SkeletonProps,
  SkeletonAvatarProps,
  SkeletonTextProps,
  SkeletonButtonProps,
  SkeletonInputProps,
  SkeletonListProps,
} from './Skeleton';
