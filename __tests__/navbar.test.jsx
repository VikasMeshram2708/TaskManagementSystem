import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

describe("Page", () => {
  it("renders a heading", () => {
    render(
      <SessionProvider session={null}>
        <Navbar />
      </SessionProvider>
    );

    const heading = screen.getByRole("heading", {
      name: "Task Management",
      level: 2,
    });

    expect(heading).toBeInTheDocument();
  });
});
