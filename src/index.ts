#!/usr/bin/env node

import { program } from "commander";

program
  .name("my-cli")
  .description("A CLI application built with Commander.js")
  .version("0.1.0");

program.parse();
