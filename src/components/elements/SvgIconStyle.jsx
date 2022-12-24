export default function SvgIconStyle({ src, className, style }) {
  return (
    <div
      className={`svg-icon ${className}`}
      // eslint-disable-next-line react/no-unknown-property
      component="span"
      style={{
        ...style,
        display: "inline-block",
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
      }}
    />
  );
}
