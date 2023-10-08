"use client";

import { useEffect } from "react";
import { authStore } from "~/lib/stores";

export default function CheckAuth({hasCookies}: {hasCookies: any}) {
  const { setIsAuth } = authStore();

  useEffect(() => {
    if (hasCookies) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [hasCookies, setIsAuth]);

  return <></>;
}
