import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface StackTooltipProps {
  visible: boolean;
  onDismiss: () => void;
}

export const StackTooltip = ({ visible, onDismiss }: StackTooltipProps) => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShown(false);
      return;
    }
    const t = setTimeout(() => setShown(true), 1500);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed left-1/2 font-body"
      style={{
        bottom: 60,
        transform: "translateX(-50%)",
        zIndex: 60,
        maxWidth: 320,
        width: "calc(100% - 32px)",
        backgroundColor: "#1A1510",
        borderRadius: 6,
        padding: "14px 18px",
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.5,
        opacity: shown ? 1 : 0,
        transition: "opacity 300ms ease-in",
        pointerEvents: shown ? "auto" : "none",
      }}
    >
      <span style={{ paddingRight: 24, display: "block" }}>
        Build your own stack as you browse. Click any tool to add it to your stack.
      </span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss tooltip"
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          color: "#9A8F82",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <X size={14} />
      </button>
      {/* Down-pointing triangle */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid #1A1510",
        }}
      />
    </div>
  );
};
