import { ConvexClientProvider } from "./auth/convex-client-provider";

type ProvidersProps = {
  children: React.ReactNode;
}


export function Providers({ children }: ProvidersProps) {
  return (
    <ConvexClientProvider>
      {children}
    </ConvexClientProvider>
  )
}
