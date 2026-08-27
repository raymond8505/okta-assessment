import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL's auto-cleanup only registers itself when a global afterEach exists at
// import time, which is fragile across runner versions. Registering explicitly
// keeps DOM state from leaking between tests regardless.
afterEach(() => {
  cleanup();
});
