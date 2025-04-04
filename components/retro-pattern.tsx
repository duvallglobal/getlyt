export default function RetroPattern({ className = "" }) {
  return (
    <div
      className={`${className} w-full h-full`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.2) 0%, transparent 10%),
          radial-gradient(circle at 75% 75%, rgba(27, 154, 170, 0.2) 0%, transparent 10%),
          radial-gradient(circle at 50% 50%, rgba(255, 191, 183, 0.2) 0%, transparent 10%)
        `,
        backgroundSize: "60px 60px",
        backgroundPosition: "0 0, 30px 30px, 15px 15px",
      }}
    />
  )
}

