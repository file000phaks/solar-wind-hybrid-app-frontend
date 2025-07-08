import { create } from 'zustand';

const useAppStore = create((set, get) => ({

    // State
    user: null,
    theme: 'light',
    isAuthenticated: false,
    tabActive: "",

    // Actions
    login: (userData) => set({ user: userData, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    updateProfile: (profileData) => set((state) => ({ user: { ...state.user, ...profileData } })),
    // setTabActive: 

}))

export {
    useAppStore
}

// // Zustand Store
// const useStore = (set, get) => ({
   
//     user: null,
//     theme: 'light',
//     isAuthenticated: false,

//     login: (userData) => set({ user: userData, isAuthenticated: true }),
//     logout: () => set({ user: null, isAuthenticated: false }),
//     toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
//     updateProfile: (profileData) => set((state) => ({ user: { ...state.user, ...profileData } }))

// });

// // Simple Zustand implementation
// const createStore = (storeFunction) => {
//     let state = {};
//     const listeners = new Set();

//     const setState = (partial) => {
//         const nextState = typeof partial === 'function' ? partial(state) : partial;
//         state = { ...state, ...nextState };
//         listeners.forEach(listener => listener());
//     };

//     const getState = () => state;

//     const subscribe = (listener) => {
//         listeners.add(listener);
//         return () => listeners.delete(listener);
//     };

//     const api = { setState, getState, subscribe };
//     state = storeFunction(setState, getState, api);

//     return api;
// };

// const store = createStore(useStore);

// const useAppStores = () => {

//     const [state, setState] = React.useState(store.getState());

//     React.useEffect(() => {
//         const unsubscribe = store.subscribe(() => {
//             setState(store.getState());
//         });
//         return unsubscribe;
//     }, []);

//     return {
//         ...state,
//         login: store.getState().login,
//         logout: store.getState().logout,
//         toggleTheme: store.getState().toggleTheme,
//         updateProfile: store.getState().updateProfile
//     };
// };

// export {
//     useAppStore,
// }

