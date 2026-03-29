import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Eventify` : "Eventify";
    return () => {
      document.title = "Eventify";
    };
  }, [title]);
}
