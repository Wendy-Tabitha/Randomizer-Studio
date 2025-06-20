import type { Metadata } from 'next';
import AppShell from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'Randorium - Your Randomizer Toolkit',
  description: 'A collection of useful randomizer tools, all in one place.',
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
