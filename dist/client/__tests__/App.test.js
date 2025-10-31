import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
});
afterEach(() => {
    jest.restoreAllMocks();
});
test("renders Item List heading", () => {
    render(_jsx(App, {}));
    expect(screen.getByText(/Item List/i)).toBeInTheDocument();
});
test("shows error when adding empty item", async () => {
    render(_jsx(App, {}));
    const addButton = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(addButton);
    await waitFor(() => {
        expect(screen.getByText(/Please enter a name/i)).toBeInTheDocument();
    });
});
