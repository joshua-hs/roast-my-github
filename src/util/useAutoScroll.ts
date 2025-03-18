import { useEffect, useState, useCallback, useRef } from "react";

const useAutoScroll = (initialState = false) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(initialState);
  const lastScrollHeight = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isScrolling: number;
    const handleScroll = () => {
      window.clearTimeout(isScrolling);

      isScrolling = window.setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30;

        if (autoScrollEnabled && !isAtBottom) {
          setAutoScrollEnabled(false);
        }

        if (isAtBottom && !autoScrollEnabled) {
          setAutoScrollEnabled(true);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [autoScrollEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPageHeight = () => {
      const { scrollHeight } = document.documentElement;
      console.log({ scrollHeight });
      console.log(lastScrollHeight.current);
      if (scrollHeight > lastScrollHeight.current) {
        lastScrollHeight.current = scrollHeight;
        if (autoScrollEnabled) {
          scrollToBottom();
        }
      } else {
        lastScrollHeight.current = scrollHeight;
      }
    };

    const observer = new MutationObserver(checkPageHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    lastScrollHeight.current = document.documentElement.scrollHeight;

    return () => {
      observer.disconnect();
    };
  }, [autoScrollEnabled, scrollToBottom]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (autoScrollEnabled) {
      scrollToBottom();
    }
  }, [autoScrollEnabled, scrollToBottom]);

  const toggleAutoScroll = () => {
    setAutoScrollEnabled((prev) => !prev);
  };

  return { autoScrollEnabled, toggleAutoScroll };
};

export default useAutoScroll;
