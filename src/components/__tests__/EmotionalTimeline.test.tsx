/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import { EmotionalTimeline } from "../EmotionalTimeline";
import { useUser } from "@/lib/hooks/useUser";
import { getEmotionalTimeline } from "@/app/actions";
import "@testing-library/jest-dom";

// Mock hooks and actions
jest.mock("@/lib/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  getEmotionalTimeline: jest.fn(),
}));

// Mock framer-motion to avoid animation issues
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Recharts to avoid JS layout / ResponsiveContainer issues in tests
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: ({ children, data }: any) => (
    <svg data-testid="area-chart" data-data={JSON.stringify(data)}>
      {children}
    </svg>
  ),
  Area: () => <g data-testid="chart-area" />,
  XAxis: () => <g />,
  YAxis: () => <g />,
  CartesianGrid: () => <g />,
  Tooltip: () => <g />,
}));

describe("EmotionalTimeline Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially and then shows empty state if no data", async () => {
    (useUser as jest.Mock).mockReturnValue("user-123");
    (getEmotionalTimeline as jest.Mock).mockResolvedValue([]);

    const { container } = render(<EmotionalTimeline />);
    
    // Check loading indicator first (lucide spinner class exists)
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("No emotional data available. Keep journaling!")).toBeInTheDocument();
    });
  });

  it("renders chart with data when populated", async () => {
    (useUser as jest.Mock).mockReturnValue("user-123");
    const mockData = [
      { date: "Jun 1", stress: 45, confidence: 70 },
      { date: "Jun 2", stress: 55, confidence: 65 },
    ];
    (getEmotionalTimeline as jest.Mock).mockResolvedValue(mockData);

    render(<EmotionalTimeline />);

    await waitFor(() => {
      expect(screen.getByText("Emotional Timeline")).toBeInTheDocument();
      expect(screen.getByText("Track your stress and confidence levels over the past 30 days.")).toBeInTheDocument();
      
      const chart = screen.getByTestId("area-chart");
      expect(chart).toBeInTheDocument();
      expect(chart.getAttribute("data-data")).toBe(JSON.stringify(mockData));
    });
  });
});
