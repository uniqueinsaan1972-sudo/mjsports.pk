"use client";
import { useEffect, useRef } from "react";

export default function ScrollFadeUp({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add("visible");
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return function () {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  return (
    <div ref={ref} className="fade-up">
      {children}
    </div>
  );
}