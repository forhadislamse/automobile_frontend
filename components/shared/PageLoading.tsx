import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export default function PageLoading() {
  const [animation, setAnimation] = useState(null);

  useEffect(() => {
    fetch("/lottie/loading.json")
      .then((res) => res.json())
      .then(setAnimation);
  }, []);

  if (!animation) return null;

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="w-40 h-40 sm:w-60 sm:h-60">
        <Lottie animationData={animation} loop />
      </div>
    </div>
  );
}
