/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CompanionChat } from "../CompanionChat";
import { useUser } from "@/lib/hooks/useUser";
import { chatWithCompanion } from "@/app/actions";
import "@testing-library/jest-dom";

// Mock hooks and actions
jest.mock("@/lib/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  chatWithCompanion: jest.fn(),
}));

jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

// Mock framer-motion to avoid animation issues and DOM attribute warnings
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileHover, whileTap, transition, initial, animate, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, transition, initial, animate, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("CompanionChat Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue("user-123");
    
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("renders welcome message initially", () => {
    render(<CompanionChat />);
    expect(screen.getByText("AI Wellness Coach")).toBeInTheDocument();
    expect(
      screen.getByText("Hi there. I'm your wellness companion. How are you feeling today? I'm here to listen, without judgment.")
    ).toBeInTheDocument();
  });

  it("sends message and renders response", async () => {
    (chatWithCompanion as jest.Mock).mockResolvedValue("I hear you. Take a deep breath.");
    
    render(<CompanionChat />);
    const input = screen.getByPlaceholderText("Type your message...");
    
    fireEvent.change(input, { target: { value: "I feel stressed out" } });
    expect(input).toHaveValue("I feel stressed out");

    const submitBtn = screen.getByRole("button");
    fireEvent.click(submitBtn);

    // Verify chatWithCompanion is called with history
    expect(chatWithCompanion).toHaveBeenCalledWith(
      "user-123",
      "I feel stressed out",
      [
        {
          role: "companion",
          content: "Hi there. I'm your wellness companion. How are you feeling today? I'm here to listen, without judgment.",
        },
      ]
    );

    // Verify companion response is rendered
    await waitFor(() => {
      expect(screen.getByText("I hear you. Take a deep breath.")).toBeInTheDocument();
    });
  });
});
