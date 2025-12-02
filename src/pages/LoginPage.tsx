import { useEffect } from "react";

export const LoginPage = () => {
  useEffect(() => {
    const go = async () => {
      fetch('/auth/workos-url').then(response => response.json()).then(data => {
        window.location.href = data.url;
      });
    };
    go();
  }, []);
};