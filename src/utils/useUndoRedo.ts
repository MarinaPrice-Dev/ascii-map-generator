import { useState, useCallback } from 'react';

export function useUndoRedo<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const [history, setHistory] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  // Call before a new action (e.g., before a drag fill)
  const beginAction = useCallback(() => {
    // Only save to history if state is valid
    if (state !== undefined && state !== null) {
    setHistory(h => [...h, state]);
    setFuture([]);
    }
  }, [state]);

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const previousState = h[h.length - 1];
      // Only restore if the previous state is valid
      if (previousState !== undefined && previousState !== null) {
      setFuture(f => [state, ...f]);
        setState(previousState);
      }
      return h.slice(0, -1);
    });
  }, [state]);

  const redo = useCallback(() => {
    setFuture(f => {
      if (f.length === 0) return f;
      const nextState = f[0];
      // Only restore if the next state is valid
      if (nextState !== undefined && nextState !== null) {
      setHistory(h => [...h, state]);
        setState(nextState);
      }
      return f.slice(1);
    });
  }, [state]);

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

  return [state, setState, undo, redo, canUndo, canRedo, beginAction] as const;
} 