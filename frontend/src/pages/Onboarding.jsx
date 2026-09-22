import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const slides = [
  {
    title: "Welcome to Nexora AI",
    description:
      "Your AI-powered business automation platform for leads, communication, support, bookings, and business operations.",
  },
  {
    title: "Automate Your Leads",
    description:
      "Find, qualify, organize, and manage potential customers with AI-powered lead generation and qualification.",
  },
  {
    title: "Let AI Handle Communication",
    description:
      "Connect Gmail and let Nexora AI help manage customer conversations, follow-ups, and business communication.",
  },
  {
    title: "Run Your Business Smarter",
    description:
      "Use AI agents, automation, RAG, bookings, support, and integrations from one unified platform.",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  function nextSlide() {
    if (!isLastSlide) {
      setCurrentSlide((current) => current + 1);
      return;
    }

    if (user) {
      localStorage.setItem(
        `nexora_onboarding_completed_${user.uid}`,
        "true"
      );
    }

    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-card">
        <div className="onboarding-content">
          <span className="onboarding-step">
            {currentSlide + 1} / {slides.length}
          </span>

          <h1>{slide.title}</h1>

          <p>{slide.description}</p>
        </div>

        <div className="onboarding-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`onboarding-dot ${
                index === currentSlide ? "active" : ""
              }`}
            />
          ))}
        </div>

        <div className="onboarding-actions">
          {currentSlide > 0 && (
            <button
              type="button"
              className="onboarding-back"
              onClick={() => setCurrentSlide((current) => current - 1)}
            >
              Back
            </button>
          )}

          <button
            type="button"
            className="onboarding-next"
            onClick={nextSlide}
          >
            {isLastSlide ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
