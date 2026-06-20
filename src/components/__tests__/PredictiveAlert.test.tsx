/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import { PredictiveAlert } from "../PredictiveAlert";
import { useUser } from "@/lib/hooks/useUser";
import { getDocs } from "firebase/firestore/lite";
import { ai } from "@/lib/gemini";
import "@testing-library/jest-dom";

// Mock hooks
jest.mock("@/lib/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

// Mock the Gemini AI
jest.mock("@/lib/gemini", () => ({
  ai: {
    models: {
      generateContent: jest.fn(),
    },
  },
}));

// Mock Firebase
jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore/lite", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock framer-motion to avoid animation issues
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("PredictiveAlert Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing if there are fewer than 3 journals (not enough data)", async () => {
    (useUser as jest.Mock).mockReturnValue("user-123");
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { data: () => ({ analysis: { burnoutRisk: 60 } }) },
      ],
    });

    const { container } = render(<PredictiveAlert />);
    
    // Briefly wait to ensure no render happens
    await new Promise((r) => setTimeout(r, 20));
    expect(container.firstChild).toBeNull();
  });

  it("renders predictive alert after calling Gemini with historical data", async () => {
    (useUser as jest.Mock).mockReturnValue("user-123");
    
    // Provide 3 journals (enough to trigger prediction)
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { data: () => ({ analysis: { burnoutRisk: 60 } }) },
        { data: () => ({ analysis: { burnoutRisk: 70 } }) },
        { data: () => ({ analysis: { burnoutRisk: 80 } }) },
      ],
    });

    (ai.models.generateContent as jest.Mock).mockResolvedValue({
      text: "Based on recent trends, your burnout risk might increase by 10% next week.",
    });

    render(<PredictiveAlert />);

    await waitFor(() => {
      expect(screen.getByText("7-Day Predictive AI Alert")).toBeInTheDocument();
      expect(
        screen.getByText("Based on recent trends, your burnout risk might increase by 10% next week.")
      ).toBeInTheDocument();
    });

    expect(ai.models.generateContent).toHaveBeenCalled();
  });
});
