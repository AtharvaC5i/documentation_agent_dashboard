import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const METRICS_BASE_PATH = "C:/Programming and Coding/documentation_agent_dashboard/documentation_agent_json";

const apiPlugin = {
  name: "api-plugin",
  configureServer(server) {
    server.middlewares.use("/api/runs", (req, res) => {
      // return list of json files in the respective agent directory
      const url = new URL(req.url, `http://${req.headers.host}`);
      const agent = url.searchParams.get("agent");

      let agentFolder = "";
      if (agent === "technical-document") agentFolder = "technical-agent";
      else if (agent === "ppt") agentFolder = "ppt-agent";
      else if (agent === "brd") agentFolder = "brd-agent";

      if (!agentFolder) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid agent" }));
        return;
      }

      const dirPath = path.join(METRICS_BASE_PATH, agentFolder);
      try {
        if (!fs.existsSync(dirPath)) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify([]));
          return;
        }
        const files = fs
          .readdirSync(dirPath)
          .filter((f) => f.endsWith(".json"));
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(files));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });

    server.middlewares.use("/api/data", (req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const agent = url.searchParams.get("agent");
      const file = url.searchParams.get("file");

      let agentFolder = "";
      if (agent === "technical-document") agentFolder = "technical-agent";
      else if (agent === "ppt") agentFolder = "ppt-agent";
      else if (agent === "brd") agentFolder = "brd-agent";

      if (
        !agentFolder ||
        !file ||
        !file.endsWith(".json") ||
        file.includes("..")
      ) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid parameters" }));
        return;
      }

      const filePath = path.join(METRICS_BASE_PATH, agentFolder, file);
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          res.setHeader("Content-Type", "application/json");
          res.end(content);
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "File not found" }));
        }
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin],
});
