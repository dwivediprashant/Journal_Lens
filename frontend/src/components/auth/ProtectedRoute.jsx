import "./ProtectedRoute.css";
import { Show, SignIn } from "@clerk/react";

export const ProtectedRoute = ({ children }) => {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <div className="signin-modal-backdrop">
          <div className="signin-modal-card">
            <SignIn fallbackRedirectUrl="/" />
          </div>
        </div>
      </Show>
    </>
  );
};
