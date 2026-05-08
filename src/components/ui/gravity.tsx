import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import Matter, {
  Bodies,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
} from "matter-js";
import decomp from "poly-decomp";
import SVGPathCommander from "svg-path-commander";

import { cn } from "@/lib/utils";

// Register polygon decomposition library once
Common.setDecomp(decomp);

// Convert SVG path "d" to vertices for Matter.js
function parsePathToVertices(path: string, sampleLength = 15) {
  const commander = new SVGPathCommander(path);
  const points: { x: number; y: number }[] = [];
  let lastPoint: { x: number; y: number } | null = null;
  const totalLength = commander.getTotalLength();
  let length = 0;

  while (length < totalLength) {
    const point = commander.getPointAtLength(length);
    if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
      points.push({ x: point.x, y: point.y });
      lastPoint = point;
    }
    length += sampleLength;
  }

  const finalPoint = commander.getPointAtLength(totalLength);
  if (lastPoint && (finalPoint.x !== lastPoint.x || finalPoint.y !== lastPoint.y)) {
    points.push({ x: finalPoint.x, y: finalPoint.y });
  }

  return points;
}

function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number
) {
  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100;
    return containerSize * percentage;
  }
  return typeof value === "number"
    ? value
    : elementSize - containerSize + elementSize / 2;
}

type GravityProps = {
  children: ReactNode;
  debug?: boolean;
  gravity?: { x: number; y: number };
  resetOnResize?: boolean;
  grabCursor?: boolean;
  addTopWall?: boolean;
  autoStart?: boolean;
  className?: string;
};

type MatterBodyProps = {
  children: ReactNode;
  matterBodyOptions?: Matter.IBodyDefinition;
  isDraggable?: boolean;
  bodyType?: "rectangle" | "circle" | "svg";
  sampleLength?: number;
  x?: number | string;
  y?: number | string;
  angle?: number;
  className?: string;
};

export type GravityRef = {
  start: () => void;
  stop: () => void;
  reset: () => void;
};

const GravityContext = createContext<{
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps
  ) => void;
  unregisterElement: (id: string) => void;
} | null>(null);

