import { useEffect, useRef } from 'react';

function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current)
      return fn();
    else
      didMountRef.current = true;
  }, inputs);
}

export default useDidUpdateEffect;