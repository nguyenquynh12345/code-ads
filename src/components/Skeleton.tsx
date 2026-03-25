import React from "react";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`skeleton ${className}`}>
      <style jsx>{`
        .skeleton {
          background-color: #e2e8f0;
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0)
          );
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 0.5rem;
        }

        [data-bs-theme="dark"] .skeleton {
          background-color: #374151;
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0)
          );
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
