/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AIJournal } from "../AIJournal";
import { useUser } from "@/lib/hooks/useUser";
import { analyzeJournalEntry } from "@/app/actions";
import { toast } from "sonner";
import "@testing-library/jest-dom";

// Mock hooks and actions
jest.mock("@/lib/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  analyzeJournalEntry: jest.fn(),
}));

jest.mock("@/components/ui/slider", () => ({
  Slider: ({ onValueChange, value }: any) => (
    <input
      type="range"
      data-testid="mood-slider"
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
    />
  ),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock framer-motion to avoid animation issues and DOM attribute warnings
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileHover, whileTap, transition, initial, animate, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, transition, initial, animate, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("AIJournal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue("user-123");
  });

  it("renders AI Journal titles and elements", () => {
    render(<AIJournal />);
    expect(screen.getByText("AI Wellness Journal")).toBeInTheDocument();
    expect(
      screen.getByText("Speak or type your thoughts. Our AI will uncover hidden patterns.")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("How are you feeling today? Any specific triggers?")).toBeInTheDocument();
  });

  it("submits entry successfully and clears field", async () => {
    (analyzeJournalEntry as jest.Mock).mockResolvedValue({ success: true });
    
    render(<AIJournal />);
    const textarea = screen.getByPlaceholderText("How are you feeling today? Any specific triggers?");
    
    fireEvent.change(textarea, { target: { value: "I am feeling extremely stressed about the exam tomorrow." } });
    expect(textarea).toHaveValue("I am feeling extremely stressed about the exam tomorrow.");

    const submitBtn = screen.getByRole("button", { name: /Analyze & Save/i });
    fireEvent.click(submitBtn);

    expect(analyzeJournalEntry).toHaveBeenCalledWith(
      "user-123",
      "Mood Level (0-100): 50. I am feeling extremely stressed about the exam tomorrow."
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Journal saved. AI has analyzed your emotional state.");
      expect(textarea).toHaveValue("");
    });
  });

  it("shows error toast if submission fails", async () => {
    (analyzeJournalEntry as jest.Mock).mockResolvedValue({ success: false, error: "AI error" });
    
    render(<AIJournal />);
    const textarea = screen.getByPlaceholderText("How are you feeling today? Any specific triggers?");
    fireEvent.change(textarea, { target: { value: "I am sad." } });

    const submitBtn = screen.getByRole("button", { name: /Analyze & Save/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("AI error");
    });
  });

  it("shows browser compatibility message if SpeechRecognition is not supported", () => {
    const originalSpeechRecognition = (window as any).SpeechRecognition;
    const originalWebkitSpeechRecognition = (window as any).webkitSpeechRecognition;
    
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;

    render(<AIJournal />);
    const micBtn = screen.getByRole("button", { name: /Start voice recording/i });
    fireEvent.click(micBtn);

    expect(toast.error).toHaveBeenCalledWith("Speech recognition is not supported in your browser.");

    // Restore
    (window as any).SpeechRecognition = originalSpeechRecognition;
    (window as any).webkitSpeechRecognition = originalWebkitSpeechRecognition;
  });

  it("toggles SpeechRecognition when supported and starts/stops recording", () => {
    const mockStart = jest.fn();
    const mockStop = jest.fn();
    
    const MockSpeechRecognition = jest.fn().mockImplementation(() => ({
      start: mockStart,
      stop: mockStop,
      continuous: false,
      interimResults: false,
      onresult: null,
      onerror: null,
    }));

    (window as any).SpeechRecognition = MockSpeechRecognition;

    render(<AIJournal />);
    const micBtn = screen.getByRole("button", { name: /Start voice recording/i });
    
    // Toggle start
    fireEvent.click(micBtn);
    expect(mockStart).toHaveBeenCalled();

    // Toggle stop
    fireEvent.click(screen.getByRole("button", { name: /Stop voice recording/i }));
    expect(mockStop).toHaveBeenCalled();

    // Clean up
    delete (window as any).SpeechRecognition;
  });
});
