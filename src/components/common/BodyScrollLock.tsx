"use client";

import { useEffect } from "react";

const isModalOpen = () => Boolean(document.querySelector(".fixed.inset-0"));

export default function BodyScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    let locked = false;
    let scrollY = 0;

    const lock = () => {
      if (locked) return;
      locked = true;
      scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - html.clientWidth;

      html.classList.add("modal-open");
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    };

    const unlock = () => {
      if (!locked) return;
      locked = false;

      html.classList.remove("modal-open");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.overflow = "";
      body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };

    const sync = () => {
      if (isModalOpen()) {
        lock();
      } else {
        unlock();
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(body, { childList: true, subtree: true });
    sync();

    return () => {
      observer.disconnect();
      unlock();
    };
  }, []);

  return null;
}
