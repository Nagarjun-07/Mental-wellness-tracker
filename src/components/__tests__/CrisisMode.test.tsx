/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { render, screen, waitFor } from "@testing-library/react";
import { CrisisMode } from "../CrisisMode";
import { useUser } from "@/lib/hooks/useUser";
import { getBurnoutScore } from "@/app/actions";
import "@testing-library/jest-dom";

// Mock hooks and actions
jest.mock("@/lib/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  getBurnoutScore: jest.fn(),
}));

// Mock framer-motion to avoid animation issues and DOM warnings
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileHover, whileTap, transition, initial, animate, exit, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("CrisisMode Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render crisis alert if score is <= 80", async () => {
    (useUser as jest.Mock).mockReturnValue("user-123");
    (getBurnoutScore as jest.Mock).mockResolvedValue({ score: 75, explanation: "Safe" });

    render(<CrisisMode />);
    
    // We wait briefly to ensure state settles
    await waitFor(() => {
      expect(screen.queryByText("Exam Crisis Mode Activated")).not.toBeInTheDocument();
    });
  });

  it("renders crisis alert if score is > 80", async () => {
    (useUser as jest.Mock).mockReturnValue("user-123");
    (getBurnoutScore as jest.Mock).mockResolvedValue({ score: 85, explanation: "High risk" });

    render(<CrisisMode />);
    
    await waitFor(() => {
      expect(screen.getByText("Exam Crisis Mode Activated")).toBeInTheDocument();
      expect(screen.getByText("Your burnout risk is critically high.")).toBeInTheDocument();
      expect(screen.getByText("Stop studying immediately and take a 30-minute break.")).toBeInTheDocument();
    });
  });
});
