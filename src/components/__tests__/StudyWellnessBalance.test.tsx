/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StudyWellnessBalance } from "../StudyWellnessBalance";
import { evaluateStudyBalance } from "@/app/actions";
import "@testing-library/jest-dom";

// Mock actions
jest.mock("@/app/actions", () => ({
  evaluateStudyBalance: jest.fn(),
}));

// Mock framer-motion to avoid animation issues
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("StudyWellnessBalance Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders layout correctly with initial values", () => {
    render(<StudyWellnessBalance />);
    expect(screen.getByText("Study-Wellness Balance")).toBeInTheDocument();
    expect(screen.getByText("Let AI analyze your daily routine for optimal performance.")).toBeInTheDocument();

    expect(screen.getByLabelText("Study (hrs)")).toBeInTheDocument();
    expect(screen.getByLabelText("Sleep (hrs)")).toBeInTheDocument();
    expect(screen.getByLabelText("Exercise (min)")).toBeInTheDocument();
  });

  it("triggers evaluation and displays wellness score and feedback", async () => {
    const mockResult = {
      score: 82,
      feedback: "You have a stellar balance.",
      recommendation: "Maintain this schedule.",
    };
    (evaluateStudyBalance as jest.Mock).mockResolvedValue(mockResult);

    render(<StudyWellnessBalance />);
    
    const inputs = screen.getAllByRole("spinbutton");
    // Change values
    fireEvent.change(inputs[0], { target: { value: "8" } }); // Study
    fireEvent.change(inputs[1], { target: { value: "8" } }); // Sleep
    fireEvent.change(inputs[2], { target: { value: "45" } }); // Exercise

    const evaluateBtn = screen.getByRole("button", { name: "Evaluate Balance" });
    fireEvent.click(evaluateBtn);

    expect(evaluateStudyBalance).toHaveBeenCalledWith(8, 8, 45);

    await waitFor(() => {
      expect(screen.getByText("Wellness Score")).toBeInTheDocument();
      expect(screen.getByText("82/100")).toBeInTheDocument();
      expect(screen.getByText(/You have a stellar balance/)).toBeInTheDocument();
      expect(screen.getByText("Maintain this schedule.")).toBeInTheDocument();
    });
  });
});