const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(GravityContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;
    context.registerElement(idRef.current, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    });

    return () => context.unregisterElement(idRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, children, matterBodyOptions, isDraggable]);

  return (
    <div
      ref={elementRef}
      className={cn("absolute", className)}
      // pointer-events: none lets mousedown pass through to the Matter.js
      // canvas underneath, which is where the drag handler is bound.
      style={{ willChange: "transform", left: 0, top: 0, pointerEvents: "none" }}
    >
      {children}
    </div>
  );
};

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      className,
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null);
    const engine = useRef(Engine.create());
    const render = useRef<Matter.Render>();
    const runner = useRef<Matter.Runner>();
    const bodiesMap = useRef(
      new Map<string, { element: HTMLElement; body: Matter.Body; props: MatterBodyProps }>()
    );
    const frameId = useRef<number>();
    const mouseConstraint = useRef<Matter.MouseConstraint>();
    const mouseDown = useRef(false);
    const wallsRef = useRef<{ floor?: Matter.Body; left?: Matter.Body; right?: Matter.Body; top?: Matter.Body }>({});
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const isRunning = useRef(false);

    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvas.current) return;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const canvasRect = canvas.current.getBoundingClientRect();

        const angle = (props.angle || 0) * (Math.PI / 180);
        const x = calculatePosition(props.x, canvasRect.width, width);
        const y = calculatePosition(props.y, canvasRect.height, height);

        let body: Matter.Body | undefined;
        if (props.bodyType === "circle") {
          const radius = Math.max(width, height) / 2;
          body = Bodies.circle(x, y, radius, {
            ...props.matterBodyOptions,
            angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        } else if (props.bodyType === "svg") {
          const paths = element.querySelectorAll("path");
          const vertexSets: Matter.Vector[][] = [];
          paths.forEach((path) => {
            const d = path.getAttribute("d");
            if (d) vertexSets.push(parsePathToVertices(d, props.sampleLength));
          });
          body = Bodies.fromVertices(x, y, vertexSets, {
            ...props.matterBodyOptions,
            angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        } else {
          body = Bodies.rectangle(x, y, width, height, {
            ...props.matterBodyOptions,
            angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        }

        if (body) {
          World.add(engine.current.world, [body]);
          bodiesMap.current.set(id, { element, body, props });
        }
      },
      [debug]
    );

    const unregisterElement = useCallback((id: string) => {
      const entry = bodiesMap.current.get(id);
      if (entry) {
        World.remove(engine.current.world, entry.body);
        bodiesMap.current.delete(id);
      }
    }, []);

    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position;
        const rotation = body.angle * (180 / Math.PI);
        element.style.transform = `translate(${
          x - element.offsetWidth / 2
        }px, ${y - element.offsetHeight / 2}px) rotate(${rotation}deg)`;
      });
      frameId.current = requestAnimationFrame(updateElements);
    }, []);

    const startEngine = useCallback(() => {
      if (runner.current) {
        runner.current.enabled = true;
        Runner.run(runner.current, engine.current);
      }
      if (render.current) {
        Render.run(render.current);
      }
      frameId.current = requestAnimationFrame(updateElements);
      isRunning.current = true;
    }, [updateElements]);

    const stopEngine = useCallback(() => {
      if (!isRunning.current) return;
      if (runner.current) Runner.stop(runner.current);
      if (render.current) Render.stop(render.current);
      if (frameId.current) cancelAnimationFrame(frameId.current);
      isRunning.current = false;
    }, []);

    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return;
      const height = canvas.current.offsetHeight;
      const width = canvas.current.offsetWidth;

      engine.current.gravity.x = gravity.x;
      engine.current.gravity.y = gravity.y;
      // Mobile Safari aggressively sleeps bodies once they settle, after which
      // touches no longer wake them and the pills appear "frozen". Disable the
      // engine-wide sleeping behaviour to keep them interactive.
      engine.current.enableSleeping = false;

      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
        },
      });

      const mouse = Mouse.create(render.current.canvas);

      // Matter.js Mouse installs wheel/touch listeners that always call
      // preventDefault(). On a hero canvas that fills the viewport, that traps
      // vertical page scrolling on mobile. We replace them with smarter
      // listeners that only block the default action when the touch is
      // actually grabbing a pill — empty-space touches still scroll the page.
      const canvasEl = render.current.canvas as HTMLCanvasElement;
      const matterMouse = mouse as unknown as {
        mousewheel: EventListener;
        mousemove: EventListener;
        mousedown: EventListener;
        mouseup: EventListener;
      };
      // Strip wheel-blocking entirely (always allow page scroll via wheel)
      canvasEl.removeEventListener("wheel", matterMouse.mousewheel);
      // Strip Matter's default touch listeners — we'll re-bind smarter ones below
      canvasEl.removeEventListener("touchmove", matterMouse.mousemove);
      canvasEl.removeEventListener("touchstart", matterMouse.mousedown);
      canvasEl.removeEventListener("touchend", matterMouse.mouseup);
      canvasEl.style.touchAction = "pan-y";

      // Conditional touch handling: only hijack the touch when it lands on a
      // draggable body. This restores mobile drag-and-throw without breaking
      // vertical page scroll on empty canvas areas.
      let touchHasBody = false;
      const getTouchPos = (e: TouchEvent) => {
        const t = e.touches[0] || e.changedTouches[0];
        const rect = canvasEl.getBoundingClientRect();
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
      };
      const bodyAt = (pos: { x: number; y: number }) =>
        Query.point(engine.current.world.bodies, pos).some((b) => !b.isStatic);

      const onTouchStart = (e: TouchEvent) => {
        const pos = getTouchPos(e);
        touchHasBody = bodyAt(pos);
        if (touchHasBody) {
          e.preventDefault();
          mouse.position = pos;
          mouse.absolute = pos;
          mouse.button = 0;
          mouseDown.current = true;
          matterMouse.mousedown(e as unknown as Event);
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        if (!touchHasBody) return;
        e.preventDefault();
        const pos = getTouchPos(e);
        mouse.position = pos;
        mouse.absolute = pos;
        matterMouse.mousemove(e as unknown as Event);
      };
      const onTouchEnd = (e: TouchEvent) => {
        if (!touchHasBody) return;
        touchHasBody = false;
        mouseDown.current = false;
        matterMouse.mouseup(e as unknown as Event);
      };
      canvasEl.addEventListener("touchstart", onTouchStart, { passive: false });
      canvasEl.addEventListener("touchmove", onTouchMove, { passive: false });
      canvasEl.addEventListener("touchend", onTouchEnd, { passive: true });
      canvasEl.addEventListener("touchcancel", onTouchEnd, { passive: true });

      mouseConstraint.current = MouseConstraint.create(engine.current, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: debug },
        },
      });

      const floor = Bodies.rectangle(width / 2, height + 10, width, 20, {
        isStatic: true,
        friction: 1,
        render: { visible: debug },
      });
      const rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, {
        isStatic: true,
        friction: 1,
        render: { visible: debug },
      });
      const leftWall = Bodies.rectangle(-10, height / 2, 20, height, {
        isStatic: true,
        friction: 1,
        render: { visible: debug },
      });
      const walls = [floor, rightWall, leftWall];
      wallsRef.current = { floor, left: leftWall, right: rightWall };

      if (addTopWall) {
        const topWall = Bodies.rectangle(width / 2, -10, width, 20, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        });
        walls.push(topWall);
        wallsRef.current.top = topWall;
      }

      const touchingMouse = () =>
        Query.point(
          engine.current.world.bodies,
          mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
        ).length > 0;

      if (grabCursor) {
        Events.on(engine.current, "beforeUpdate", () => {
          if (canvas.current) {
            if (!mouseDown.current && !touchingMouse()) {
              canvas.current.style.cursor = "default";
            } else if (touchingMouse()) {
              canvas.current.style.cursor = mouseDown.current ? "grabbing" : "grab";
            }
          }
        });

        canvas.current.addEventListener("mousedown", () => {
          mouseDown.current = true;
          if (canvas.current) {
            canvas.current.style.cursor = touchingMouse() ? "grabbing" : "default";
          }
        });
        canvas.current.addEventListener("mouseup", () => {
          mouseDown.current = false;
          if (canvas.current) {
            canvas.current.style.cursor = touchingMouse() ? "grab" : "default";
          }
        });
      }

      World.add(engine.current.world, [mouseConstraint.current, ...walls]);
      render.current.mouse = mouse;

      runner.current = Runner.create();
      Render.run(render.current);
      updateElements();
      runner.current.enabled = false;

      if (autoStart) {
        runner.current.enabled = true;
        startEngine();
      }
    }, [updateElements, debug, autoStart, addTopWall, grabCursor, gravity.x, gravity.y, startEngine]);

    const clearRenderer = useCallback(() => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      if (mouseConstraint.current) {
        World.remove(engine.current.world, mouseConstraint.current);
      }
      if (render.current) {
        Mouse.clearSourceEvents(render.current.mouse);
        Render.stop(render.current);
        render.current.canvas.remove();
      }
      if (runner.current) Runner.stop(runner.current);
      if (engine.current) {
        World.clear(engine.current.world, false);
        Engine.clear(engine.current);
      }
      bodiesMap.current.clear();
    }, []);

    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return;
      const newWidth = canvas.current.offsetWidth;
      const newHeight = canvas.current.offsetHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      clearRenderer();
      initializeRenderer();
    }, [clearRenderer, initializeRenderer, resetOnResize]);

    // Soft resize: when resetOnResize is false we still need to grow the
    // renderer canvas and reposition the static walls so pills can fall to the
    // new bottom. Without this, expanding the window (e.g. entering full
    // screen) leaves the floor at the old height and pills appear to hover
    // mid-section.
    const handleSoftResize = useCallback(() => {
      if (!canvas.current || resetOnResize) return;
      const newWidth = canvas.current.offsetWidth;
      const newHeight = canvas.current.offsetHeight;
      if (render.current) {
        render.current.canvas.width = newWidth;
        render.current.canvas.height = newHeight;
        render.current.options.width = newWidth;
        render.current.options.height = newHeight;
        Render.setPixelRatio(render.current, window.devicePixelRatio);
      }
      const { floor, left, right, top } = wallsRef.current;
      if (floor) {
        Matter.Body.setPosition(floor, { x: newWidth / 2, y: newHeight + 10 });
        Matter.Body.scale(floor, newWidth / Math.max(floor.bounds.max.x - floor.bounds.min.x, 1), 1);
      }
      if (right) {
        Matter.Body.setPosition(right, { x: newWidth + 10, y: newHeight / 2 });
        Matter.Body.scale(right, 1, newHeight / Math.max(right.bounds.max.y - right.bounds.min.y, 1));
      }
      if (left) {
        Matter.Body.setPosition(left, { x: -10, y: newHeight / 2 });
        Matter.Body.scale(left, 1, newHeight / Math.max(left.bounds.max.y - left.bounds.min.y, 1));
      }
      if (top) {
        Matter.Body.setPosition(top, { x: newWidth / 2, y: -10 });
        Matter.Body.scale(top, newWidth / Math.max(top.bounds.max.x - top.bounds.min.x, 1), 1);
      }
      // Wake up sleeping/settled bodies so they fall to the new floor.
      bodiesMap.current.forEach(({ body }) => {
        Matter.Sleeping.set(body, false);
      });
    }, [resetOnResize]);

    const reset = useCallback(() => {
      stopEngine();
      bodiesMap.current.forEach(({ element, body, props }) => {
        body.angle = props.angle || 0;
        const x = calculatePosition(props.x, canvasSize.width, element.offsetWidth);
        const y = calculatePosition(props.y, canvasSize.height, element.offsetHeight);
        body.position.x = x;
        body.position.y = y;
      });
      updateElements();
      handleResize();
    }, [canvasSize, stopEngine, updateElements, handleResize]);

    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine, reset]
    );

    useEffect(() => {
      if (!resetOnResize) return;
      const debouncedResize = debounce(handleResize, 500);
      window.addEventListener("resize", debouncedResize);
      return () => {
        window.removeEventListener("resize", debouncedResize);
        debouncedResize.cancel();
      };
    }, [handleResize, resetOnResize]);

    useEffect(() => {
      if (resetOnResize) return;
      const debounced = debounce(handleSoftResize, 150);
      window.addEventListener("resize", debounced);
      return () => {
        window.removeEventListener("resize", debounced);
        debounced.cancel();
      };
    }, [handleSoftResize, resetOnResize]);

    useEffect(() => {
      initializeRenderer();
      return clearRenderer;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={cn("relative overflow-hidden", className)}
        >
          {children}
        </div>
      </GravityContext.Provider>
    );
  }
);

Gravity.displayName = "Gravity";
export { Gravity, MatterBody };
