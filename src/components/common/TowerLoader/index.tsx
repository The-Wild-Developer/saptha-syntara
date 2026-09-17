const Box = ({ className }: { className: string }) => (
  <div className={`box ${className}`}>
    <div className="side-left"></div>
    <div className="side-right"></div>
    <div className="side-top"></div>
  </div>
);

const TowerLoader = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`tower-loader ${className}`.trim()}
      role="status"
      aria-label="Loading"
    >
      <Box className="box-1" />
      <Box className="box-2" />
      <Box className="box-3" />
      <Box className="box-4" />
    </div>
  );
};

export default TowerLoader;
