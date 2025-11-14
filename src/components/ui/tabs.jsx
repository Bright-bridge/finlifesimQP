import * as TabsPrimitive from '@radix-ui/react-tabs';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex items-center justify-center rounded-xl bg-slate-800/80 p-1 text-slate-300 shadow-inner shadow-black/30 backdrop-blur',
      className
    )}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }) => (
  <TabsPrimitive.Trigger
    className={cn(
      'relative flex-1 select-none whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 data-[state=active]:bg-amber-500 data-[state=active]:text-black data-[state=active]:shadow data-[state=inactive]:hover:text-white',
      className
    )}
    {...props}
  />
);

export const TabsContent = ({ className, ...props }) => (
  <TabsPrimitive.Content
    className={cn('mt-4 focus:outline-none focus-visible:ring-0', className)}
    {...props}
  />
);


