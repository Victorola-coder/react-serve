#!/usr/bin/env node

import { Command } from "commander";
import { createReactServeApp } from "./create-app";
import { readFileSync } from "fs";
import { join } from "path";

const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);

const program = new Command();

program
  .name("create-react-serve")
  .description("Create a new ReactServe application")
  .version(packageJson.version);

program
  .argument("[project-name]", "Name of the project")
  .option("-t, --template <template>", "Template to use", "basic")
  .action(async (projectName?: string, options?: { template: string }) => {
    try {
      await createReactServeApp(projectName, options?.template || "basic");
    } catch (error) {
      console.error("Error creating ReactServe app:", error);
      process.exit(1);
    }
  });

program.parse();
