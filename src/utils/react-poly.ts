import * as React from "react";

// Next.js 15 / React 19 compatibility polyfill for react-reconciler v0.27 and @react-three/fiber
const reactAny = React as unknown as {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: Record<string, unknown>;
  __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: Record<string, unknown>;
};

if (!reactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  const clientInternals =
    reactAny.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE || {};

  reactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
    ReactCurrentOwner: clientInternals.A || { current: null },
    ReactCurrentDispatcher: clientInternals.H || { current: null },
    ReactCurrentBatchConfig: clientInternals.T || { transition: null },
    ReactCurrentActQueue: clientInternals.actQueue || { current: null },
    ReactDebugCurrentFrame: {
      setExtraStackFrame: () => {},
      getCurrentStack: null,
      getStackAddendum: () => "",
    },
  };
} else if (!reactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner) {
  const clientInternals =
    reactAny.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE || {};
  reactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner =
    clientInternals.A || { current: null };
}

export {};
