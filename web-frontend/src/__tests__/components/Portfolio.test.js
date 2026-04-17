import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Portfolio from "../../components/Portfolio";

const theme = createTheme();
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe("Portfolio Component", () => {
  const mockFetchData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    mockFetchData.mockReturnValue(new Promise(() => {})); // never resolves
    render(
      <TestWrapper>
        <Portfolio fetchData={mockFetchData} />
      </TestWrapper>,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders portfolio data correctly", async () => {
    const mockData = [
      { id: "1", name: "Bitcoin", value: 50000, symbol: "BTC", change: 3.2 },
      { id: "2", name: "Ethereum", value: 3000, symbol: "ETH", change: -1.4 },
    ];
    mockFetchData.mockResolvedValue(mockData);

    render(
      <TestWrapper>
        <Portfolio fetchData={mockFetchData} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("Ethereum")).toBeInTheDocument();
    });
  });

  test("handles API errors gracefully", async () => {
    mockFetchData.mockRejectedValue(new Error("API Error"));

    render(
      <TestWrapper>
        <Portfolio fetchData={mockFetchData} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  test("filters tokens by search input", async () => {
    const mockData = [
      { id: "1", name: "Bitcoin", value: 50000, symbol: "BTC", change: 3.2 },
      { id: "2", name: "Ethereum", value: 3000, symbol: "ETH", change: -1.4 },
    ];
    mockFetchData.mockResolvedValue(mockData);

    render(
      <TestWrapper>
        <Portfolio fetchData={mockFetchData} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search tokens/i);
    fireEvent.change(searchInput, { target: { value: "Bit" } });

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.queryByText("Ethereum")).not.toBeInTheDocument();
  });

  test("renders no tokens message when empty", async () => {
    mockFetchData.mockResolvedValue([]);

    render(
      <TestWrapper>
        <Portfolio fetchData={mockFetchData} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/no tokens found/i)).toBeInTheDocument();
    });
  });

  test("uses default mock data when no fetchData prop provided", async () => {
    render(
      <TestWrapper>
        <Portfolio />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    });
  });
});
