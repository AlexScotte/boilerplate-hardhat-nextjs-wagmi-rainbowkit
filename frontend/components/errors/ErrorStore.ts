import { create } from "zustand";

export type ErrorStoreType = {

    inError: Boolean,
    errorMessage: string,
}

export const useErrorStore = create<ErrorStoreType>()((set) => ({
    inError: false,
    errorMessage: ""
}));