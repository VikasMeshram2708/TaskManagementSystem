import CreateTask from "@/components/CreateTask";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { AppRouterContextProviderMock } from "__mocks__/app-router-context-provider-mock";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient and QueryClientProvider
import '@testing-library/jest-dom'; // Ensure this is imported for custom matchers like toBeInTheDocument

describe("Create Task", () => {
  let queryClient;

  beforeEach(() => {
    // Create a new QueryClient instance before each test
    queryClient = new QueryClient();

    render(
      <AppRouterContextProviderMock>
        <SessionProvider session={null}>
          <QueryClientProvider client={queryClient}> {/* Wrap with QueryClientProvider */}
            <CreateTask tasks={[]} setTasks={jest.fn()} />
          </QueryClientProvider>
        </SessionProvider>
      </AppRouterContextProviderMock>
    );
  });

  it("renders a button", () => {
    const button = screen.getByRole("button", {
      name: "Add",
    });
    expect(button).toBeDefined();
  });

  it("toggles the visibility of the Create Task Modal", () => {
    // Initially, the modal should not be visible
    expect(screen.queryByTestId("create-task-modal")).not.toBeInTheDocument();

    // Click the "Add" button to show the modal
    const button = screen.getByRole("button", {
      name: "Add",
    });

    fireEvent.click(button);
    expect(screen.getByTestId("create-task-modal")).toBeInTheDocument();

    // Click the "Add" button again to hide the modal
    fireEvent.click(button);
    expect(screen.queryByTestId("create-task-modal")).not.toBeInTheDocument();
  });
});
