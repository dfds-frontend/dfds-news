import { Store } from "laco";

const store = new Store({
  windowHeight: '',
  windowWidth: '',
  history: [],
});
export default store;

export const dispatchResize = () => {
  store.set(state => ({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  }));
};
