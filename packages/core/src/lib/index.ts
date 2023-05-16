import { App } from "../App";
import { createUserStore } from "./store/user";
export interface AppState {
  user: ReturnType<typeof createUserStore>
}

export function useAppEvents(app: App<AppState>): App<AppState> {
  app.onAppStart(async () => {
    app.state = {
      user: createUserStore(app.services.provider)
    };
  });
  return app;
}