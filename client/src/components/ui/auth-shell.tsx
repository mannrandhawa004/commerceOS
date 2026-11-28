import { GrainGradient } from '@paper-design/shaders-react';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Brand } from '@/shared/components/ui/brand';

interface AuthShellProps {
  children: ReactNode;
  eyebrow: string;
  heading: ReactNode;
  description: string;
  action: { href: string; label: string };
}

/** Split auth frame: editorial form panel + shader panel. */
export function AuthShell({ children, eyebrow, heading, description, action }: AuthShellProps) {
  return (
    <section className="min-h-screen bg-white p-3 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="flex items-start rounded-md border border-black/20 bg-white px-6 py-10 sm:px-8 dark:border-white/10 dark:bg-[#0a0a0a] lg:px-10 lg:py-14 xl:px-12 2xl:px-20 2xl:py-28">
          <div className="mx-auto w-full max-w-[520px] 2xl:max-w-[590px]">{children}</div>
        </div>

        <div className="relative flex min-h-[360px] overflow-hidden rounded-md bg-black p-6 text-white sm:min-h-[420px] sm:p-8 2xl:p-12 lg:min-h-0">
          <GrainGradient
            speed={0.6}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            frame={2854.5}
            colors={['#FFFFFF', '#FC7819', '#FC7819', '#FFFFFF']}
            colorBack="#00000000"
            className="absolute inset-0 bg-black"
          />

          <div className="relative z-10 flex h-full w-full flex-col justify-between gap-10 2xl:gap-16">
            <div className="flex items-start justify-between gap-6">
              <Brand light />
              <span className="text-right text-[9px] font-medium uppercase tracking-[0.2em] text-white/60 2xl:text-[10px] 2xl:tracking-[0.22em]">
                {eyebrow}
              </span>
            </div>

            <h2 className="max-w-[620px] text-4xl font-medium tracking-[-0.05em] text-white sm:text-5xl lg:text-[52px] lg:leading-[1.02] xl:text-[56px] 2xl:text-[70px] 2xl:leading-[0.98]">
              {heading}
            </h2>

            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <p className="max-w-sm text-xs leading-relaxed text-white/70 sm:text-sm 2xl:text-base">
                {description}
              </p>
              <a
                href={action.href}
                className="inline-flex h-10 max-w-full items-center gap-2.5 rounded-[10px] border border-white/25 px-4 text-xs font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-white/45 hover:text-white 2xl:h-12 2xl:gap-3 2xl:px-6 2xl:text-base"
              >
                <span className="truncate whitespace-nowrap">{action.label}</span>
                <ArrowUpRight className="size-4 shrink-0 2xl:size-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
