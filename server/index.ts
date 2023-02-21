import Container from "typedi";
import Server from "./modules/Server";
import DatabaseManager from "./modules/DatabaseManager";

const server: Server = Container.get(Server);

Container.get(DatabaseManager).up();
console.log("Starting Cranium Server...");

process.on('uncaughtException', (error: Error) => {
  // Close listener gracefully
  server.close();
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  // Close listener gracefully
  server.close();
  console.error(error);
  process.exit(1);
});

// Start backend
server
.start()
.catch((error: Error) => {
  console.log(error);
  process.exit(1);
});
