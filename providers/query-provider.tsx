"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  children: ReactNode;
};

export function QueryProvider({ children }: Props) {
  // useState para evitar recrear el cliente en cada render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 🔥 buenas prácticas
            staleTime: 1000 * 60 * 5, // 5 min (evita refetch innecesarios)
            gcTime: 1000 * 60 * 30, // cache 30 min
            retry: 2, // reintentos
            refetchOnWindowFocus: false, // evita refetch al volver a la tab
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Solo en desarrollo */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}