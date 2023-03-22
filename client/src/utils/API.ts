export default class API {
  public static async getLog() {
    let LogData: string = "ERROR";

    await fetch("/log").then(
      async (data) => (LogData = await data.text()),
      (reason) => (LogData = reason)
    );

    //return LogData;
    return "LOG_DATA";
  }
}
