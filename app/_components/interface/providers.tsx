import { ConvexClientProvider } from './auth/convex-client-provider';
import { Toaster } from '../../../components/ui/sonner';

type ProvidersProps = {
  children: React.ReactNode;
}


export function Providers({ children }: ProvidersProps) {
  return (
    <ConvexClientProvider>
      {children}
      <Toaster richColors />
    </ConvexClientProvider>
  )
}
