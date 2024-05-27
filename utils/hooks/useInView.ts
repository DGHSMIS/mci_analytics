import { useEffect, useState } from "react";

function useInView(
  ref: React.MutableRefObject<null>,
  onVisibleCallback: (visibleRef: React.MutableRefObject<any>) => void,
  thresholdProps = 0.7
) {
  const [inView, setInView] = useState(false);
  console.log("Use In View Hook Fired");
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        console.log("Is the reference object visible? ", isVisible);
        setInView(isVisible);
        console.log(
          "Is the onVisibleCallback callback visible? ",
          onVisibleCallback
        );
        if (isVisible && onVisibleCallback) {
          onVisibleCallback(ref);
        }
      },
      {
        root: null,
        threshold: thresholdProps,
      }
    );
    console.log("Use In View - Tracking");
    if (ref.current) {
      console.log("Use In View - Tracking");
      observer.observe(ref.current);
    }

    // return () => {
    //   if (ref.current) {
    //     observer.unobserve(ref.current);
    //   }
    // };
  }, [ref, onVisibleCallback]);

  return inView;
}

export default useInView;
