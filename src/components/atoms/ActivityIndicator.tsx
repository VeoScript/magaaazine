interface ActivityIndicatorProps {
  className: string;
  color?: string;
}

export default function ActivityIndicator({
  className,
  color,
}: ActivityIndicatorProps): JSX.Element {
  const getCurrentTheme = () =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : () => {};

  const isDarkMode = getCurrentTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className={className}
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke={color ? color : isDarkMode ? "#FFF" : "#000"}
        strokeWidth="10"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        ></animateTransform>
      </circle>
    </svg>
  );
}
