"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      router.refresh();
      router.replace("/");
    },
  });

  return (
    <Button onClick={() => logout()} disabled={isPending}>
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
