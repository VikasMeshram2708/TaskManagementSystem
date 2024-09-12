import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { AppRouterContextProviderMock } from "__mocks__/app-router-context-provider-mock";
import SignUpPage from "../app/signup/page";
import { SessionProvider, signIn } from "next-auth/react";

// Mock the push
const mockPush = jest.fn();

// Mock the signIn function from next-auth
jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  signIn: jest.fn(),
}));

// Mock the global fetch API to avoid fetch errors
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Sign up successful" }),
  })
);

describe("Sign Up Page", () => {
  beforeEach(() => {
    render(
      <AppRouterContextProviderMock>
        <SessionProvider session={null}>
          <SignUpPage />
        </SessionProvider>
      </AppRouterContextProviderMock>
    );
  });

  it("renders a heading", () => {
    const heading = screen.getByRole("heading", {
      name: "Sign Up",
      level: 2,
    });

    expect(heading).toBeInTheDocument();
  });

  // it("creates a new user", async () => {
  //   const firstName = screen.getByPlaceholderText("First Name");
  //   const lastName = screen.getByPlaceholderText("Last Name");
  //   const email = screen.getByPlaceholderText("Email");
  //   const password = screen.getByPlaceholderText("Password");
  //   const confirmPassword = screen.getByPlaceholderText("Confirm Password");
  //   const signUpButton = screen.getByRole("button", { name: "Sign Up" });

  //   // Simulate user input
  //   fireEvent.change(firstName, { target: { value: "test" } });
  //   fireEvent.change(lastName, { target: { value: "testers" } });
  //   fireEvent.change(email, { target: { value: "test1@gmail.com" } });
  //   fireEvent.change(password, { target: { value: "test1" } });
  //   fireEvent.change(confirmPassword, { target: { value: "test1" } });

  //   // Simulate form submission
  //   fireEvent.click(signUpButton);

  //   await waitFor(() => {
  //     // Log to check if signIn is called
  //     console.log("signIn mock calls:", signIn.mock.calls);

  //     // Verify that signIn was called with correct parameters
  //     expect(signIn).not.toHaveBeenCalled(); // Adjust this line based on actual functionality
  //   });
  // });

  // it("checks the redirecting links", () => {
  //   const paragraph = screen.getByTestId("redirectLink");
  //   expect(paragraph).toBeDefined();
  // });
});
