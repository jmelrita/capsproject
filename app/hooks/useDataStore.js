import { create } from 'zustand';

const useDataStore = create((set) => ({
    EstimatedTime: null,
    setEstimatedTime: (newData) => set({ EstimatedTime: newData }),
}));

export default useDataStore;