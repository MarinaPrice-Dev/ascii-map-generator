import { useState, useCallback } from 'react';

export function useUndoRedo<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const [history, setHistory] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  // Call before a new action (e.g., before a drag fill)
  const beginAction = useCallback(() => {
    setHistory(h => [...h, state]);
    setFuture([]);
  }, [state]);

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      setFuture(f => [state, ...f]);
      setState(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, [state]);

  const redo = useCallback(() => {
    setFuture(f => {
      if (f.length === 0) return f;
      setHistory(h => [...h, state]);
      setState(f[0]);
      return f.slice(1);
    });
  }, [state]);

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

  return [state, setState, undo, redo, canUndo, canRedo, beginAction] as const;
} 