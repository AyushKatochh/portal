import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import Link from "@docusaurus/Link";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import transitions from "@site/static/transitions.json";

function animateTextCollapse(
  from: string,
  to: string,
  done: () => void,
  el: HTMLHeadingElement
): () => void {
  let len = from.length;
  let interval = 30;
  let start = Date.now();
  let direction = -1;
  const handle = setInterval(() => {
    const elapsed = Date.now() - start;
    if (elapsed < interval) return;

    start = Date.now();

    if (direction < 0) {
      // exit
      len -= 1;
      interval /= 1.1;

      el.innerText = from.slice(0, len);
      if (len === 0) {
        direction = 1;
        interval = 5;
      }
    } else {
      // enter
      len += 1;
      el.innerText = to.slice(0, len);

      interval *= 1.1;

      if (interval > 30) {
        interval = 30;
      }

      if (len === to.length) {
        clearInterval(handle);
        done();
      }
    }
  }, 5);

  return () => clearInterval(handle);
}

const RotatedHeadline: React.FC<{ lines: string[]; interval: number }> = ({
  lines,
  interval,
}) => {
  const [index, setIndex] = useState(0);
  const el = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let abortTextCollapse: () => void = null;
    const handle = setInterval(() => {
      if (document.hasFocus()) {
        abortTextCollapse = animateTextCollapse(
          lines[index],
          lines[(index + 1) % lines.length],
          () => setIndex((index + 1) % lines.length),
          el.current
        );
      }
    }, interval);

    return () => {
      clearInterval(handle);
      abortTextCollapse();
    };
  }, [interval, index, setIndex]);

  return (
    <>
      {lines.map((line, i) => (
        <h1
          className="transition-all col-start-1 row-start-1 duration-500 opacity-0"
          key={line + "_" + i}
        >
          {line}
        </h1>
      ))}
      <h1 className="col-start-1 row-start-1 will-change-contents" ref={el}>
        {lines[0]}
      </h1>
    </>
  );
};

function Index() {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2 });
  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);
  return (
    <div className={styles.section}>
      <a className={styles.anchor} id="home" />
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={transitions.container}
        className={styles.container}
      >
        <motion.div variants={transitions.item} className={styles.Title}>
          <RotatedHeadline
            interval={2000}
            lines={[
              "Build on the internet",
              "Use 2049 blockchain",
              "Everything on-chain",
              "Internet reinvented",
              "The future is bright",
            ]}
          />
        </motion.div>
        <motion.p variants={transitions.item} className={styles.Text}>
          Web3 smart contracts process HTTP requests, create TX for other
          chains, and scale infinitely
        </motion.p>
        <motion.div
          variants={transitions.item}
          className={styles.actionContainer}
        >
          <Link className={styles.actionButton} to="/developers">
            CODE WEB3
          </Link>
          <Link
            className={styles.actionButton}
            to="https://wiki.internetcomputer.org/wiki/Extend_Bitcoin,_Ethereum_and_other_blockchains"
          >
            EXTEND BTC | ETH
          </Link>
          <Link
            className={styles.actionButton}
            to="https://wiki.internetcomputer.org/wiki/Replace_traditional_IT_with_a_World_Computer"
          >
            DITCH CLOUD
          </Link>
          <Link className={styles.callToAction} to={"/showcase"}>
            Web3 ecosystem
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Index;
