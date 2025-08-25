import { toast } from "sonner";

export function CustomToast(title, description, type) {
  toast[type](title, {
    description: (
      <span
        style={{
          color: "#fff",
          opacity: 0.9,
          fontSize: "0.875rem",
          lineHeight: 1.4,
        }}
      >
        {description}
      </span>
    ),
    duration: 3000,
    position: "top-right",
    style: {
      "--normal-bg":
        type === "success"
          ? "#22c55e"
          : type === "error"
            ? "#ef4444"
            : "var(--popover)",
      "--normal-text": "#fff",
      "--normal-border": "transparent",
    },
  });
}

export default CustomToast;
