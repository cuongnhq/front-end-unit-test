import { describe, it, expect, vi } from "vitest";
import { setupCounter } from "../counter";

describe("setupCounter", () => {
  it("should set the initial counter value to 0", () => {
    const button = document.createElement("button");

    setupCounter(button);

    expect(button.innerHTML).toBe("count is 0");
  });

  it("should increment the counter when clicked", () => {
    const button = document.createElement("button");

    setupCounter(button);

    button.click();

    expect(button.innerHTML).toBe("count is 1");

    button.click();

    expect(button.innerHTML).toBe("count is 2");
  });

  it("should increment the counter correctly on multiple clicks", () => {
    const button = document.createElement("button");

    setupCounter(button);

    button.click();
    button.click();
    button.click();

    expect(button.innerHTML).toBe("count is 3");
  });
});
