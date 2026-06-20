/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { render, screen } from "@testing-library/react";
import { AnimatedBackground } from "../AnimatedBackground";
import "@testing-library/jest-dom";

// Mock framer-motion to avoid animation issues and custom prop warnings
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileHover, whileTap, transition, initial, animate, ...props }: any) => {
      // Extract style/className and render
      const { style, className } = props;
      return <div className={className} style={style}>{children}</div>;
    },
  },
}));

describe("AnimatedBackground Component", () => {
  it("renders particles and aurora layers after mounting", () => {
    const { container } = render(<AnimatedBackground />);
    
    // Check that we have elements in the DOM (the fixed container)
    const backgroundContainer = container.querySelector(".fixed");
    expect(backgroundContainer).toBeInTheDocument();
    
    // There should be a noise overlay
    const noise = container.querySelector(".noise-overlay");
    expect(noise).toBeInTheDocument();

    // Check that some particle elements are created (floating particles)
    const particles = container.querySelectorAll(".absolute.rounded-full.bg-white");
    expect(particles.length).toBe(40);
  });
});
