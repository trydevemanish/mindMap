import { create } from 'zustand';

interface MyState {
    data : any;
    setData : (data:any) => void;
    clearData : () => void
}

const useDataStore = create<MyState>((set) => ({
    data: null,
    setData: (data) => set({ data }),
    clearData: () => set({ data: null }),
}));

export default useDataStore;