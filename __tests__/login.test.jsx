import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AppRouterContextProviderMock } from "__mocks__/app-router-context-provider-mock";
import LoginPage from "app/login/page";
import { SessionProvider, signIn } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  signIn: jest.fn(),
}));

describe("Login Page", () => {
  beforeEach(() => {
    // Common setup for each test
    render(
      <AppRouterContextProviderMock>
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      </AppRouterContextProviderMock>
    );
  });
  it("renders a heading", () => {
    const heading = screen.getByRole("heading", {
      name: "Login",
      level: 2,
    });

    expect(heading).toBeInTheDocument();
  });

  it("submits the form with correct data", async () => {
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "user1@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "user1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "user1@gmail.com",
        password: "user1",
      });
    });
  });
});
