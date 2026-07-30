import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export default function Loading() {
  const [animation, setAnimation] = useState(null);

  useEffect(() => {
    fetch("/lottie/loading.json")
      .then((res) => res.json())
      .then(setAnimation);
  }, []);

  if (!animation) return null;

  return (
    <div className="flex items-center justify-center w-32 h-32">
      <Lottie animationData={animation} loop />
    </div>
  );
}

