import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Background3DTask {
  productId: string;
  productName: string;
  taskId: string;
  progress: number;
  status: 'submitting' | 'generating' | 'converting' | 'finalizing' | 'completed' | 'failed';
  glbUrl?: string;
  usdzUrl?: string;
  error?: string;
}

interface Background3DState {
  tasks: Background3DTask[];
  addTask: (task: Pick<Background3DTask, 'productId' | 'productName' | 'taskId'>) => void;
  updateTask: (productId: string, updates: Partial<Background3DTask>) => void;
  removeTask: (productId: string) => void;
  getTaskByProductId: (productId: string) => Background3DTask | undefined;
}

export const useBackground3DStore = create<Background3DState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks.filter((t) => t.productId !== task.productId),
            { ...task, progress: 0, status: 'generating' },
          ],
        })),

      updateTask: (productId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.productId === productId ? { ...t, ...updates } : t,
          ),
        })),

      removeTask: (productId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.productId !== productId),
        })),

      getTaskByProductId: (productId) =>
        get().tasks.find((t) => t.productId === productId),
    }),
    {
      name: 'background-3d-tasks',
    },
  ),
);
