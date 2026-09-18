"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { ConfirmDialog, type ConfirmOptions } from "@/components/ui/ConfirmDialog";

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (result: boolean) => void;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise((resolve) => setPending({ options, resolve }));
  }, []);

  function resolve(result: boolean) {
    pending?.resolve(result);
    setPending(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <ConfirmDialog
          {...pending.options}
          onConfirm={() => resolve(true)}
          onCancel={() => resolve(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

/**
 * Reemplazo sobrio de `window.confirm` para acciones destructivas (borrar,
 * etc.). Requiere un `<ConfirmProvider>` como ancestro.
 */
export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm debe usarse dentro de <ConfirmProvider>");
  return confirm;
}
