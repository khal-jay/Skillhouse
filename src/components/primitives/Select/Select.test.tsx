import React, { useState } from "react";
import { render, screen, fireEvent, act, within, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  CustomSelect,
} from "./index";
import { Globe, Cpu } from "lucide-react";
import { useSelectContext } from "./SelectContext";

describe("Select Design System Primitive", () => {
  const options = [
    { value: "coding", label: "Development & coding" },
    { value: "design", label: "Design & creative" },
    { value: "writing", label: "Writing & content", disabled: true },
    { value: "research", label: "Research & analysis" },
  ];

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders compound API correctly and opens/closes on trigger click", () => {
    render(
      <Select defaultValue="coding">
        <SelectTrigger aria-label="Select Category">
          <SelectValue placeholder="Pick a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="coding">Development & coding</SelectItem>
          <SelectItem value="design">Design & creative</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox", { name: "Select Category" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Development & coding");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("handles declarative options prop seamlessly", () => {
    const handleChange = vi.fn();
    render(
      <Select
        id="cat-select"
        value="coding"
        options={options}
        onValueChange={handleChange}
        placeholder="Pick category"
      />
    );

    const trigger = screen.getByTestId("select-trigger-cat-select");
    expect(trigger).toHaveTextContent("Development & coding");

    fireEvent.click(trigger);
    const item = screen.getByTestId("select-item-design");
    fireEvent.click(item);

    expect(handleChange).toHaveBeenCalledWith("design");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("handles controlled and uncontrolled modes with interactive state", () => {
    const ControlledComponent = () => {
      const [val, setVal] = useState("coding");
      return (
        <div>
          <span data-testid="current-val">{val}</span>
          <Select value={val} onValueChange={setVal} options={options} id="controlled-sel" />
        </div>
      );
    };

    render(<ControlledComponent />);
    expect(screen.getByTestId("current-val")).toHaveTextContent("coding");

    const trigger = screen.getByTestId("select-trigger-controlled-sel");
    fireEvent.click(trigger);

    fireEvent.click(screen.getByTestId("select-item-research"));
    expect(screen.getByTestId("current-val")).toHaveTextContent("research");
  });

  it("skips disabled options during keyboard navigation and prevents selection", () => {
    const handleChange = vi.fn();
    render(
      <Select
        id="disabled-opt-sel"
        defaultValue="design"
        options={options}
        onValueChange={handleChange}
      />
    );

    const trigger = screen.getByTestId("select-trigger-disabled-opt-sel");
    fireEvent.click(trigger);

    // Click disabled option
    const disabledOption = screen.getByTestId("select-item-writing");
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(disabledOption);
    expect(handleChange).not.toHaveBeenCalled();

    // Arrow down from design should skip writing and go directly to research
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledWith("research");
  });

  it("prevents interaction when entire select is disabled", () => {
    render(
      <Select id="full-disabled" disabled options={options} defaultValue="coding" />
    );

    const trigger = screen.getByTestId("select-trigger-full-disabled");
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports searchable / filterable select and shows empty state when no match", () => {
    render(
      <Select id="search-sel" searchable options={options} defaultValue="" />
    );

    const trigger = screen.getByTestId("select-trigger-search-sel");
    fireEvent.click(trigger);

    const searchInput = screen.getByRole("textbox", { name: "Filter options" });
    expect(searchInput).toBeInTheDocument();

    // Filter to "research"
    fireEvent.change(searchInput, { target: { value: "research" } });
    expect(screen.getByTestId("select-item-research")).toBeInTheDocument();
    expect(screen.queryByTestId("select-item-coding")).not.toBeInTheDocument();

    // Filter to non-existent
    fireEvent.change(searchInput, { target: { value: "nonexistent query" } });
    expect(screen.getByText("No matching options")).toBeInTheDocument();
  });

  it("supports clearable action via clear button (X)", () => {
    const handleChange = vi.fn();
    render(
      <Select
        id="clear-sel"
        isClearable
        value="coding"
        options={options}
        onValueChange={handleChange}
      />
    );

    const clearBtn = screen.getByTestId("select-clear-clear-sel");
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("supports fast typeahead character search on keyboard", () => {
    const handleChange = vi.fn();
    render(
      <Select
        id="typeahead-sel"
        defaultValue="coding"
        options={options}
        onValueChange={handleChange}
      />
    );

    const trigger = screen.getByTestId("select-trigger-typeahead-sel");

    // Press 'r' to jump to "Research & analysis"
    fireEvent.keyDown(trigger, { key: "r" });
    expect(handleChange).toHaveBeenCalledWith("research");

    act(() => {
      vi.advanceTimersByTime(700);
    });

    // Type "des" to jump specifically to "Design & creative"
    fireEvent.keyDown(trigger, { key: "d" });
    fireEvent.keyDown(trigger, { key: "e" });
    fireEvent.keyDown(trigger, { key: "s" });
    expect(handleChange).toHaveBeenLastCalledWith("design");
  });

  it("renders loading state with spinner when isLoading is true", () => {
    render(
      <Select id="loading-sel" isLoading options={options} defaultValue="" />
    );

    const trigger = screen.getByTestId("select-trigger-loading-sel");
    fireEvent.click(trigger);

    expect(screen.getByText("Loading options...")).toBeInTheDocument();
  });

  it("handles form reset event resetting to defaultValue", () => {
    render(
      <form>
        <Select id="form-sel" defaultValue="coding" options={options} />
        <button type="reset">Reset Form</button>
      </form>
    );

    const trigger = screen.getByTestId("select-trigger-form-sel");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId("select-item-design"));
    expect(trigger).toHaveTextContent("Design & creative");

    // Trigger reset on form
    fireEvent.click(screen.getByText("Reset Form"));
    expect(trigger).toHaveTextContent("Development & coding");
  });

  it("renders rich options with icons, descriptions, and groups", () => {
    render(
      <Select id="rich-sel" defaultValue="web">
        <SelectTrigger>
          <SelectValue placeholder="Choose tool" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Automation Tools</SelectLabel>
            <SelectItem
              value="web"
              icon={<Globe data-testid="icon-globe" size={16} />}
              description="Extracts data from the live internet"
            >
              Web Surfer
            </SelectItem>
            <SelectItem
              value="cpu"
              icon={<Cpu data-testid="icon-cpu" size={16} />}
              description="Analyzes code performance"
            >
              Profiler
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("select-trigger-rich-sel");
    fireEvent.click(trigger);

    expect(screen.getByText("Automation Tools")).toBeInTheDocument();
    expect(screen.getAllByTestId("icon-globe")).toHaveLength(2);
    expect(screen.getByText("Extracts data from the live internet")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders mobile bottom sheet drawer when viewport width <= 640px", () => {
    // Simulate mobile viewport
    window.innerWidth = 500;
    fireEvent(window, new Event("resize"));

    render(
      <Select id="mobile-sel" options={options} defaultValue="coding" placeholder="Mobile Picker" />
    );

    const trigger = screen.getByTestId("select-trigger-mobile-sel");
    fireEvent.click(trigger);

    expect(screen.getByTestId("select-mobile-backdrop")).toBeInTheDocument();
    const sheet = screen.getByTestId("select-mobile-sheet-mobile-sel");
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByText("Mobile Picker")).toBeInTheDocument();

    // Close via backdrop click
    fireEvent.click(screen.getByTestId("select-mobile-backdrop"));
    expect(screen.queryByTestId("select-mobile-sheet-mobile-sel")).not.toBeInTheDocument();

    // Restore desktop width
    window.innerWidth = 1024;
    fireEvent(window, new Event("resize"));
  });

  it("applies size variants (sm, md, lg) and error styling", () => {
    const { rerender } = render(
      <Select id="size-sel" size="sm" error options={options} defaultValue="coding" />
    );

    const trigger = screen.getByTestId("select-trigger-size-sel");
    expect(trigger).toHaveAttribute("aria-invalid", "true");

    rerender(<Select id="size-sel" size="lg" options={options} defaultValue="coding" />);
    expect(trigger).not.toHaveAttribute("aria-invalid");
  });

  it("preserves backward compatibility with CustomSelect adapter", () => {
    const handleChange = vi.fn();
    render(
      <CustomSelect
        id="legacy-sel"
        value="coding"
        options={["coding", "design"]}
        onChange={handleChange}
      />
    );

    const trigger = screen.getByTestId("select-trigger-legacy-sel");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId("select-item-design"));

    expect(handleChange).toHaveBeenCalledWith("design");
  });

  it("throws when useSelectContext is called outside Select", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useSelectContext())).toThrow(
      "useSelectContext must be used within a <Select> component"
    );
    spy.mockRestore();
  });
});
