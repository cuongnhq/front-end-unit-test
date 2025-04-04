import { describe, it, expect } from "vitest";
import { setupCounter } from "../counter";

// Mock the DOM environment
globalThis.document.body.innerHTML = `
  <div id="app">
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="/typescript.svg" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button">count is 0</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

describe("Main App", async () => {
  await import("../main");

  it('should display the initial counter value as "count is 0"', () => {
    const counterButton = document.querySelector(
      "#counter"
    ) as HTMLButtonElement;

    // Ensure initial counter text is 'count is 0'
    expect(counterButton.textContent).toBe("count is 0");
  });

  it("should increment the counter on button click", async () => {
    const counterButton = document.querySelector(
      "#counter"
    ) as HTMLButtonElement;

    // Set up the counter (this is where the click handler is attached)
    setupCounter(counterButton);

    // Simulate a click event on the counter button
    counterButton.click();

    // Wait for the DOM to be updated (ensure async updates have occurred)
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check if the counter text is updated to 'count is 1'
    expect(counterButton.textContent).toBe("count is 1");
  });

  it("should increment the counter correctly after multiple clicks", async () => {
    const counterButton = document.querySelector(
      "#counter"
    ) as HTMLButtonElement;

    // Set up the counter (this is where the click handler is attached)
    setupCounter(counterButton);

    // Simulate multiple click events on the counter button
    counterButton.click();
    counterButton.click();

    // Wait for the DOM to be updated
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check if the counter text is updated to 'count is 2'
    expect(counterButton.textContent).toBe("count is 2");
  });
});
