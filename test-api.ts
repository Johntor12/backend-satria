import { spawn } from "child_process";
import { exec } from "child_process";

const server = spawn("npx", ["ts-node", "src/server.ts"], { stdio: "pipe" });

let serverStarted = false;

server.stdout.on("data", (data) => {
  console.log("Server output:", data.toString());
  if (data.toString().includes("Server is running") && !serverStarted) {
    serverStarted = true;
    // Server started, make the request
    exec(
      `curl -X POST http://localhost:5000/api/company-collections -H "Content-Type: application/json" -d '{"companyName":"Test Risk Company","companyNickname":"TestRisk","sector":"Technology","etr_score":8.0,"margin_score":7.5,"rp_haven_score":9.0,"debt_score":6.5,"ownership_score":8.5,"conduct_score":7.0,"persistence_multiplier":1.1,"methods":["Transfer Pricing"],"revenue":1000000}'`,
      (error, stdout, stderr) => {
        console.log("API Response:", stdout);
        if (error) console.error("Error:", error);
        server.kill();
      },
    );
  }
});

server.stderr.on("data", (data) => {
  console.error("Server error:", data.toString());
});

setTimeout(() => {
  console.log("Timeout reached, killing server");
  server.kill();
}, 15000);
