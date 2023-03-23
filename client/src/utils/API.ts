import { APISolution } from "../types/APISolution";

export default class API {

  private static handleError(error: any) {
    console.log(`API ERROR: ${error}`);
  }

  public static async sendJob(): Promise<boolean> {
    let success: boolean = false;

    return success;
  }

  public static async nextMove(): Promise<boolean> {
    let success: boolean = false;

    await fetch("/move")
    .then((data) => {
        console.log('200 - Move counter updated.');
        success = (data.status === 200);
      },
      (reason) => API.handleError(reason)
    );

    return success;
  }

  public static async getSolution(): Promise<APISolution | null> {
    let solution: APISolution | null = null;

    await fetch("/solution")
    .then(data => data.json())
    .then((data) => {
        solution = (data.body);
      },
      (reason) => API.handleError(reason)
    );

    return solution;
  }

  public static async getLog(): Promise<string> {
    let LogData: string = "ERROR";

    await fetch("/log").then(
      async (data) => LogData = await data.text(),
      (reason) => API.handleError(reason)
    );

    return LogData;
  }

  public static async sendLog(message: string, logType?: 'NONE' | 'SIGN_IN'): Promise<boolean> {
    let success: boolean = false;

    await fetch("/log", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, logType})
    }).then(
      async (data) => {
        console.log('200 - Log updated.');
        success = (data.status === 200);
      },
      (reason) => API.handleError(reason)
    );

    return success;
  }

  public static async checkForSession(): Promise<boolean> {
    let sessionExists: boolean = false;

    await fetch("/check").then(
      async (data) => sessionExists = (data.status === 200),
      (reason) => API.handleError(reason)
    );

    return sessionExists;
  }
}