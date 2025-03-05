"use client";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="relative w-full h-[100px] overflow-hidden leading-[0]">
        {/* primare */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[100px]"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,213.3C672,235,768,245,864,229.3C960,213,1056,171,1152,170.7C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320L192,320L96,320L0,320Z"
            fill="#27595E"
          />
        </svg>

        {/* la segunda encima */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[100px]"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160L48,176C96,192,192,224,288,240C384,256,480,256,576,250.7C672,245,768,235,864,218.7C960,203,1056,181,1152,186.7C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320L192,320L96,320L0,320Z"
            fill="#254C5A"
            opacity="0.7"
          />
        </svg>
      </div>
    </footer>
  );
}
