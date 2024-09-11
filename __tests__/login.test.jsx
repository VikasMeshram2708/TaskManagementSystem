import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { AppRouterContextProviderMock } from "__mocks__/app-router-context-provider-mock";
import LoginPage from "app/login/page";
import { SessionProvider } from "next-auth/react";

describe("Page", () => {
  it("renders a heading", () => {
    render(
      <AppRouterContextProviderMock>
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      </AppRouterContextProviderMock>
    );

    const heading = screen.getByRole("heading", {
      name: "Login",
      level: 2,
    });

    expect(heading).toBeInTheDocument();
  });
});
