import { create } from 'zustand';

type datatype = {
    description : string,
    markdowndata : string,
}

interface MyState {
    data : datatype;
    setData : (data:datatype) => void;
    clearData : () => void
}

const useDataStore = create<MyState>((set) => ({
    data: null,
    setData: (data) => set({ data }),
    clearData: () => set({ data: null }),
}));

export default useDataStore;