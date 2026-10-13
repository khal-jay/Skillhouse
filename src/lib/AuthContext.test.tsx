import React from "react";
import { render, screen, fireEvent, renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  AuthProvider,
  AuthModals,
  useAuth,
  useAuthSafe,
  STORAGE_KEY_AUTH_USER,
  AUTH_CHANGE_EVENT,
  getServerAuthSnapshot,
  getAuthSnapshot,
} from "./AuthContext";

describe("AuthContext and AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("throws error when useAuth is called outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider"
    );
    spy.mockRestore();
  });

  it("returns null when useAuthSafe is called outside AuthProvider", () => {
    const { result } = renderHook(() => useAuthSafe());
    expect(result.current).toBeNull();
  });

  it("returns null from getServerAuthSnapshot for SSR hydration matching", () => {
    expect(getServerAuthSnapshot()).toBeNull();
  });

  it("initializes with null user when localStorage is empty", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isSignedIn).toBe(false);
  });

  it("initializes with user from localStorage if present", () => {
    const mockUser = {
      name: "Alex Vance",
      email: "alex@acme.dev",
      avatarUrl: "/figma/avatar.png",
      role: "Principal AI Engineer",
      provider: "google" as const,
      apiKey: "sk-live-sh-98f23c7b1a0e",
    };
    localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(mockUser));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isSignedIn).toBe(true);
  });

  it("handles login, updates state, and persists to localStorage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login();
    });

    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.user?.name).toBe("Alex Vance");
    expect(result.current.user?.email).toBe("alex@acme.dev");
    expect(localStorage.getItem(STORAGE_KEY_AUTH_USER)).toContain("alex@acme.dev");
  });

  it("handles github login", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("github");
    });

    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.user?.email).toBe("alex.vance@github.com");
  });

  it("handles logout, clears state, and clears localStorage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login();
    });
    expect(result.current.isSignedIn).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY_AUTH_USER)).toBeNull();
  });

  it("manages modal open/close states", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login modal
    act(() => {
      result.current.openLogin();
    });
    expect(result.current.isLoginOpen).toBe(true);
    act(() => {
      result.current.closeLogin();
    });
    expect(result.current.isLoginOpen).toBe(false);

    // Profile modal
    act(() => {
      result.current.openProfile("cli");
    });
    expect(result.current.isProfileOpen).toBe(true);
    expect(result.current.profileTab).toBe("cli");
    act(() => {
      result.current.closeProfile();
    });
    expect(result.current.isProfileOpen).toBe(false);

    // Help Center modal
    act(() => {
      result.current.openHelpCenter();
    });
    expect(result.current.isHelpCenterOpen).toBe(true);
    act(() => {
      result.current.closeHelpCenter();
    });
    expect(result.current.isHelpCenterOpen).toBe(false);

    // Request skill modal
    act(() => {
      result.current.openRequestSkill();
    });
    expect(result.current.isRequestSkillOpen).toBe(true);
    act(() => {
      result.current.closeRequestSkill();
    });
    expect(result.current.isRequestSkillOpen).toBe(false);
  });

  it("synchronizes state on storage and auth_change events", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    const newUser = {
      name: "Remote Vance",
      email: "remote@acme.dev",
      role: "Dev",
      provider: "google" as const,
      apiKey: "key",
      avatarUrl: "/figma/avatar.png",
    };
    localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(newUser));

    act(() => {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    });

    expect(result.current.user?.name).toBe("Remote Vance");

    localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    act(() => {
      window.dispatchEvent(new Event("storage"));
    });

    expect(result.current.user).toBeNull();
  });

  it("handles corrupted auth user JSON gracefully", () => {
    localStorage.setItem(STORAGE_KEY_AUTH_USER, "{invalid-auth-json");
    expect(getAuthSnapshot()).toBeNull();
  });

  it("renders null for AuthModals when rendered outside AuthProvider", () => {
    const { container } = render(<AuthModals />);
    expect(container.firstChild).toBeNull();
  });

  it("renders AuthModals inside AuthProvider and wires up actions", () => {
    function TestConsumer() {
      const auth = useAuth();
      return (
        <div>
          <button onClick={auth.openLogin}>Open Login</button>
          <button onClick={() => auth.openProfile("profile")}>Open Profile</button>
          <button onClick={auth.openHelpCenter}>Open Help</button>
          <button onClick={auth.openRequestSkill}>Open Request</button>
        </div>
      );
    }

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Open Login Modal via button
    fireEvent.click(screen.getByText("Open Login"));
    expect(screen.getByRole("dialog", { name: /welcome to skillhouse/i })).toBeInTheDocument();

    // Login via Google
    fireEvent.click(screen.getByTestId("login-google-btn"));
    expect(screen.queryByRole("dialog", { name: /welcome to skillhouse/i })).not.toBeInTheDocument();

    // Open Profile Modal
    fireEvent.click(screen.getByText("Open Profile"));
    expect(screen.getByTestId("user-profile-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /close dialog/i }));

    // Open Help Center Modal
    fireEvent.click(screen.getByText("Open Help"));
    expect(screen.getByTestId("help-center-modal")).toBeInTheDocument();

    // Trigger request skill from help center
    fireEvent.click(screen.getByRole("button", { name: /request a custom skill/i }));
    expect(screen.queryByTestId("help-center-modal")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: /request a skill/i })).toBeInTheDocument();
  });
});
