/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { JournalHistory } from "../JournalHistory";
import { useUser } from "@/lib/hooks/useUser";
import { getJournalHistory, deleteJournalEntry } from "@/app/actions";
import "@testing-library/jest-dom";

// Mock hooks and actions
jest.mock("@/lib/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  getJournalHistory: jest.fn(),
  deleteJournalEntry: jest.fn(),
}));

// Mock ScrollArea component
jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

// Mock framer-motion to avoid animation issues
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("JournalHistory Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue("user-123");
  });

  it("renders loading state initially and then shows empty state if empty", async () => {
    (getJournalHistory as jest.Mock).mockResolvedValue([]);

    const { container } = render(<JournalHistory />);
    
    // Check loading indicator first (lucide spinner class exists)
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("No past journals found. Keep journaling!")).toBeInTheDocument();
    });
  });

  it("renders list of journals when loaded", async () => {
    const mockJournals = [
      { id: "1", text: "Entry 1 text content.", date: "Jun 10, 10:00 AM", emotions: ["Anxiety", "Stress"] },
      { id: "2", text: "Entry 2 text content.", date: "Jun 11, 11:00 AM", emotions: ["Peace", "Confidence"] },
    ];
    (getJournalHistory as jest.Mock).mockResolvedValue(mockJournals);

    render(<JournalHistory />);

    await waitFor(() => {
      expect(screen.getByText("Journal Archive")).toBeInTheDocument();
      expect(screen.getByText("Entry 1 text content.")).toBeInTheDocument();
      expect(screen.getByText("Entry 2 text content.")).toBeInTheDocument();
      expect(screen.getByText("Jun 10, 10:00 AM")).toBeInTheDocument();
      expect(screen.getByText("Anxiety")).toBeInTheDocument();
    });
  });

  it("handles entry deletion successfully", async () => {
    const mockJournals = [
      { id: "1", text: "Entry 1 to delete.", date: "Jun 10, 10:00 AM", emotions: ["Anxiety"] }
    ];
    (getJournalHistory as jest.Mock).mockResolvedValue(mockJournals);
    (deleteJournalEntry as jest.Mock).mockResolvedValue({ success: true });

    render(<JournalHistory />);

    await waitFor(() => {
      expect(screen.getByText("Entry 1 to delete.")).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTitle("Delete Entry");
    fireEvent.click(deleteBtn);

    // Verify it triggers deletion action
    expect(deleteJournalEntry).toHaveBeenCalledWith("1");

    // Verify optimistic removal in the DOM
    await waitFor(() => {
      expect(screen.queryByText("Entry 1 to delete.")).not.toBeInTheDocument();
    });
  });
});
