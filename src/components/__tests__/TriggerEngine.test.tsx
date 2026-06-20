/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import { TriggerEngine } from "../TriggerEngine";
import { useUser } from "@/lib/hooks/useUser";
import { getTriggerInsights } from "@/app/actions";
import "@testing-library/jest-dom";

// Mock hooks and actions
jest.mock("@/lib/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  getTriggerInsights: jest.fn(),
}));

// Mock Progress ui component
jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }: any) => <div data-testid="progress-bar" data-value={value} />,
}));

// Mock framer-motion to avoid animation issues
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("TriggerEngine Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially and then shows empty state if no triggers", async () => {
    (useUser as jest.Mock).mockReturnValue("user-123");
    (getTriggerInsights as jest.Mock).mockResolvedValue([]);

    const { container } = render(<TriggerEngine />);
    
    // Check spinner is rendered
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Not enough data")).toBeInTheDocument();
      expect(
        screen.getByText("Keep journaling for a few more days so the AI can identify your hidden stress patterns.")
      ).toBeInTheDocument();
    });
  });

  it("renders trigger list when triggers are present", async () => {
    (useUser as jest.Mock).mockReturnValue("user-123");
    const mockTriggers = [
      {
        trigger: "Late night studying",
        confidencePercent: 90,
        evidence: "Anxiety spikes at 2 AM entries",
        suggestedAction: "Study in the afternoon instead",
      },
    ];
    (getTriggerInsights as jest.Mock).mockResolvedValue(mockTriggers);

    render(<TriggerEngine />);

    await waitFor(() => {
      expect(screen.getByText("Hidden Triggers Detected")).toBeInTheDocument();
      expect(screen.getByText("Late night studying")).toBeInTheDocument();
      expect(screen.getByText(/Anxiety spikes at 2 AM entries/)).toBeInTheDocument();
      expect(screen.getByText("Study in the afternoon instead")).toBeInTheDocument();
      
      const progress = screen.getByTestId("progress-bar");
      expect(progress).toBeInTheDocument();
      expect(progress.getAttribute("data-value")).toBe("90");
    });
  });
});
