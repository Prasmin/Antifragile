import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { JournalProvider, useJournal } from "@/context/journal-context";

// Helper component to test the hook
function TestConsumer() {
  const { deletingEntryId, setDeletingEntryId } = useJournal();
  return (
    <div>
      <span data-testid="deleting-id">{deletingEntryId ?? "none"}</span>
      <button onClick={() => setDeletingEntryId("entry-123")}>
        Set Deleting
      </button>
      <button onClick={() => setDeletingEntryId(null)}>Clear Deleting</button>
    </div>
  );
}

describe("JournalContext", () => {
  it("provides default null deletingEntryId", () => {
    render(
      <JournalProvider>
        <TestConsumer />
      </JournalProvider>,
    );
    expect(screen.getByTestId("deleting-id").textContent).toBe("none");
  });

  it("updates deletingEntryId when set", async () => {
    render(
      <JournalProvider>
        <TestConsumer />
      </JournalProvider>,
    );

    const setButton = screen.getByText("Set Deleting");
    await act(async () => {
      setButton.click();
    });

    expect(screen.getByTestId("deleting-id").textContent).toBe("entry-123");
  });

  it("clears deletingEntryId", async () => {
    render(
      <JournalProvider>
        <TestConsumer />
      </JournalProvider>,
    );

    // Set then clear
    await act(async () => {
      screen.getByText("Set Deleting").click();
    });
    expect(screen.getByTestId("deleting-id").textContent).toBe("entry-123");

    await act(async () => {
      screen.getByText("Clear Deleting").click();
    });
    expect(screen.getByTestId("deleting-id").textContent).toBe("none");
  });

  it("throws when useJournal is used outside provider", () => {
    // Suppress React error boundary console output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      "useJournal must be used within a JournalProvider",
    );

    consoleSpy.mockRestore();
  });

  it("handles rapid successive updates", async () => {
    render(
      <JournalProvider>
        <TestConsumer />
      </JournalProvider>,
    );

    await act(async () => {
      screen.getByText("Set Deleting").click();
      screen.getByText("Clear Deleting").click();
      screen.getByText("Set Deleting").click();
    });

    // Final state should reflect the last update
    expect(screen.getByTestId("deleting-id").textContent).toBe("entry-123");
  });

  it("handles setting the same value twice", async () => {
    render(
      <JournalProvider>
        <TestConsumer />
      </JournalProvider>,
    );

    await act(async () => {
      screen.getByText("Set Deleting").click();
    });
    await act(async () => {
      screen.getByText("Set Deleting").click();
    });

    expect(screen.getByTestId("deleting-id").textContent).toBe("entry-123");
  });

  it("isolates state between separate providers", () => {
    function SecondConsumer() {
      const { deletingEntryId } = useJournal();
      return <span data-testid="second-id">{deletingEntryId ?? "none"}</span>;
    }

    render(
      <>
        <JournalProvider>
          <TestConsumer />
        </JournalProvider>
        <JournalProvider>
          <SecondConsumer />
        </JournalProvider>
      </>,
    );

    expect(screen.getByTestId("deleting-id").textContent).toBe("none");
    expect(screen.getByTestId("second-id").textContent).toBe("none");
  });

  it("shares state across multiple consumers under the same provider", async () => {
    function AnotherConsumer() {
      const { deletingEntryId } = useJournal();
      return <span data-testid="another-id">{deletingEntryId ?? "none"}</span>;
    }

    render(
      <JournalProvider>
        <TestConsumer />
        <AnotherConsumer />
      </JournalProvider>,
    );

    expect(screen.getByTestId("another-id").textContent).toBe("none");

    await act(async () => {
      screen.getByText("Set Deleting").click();
    });

    // Both consumers should reflect the updated value
    expect(screen.getByTestId("deleting-id").textContent).toBe("entry-123");
    expect(screen.getByTestId("another-id").textContent).toBe("entry-123");
  });

  it("handles empty string as a valid entry id", async () => {
    function EmptyStringConsumer() {
      const { deletingEntryId, setDeletingEntryId } = useJournal();
      return (
        <div>
          <span data-testid="empty-id">
            {deletingEntryId === null ? "null" : `"${deletingEntryId}"`}
          </span>
          <button onClick={() => setDeletingEntryId("")}>Set Empty</button>
        </div>
      );
    }

    render(
      <JournalProvider>
        <EmptyStringConsumer />
      </JournalProvider>,
    );

    expect(screen.getByTestId("empty-id").textContent).toBe("null");

    await act(async () => {
      screen.getByText("Set Empty").click();
    });

    // Empty string is truthy-different from null — should be stored as-is
    expect(screen.getByTestId("empty-id").textContent).toBe('""');
  });

  it("preserves state when children re-render", async () => {
    let renderCount = 0;

    function CountingConsumer() {
      const { deletingEntryId } = useJournal();
      renderCount++;
      return <span data-testid="counting-id">{deletingEntryId ?? "none"}</span>;
    }

    const { rerender } = render(
      <JournalProvider>
        <CountingConsumer />
      </JournalProvider>,
    );

    await act(async () => {
      // Trigger a re-render of the tree
      rerender(
        <JournalProvider>
          <CountingConsumer />
        </JournalProvider>,
      );
    });

    // State should still be the default after re-render
    expect(screen.getByTestId("counting-id").textContent).toBe("none");
    expect(renderCount).toBeGreaterThanOrEqual(2);
  });
});
