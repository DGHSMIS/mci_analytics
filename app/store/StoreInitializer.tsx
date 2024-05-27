"use client";

import { StoreStates, useStore } from "@store/store";
import { useRef } from "react";

function StoreInitializer(intialStoreState: StoreStates) {
  const initialized = useRef(false);
  console.log("Store Initializer");
  //We want to initialize it only once.
  if (!initialized.current) {
    useStore.setState({
      ...intialStoreState,
    });
    initialized.current = true;
  }
  return null;
}
export default StoreInitializer;
