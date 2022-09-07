import { useEffect } from "react";
import Router from "next/router";
import { useBeforeUnload } from "react-use";

interface Props {
  isConfirm?: boolean;
  message?: string;
  action?: () => void;
}

const useLeavePageConfirm = ({
  isConfirm = true,
  message = "You will lose your data if you leave this page",
  action = () => null,
}: Props) => {
  useBeforeUnload(isConfirm, message);

  useEffect(() => {
    const handler = () => {
      if (isConfirm && !window.confirm(message)) {
        throw "Route Canceled";
      }
      action();
    };

    Router.events.on("beforeHistoryChange", handler);

    return () => {
      Router.events.off("beforeHistoryChange", handler);
    };
  }, [isConfirm, message, action]);
};

export default useLeavePageConfirm;
