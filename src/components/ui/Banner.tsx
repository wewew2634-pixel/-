'use client';

import React, { useEffect } from 'react';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface BannerAction {
  label: string;
  onClick: () => void;
}

export interface BannerProps {
  id: string;
  variant: BannerVariant;
  title?: string;
  message: string;
  action?: BannerAction;
  secondaryAction?: BannerAction;
  dismissible?: boolean;
  persistent?: boolean;
  onDismiss?: () => void;
  autoHideDuration?: number;
}

const VARIANT_CONFIG: Record<BannerVariant, {
  icon: React.ComponentType<{ className?: string }>;
  bgClass: string;
  borderClass: string;
  iconClass: string;
  textClass: string;
  buttonClass: string;
}> = {
  info: {
    icon: Info,
    bgClass: 'bg-info-background',
    borderClass: 'border-info/20',
    iconClass: 'text-info',
    textClass: 'text-info-foreground',
    buttonClass: 'bg-info hover:brightness-110 text-info-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  },
  success: {
    icon: CheckCircle,
    bgClass: 'bg-success-background',
    borderClass: 'border-success/20',
    iconClass: 'text-success',
    textClass: 'text-success-foreground',
    buttonClass: 'bg-success hover:brightness-110 text-success-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-warning-background',
    borderClass: 'border-warning/20',
    iconClass: 'text-warning',
    textClass: 'text-warning-foreground',
    buttonClass: 'bg-warning hover:brightness-110 text-warning-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-destructive-background',
    borderClass: 'border-destructive/20',
    iconClass: 'text-destructive',
    textClass: 'text-destructive-foreground',
    buttonClass: 'bg-destructive hover:brightness-110 text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  },
  neutral: {
    icon: Info,
    bgClass: 'bg-surface-2',
    borderClass: 'border-border',
    iconClass: 'text-muted',
    textClass: 'text-foreground',
    buttonClass: 'bg-surface-3 hover:bg-surface-2/80 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  },
};

export function Banner({
  id,
  variant,
  title,
  message,
  action,
  secondaryAction,
  dismissible = true,
  persistent = false,
  onDismiss,
  autoHideDuration,
}: BannerProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  // Auto-dismiss logic
  useEffect(() => {
    if (!persistent && autoHideDuration && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [persistent, autoHideDuration, onDismiss]);

  const handleDismiss = () => {
    if (dismissible && onDismiss) {
      onDismiss();
    }
  };

  return (
    <div
      role="alert"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={cn(
        'zzik-banner',
        variant === 'info' && 'zzik-banner--info',
        variant === 'success' && 'zzik-banner--success',
        variant === 'warning' && 'zzik-banner--warning',
        variant === 'error' && 'zzik-banner--error',
        variant === 'neutral' && 'bg-surface/50 border-border',
        'focus-within:zzik-focus-ring'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={cn('w-5 h-5', config.iconClass)} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={cn('font-semibold text-sm mb-1', config.textClass)}>
            {title}
          </h3>
        )}
        <p className={cn('text-sm leading-relaxed', config.textClass)}>
          {message}
        </p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex items-center gap-3 mt-3">
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  'inline-flex items-center justify-center h-10 px-4 rounded-lg',
                  'text-sm font-semibold transition-all duration-200',
                  'zzik-focus-ring',
                  config.buttonClass
                )}
                aria-label={action.label}
              >
                {action.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className={cn(
                  'inline-flex items-center justify-center h-10 px-4 rounded-lg',
                  'text-sm font-semibold transition-all duration-200',
                  'border border-current hover:bg-surface/50',
                  'zzik-focus-ring',
                  config.textClass
                )}
                aria-label={secondaryAction.label}
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-md transition-colors duration-200',
            'hover:bg-surface/50 zzik-focus-ring',
            config.iconClass
          )}
          aria-label="배너 닫기"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}

      {/* Persistent Indicator */}
      {persistent && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-1 rounded-b-xl',
            variant === 'info' && 'bg-info',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'error' && 'bg-destructive',
            variant === 'neutral' && 'bg-muted'
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
