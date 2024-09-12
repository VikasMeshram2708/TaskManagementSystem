import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar"; // adjust the import path
import { useSession, signOut } from "next-auth/react";
import { MdOutlineLogout } from "react-icons/md";
import '@testing-library/jest-dom';

// Mock next-auth react hooks
jest.mock("next-auth/react");

describe("Navbar Component", () => {
  it("should render the Task Management title", () => {
    // Mock the session to be unauthenticated
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    const titleElement = screen.getByText("Task Management");
    expect(titleElement).toBeInTheDocument();
  });

  it("should show loading when session status is loading", () => {
    // Mock the session to be loading
    useSession.mockReturnValue({ data: null, status: "loading" });

    render(<Navbar />);

    const loadingElement = screen.getByText("Loading...");
    expect(loadingElement).toBeInTheDocument();
  });

  it("should render logout button when authenticated", () => {
    // Mock the session to be authenticated
    useSession.mockReturnValue({
      data: { user: { name: "John Doe", email: "johndoe@example.com" } },
      status: "authenticated",
    });

    render(<Navbar />);

    const logoutButton = screen.getByText("Logout");
    expect(logoutButton).toBeInTheDocument();
    expect(screen.getByRole('button')).toContainElement(
      screen.getByText("Logout")
    );

    const logoutIcon = screen.getByTestId("logout-icon");
    expect(logoutIcon).toBeInTheDocument();
  });

  it("should trigger signOut when logout button is clicked", () => {
    // Mock the session to be authenticated
    useSession.mockReturnValue({
      data: { user: { name: "John Doe", email: "johndoe@example.com" } },
      status: "authenticated",
    });

    const mockSignOut = jest.fn();
    signOut.mockImplementation(mockSignOut);

    render(<Navbar />);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalledWith("google");
  });

  it("should render login and sign up buttons when unauthenticated", () => {
    // Mock the session to be unauthenticated
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    const loginButton = screen.getByText("Login");
    const signupButton = screen.getByText("Sign Up");

    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });
});
