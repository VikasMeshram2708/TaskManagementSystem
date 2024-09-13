import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AppRouterContextProviderMock } from "__mocks__/app-router-context-provider-mock";
import Navbar from "../components/Navbar";
import { SessionProvider, signOut, useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));

describe("Navbar Component", () => {
  const renderNavbar = (sessionData) => {
    useSession.mockReturnValue(sessionData);
    render(
      <AppRouterContextProviderMock>
        <SessionProvider session={sessionData}>
          <Navbar />
        </SessionProvider>
      </AppRouterContextProviderMock>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    renderNavbar({ status: "loading" });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders unauthenticated state", () => {
    renderNavbar({ status: "unauthenticated" });
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("renders authenticated state", () => {
    renderNavbar({
      status: "authenticated",
      data: { user: { firstname: "John" } },
    });
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("opens logout confirmation dialog", async () => {
    renderNavbar({
      status: "authenticated",
      data: { user: { firstname: "John" } },
    });
    
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "logout" } });
    
    await waitFor(() => {
      expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
    });
  });

  it("calls signOut when confirming logout", async () => {
    renderNavbar({
      status: "authenticated",
      data: { user: { firstname: "John" } },
    });
    
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "logout" } });
    
    await waitFor(() => {
      const confirmButton = screen.getByText("Logout");
      fireEvent.click(confirmButton);
      expect(signOut).toHaveBeenCalled();
    });
  });

  it("closes logout confirmation dialog when canceling", async () => {
    renderNavbar({
      status: "authenticated",
      data: { user: { firstname: "John" } },
    });
    
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "logout" } });
    
    await waitFor(() => {
      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);
      expect(screen.queryByText("Confirm Logout")).not.toBeInTheDocument();
    });
  });

  it("component has a display name", () => {
    expect(Navbar.displayName).toBe("Navbar");
  });
});