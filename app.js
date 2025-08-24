#!/usr/bin/env node

import chalk from "chalk";
import enquirer from "enquirer";
import fs from "fs";
import path from "path";
import { execa } from "execa";
import ora from "ora";

const { prompt } = enquirer;

// ----------------- Helper Functions -----------------
function createFolder(folderPath) {
  const spinner = ora({
    text: `📁 Creating folder: ${folderPath}`,
    color: "cyan",
  }).start();
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      spinner.succeed(`📁 Folder created: ${folderPath}`);
    } else {
      spinner.info(`📁 Folder already exists: ${folderPath}`);
    }
  } catch (err) {
    spinner.fail(`❌ Failed to create folder: ${folderPath}`);
    console.error(err);
    process.exit(1);
  }
}

function createEnvFile(dirPath, type = "frontend") {
  const spinner = ora({
    text: `⚙️  Creating environment file for ${type}`,
    color: "yellow",
  }).start();

  try {
    const envPath = path.join(dirPath, ".env");
    let envContent = "";

    if (type === "frontend") {
      envContent = `# Frontend Environment Variables
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=My Frontend App
VITE_APP_VERSION=1.0.0

# Database URL (if using client-side DB operations)
# VITE_DATABASE_URL=

# Third-party API Keys (Remember: These will be exposed to the client!)
# VITE_GOOGLE_MAPS_API_KEY=
# VITE_STRIPE_PUBLISHABLE_KEY=

# Development Settings
NODE_ENV=development
`;
    } else if (type === "backend") {
      envContent = `# Backend Environment Variables
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
# DATABASE_URL="mongodb://localhost:27017/mydb"
# DATABASE_URL="mysql://username:password@localhost:3306/mydb"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (if using nodemailer)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password

# Redis Configuration (if using redis)
# REDIS_URL=redis://localhost:6379

# Third-party API Keys
# STRIPE_SECRET_KEY=
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
`;
    }

    fs.writeFileSync(envPath, envContent, "utf-8");
    spinner.succeed(`⚙️  Environment file created: ${envPath}`);
  } catch (err) {
    spinner.fail(`❌ Failed to create environment file for ${type}`);
    console.error(err);
  }
}

async function runCommand(cmd, args = [], cwd = process.cwd(), message = null) {
  const defaultMessage = `🔧 ${cmd} ${args.join(" ")}`;
  const spinner = ora({
    text: message || defaultMessage,
    color: "blue",
  }).start();

  try {
    await execa(cmd, args, { stdio: "inherit", cwd });
    spinner.succeed(message ? `✅ ${message}` : `✅ Completed: ${cmd}`);
  } catch (err) {
    spinner.fail(`❌ Command failed: ${cmd} ${args.join(" ")}`);
    console.error(err);
    process.exit(1);
  }
}

async function setupProject({ frontendOptions, backendOptions }) {
  // ----------------- FRONTEND -----------------
  if (frontendOptions.framework && frontendOptions.framework !== "None") {
    const frontendDir = path.join(process.cwd(), "frontend");
    createFolder(frontendDir);

    // React + Tailwind with Tailwind v4
    if (frontendOptions.framework === "React + Tailwind") {
      await runCommand(
        "npm",
        ["create", "vite@latest", ".", "--", "--template", "react"],
        frontendDir,
        "Setting up React with Vite"
      );

      // Install Tailwind CSS v4
      await runCommand(
        "npm",
        ["install", "-D", "tailwindcss", "@tailwindcss/vite"],
        frontendDir,
        "Installing Tailwind CSS v4"
      );

      // Update vite.config.js to include React plugin and Tailwind
      const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`;

      fs.writeFileSync(
        path.join(frontendDir, "vite.config.js"),
        viteConfigContent,
        "utf-8"
      );

      // Update src/index.css with Tailwind v4 import
      const cssContent = `@import "tailwindcss";

/* Your custom styles here */`;

      fs.writeFileSync(
        path.join(frontendDir, "src", "index.css"),
        cssContent,
        "utf-8"
      );
    }

    // React TS + Tailwind with Tailwind v4
    if (frontendOptions.framework === "React TS + Tailwind") {
      await runCommand(
        "npm",
        ["create", "vite@latest", ".", "--", "--template", "react-ts"],
        frontendDir,
        "Setting up React with TypeScript and Vite"
      );

      await runCommand(
        "npm",
        ["install", "-D", "tailwindcss", "@tailwindcss/vite"],
        frontendDir,
        "Installing Tailwind CSS v4"
      );

      // Update vite.config.ts
      const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`;

      fs.writeFileSync(
        path.join(frontendDir, "vite.config.ts"),
        viteConfigContent,
        "utf-8"
      );

      // Update src/index.css
      const cssContent = `@import "tailwindcss";

/* Your custom styles here */`;

      fs.writeFileSync(
        path.join(frontendDir, "src", "index.css"),
        cssContent,
        "utf-8"
      );
    }

    // Next.js + Tailwind (Next.js 14+ with Tailwind v4)
    if (frontendOptions.framework === "Next.js + Tailwind") {
      // 1. Create your Next.js project with Turbo and all options
      await runCommand(
        "npx",
        [
          "create-next-app@latest",
          ".",
          "--js",
          "--no-tailwind", // We'll add v4 manually
          "--eslint",
          "--app",
          "--no-src-dir",
          "--import-alias",
          "@/*",
          "--turbo",
          "--yes",
        ],
        frontendDir,
        "Setting up Next.js project with Turbo"
      );

      // 2. Install Tailwind CSS v4, PostCSS, and the Tailwind PostCSS plugin
      await runCommand(
        "npm",
        ["install", "-D", "tailwindcss@4", "@tailwindcss/postcss", "postcss"],
        frontendDir,
        "Installing Tailwind CSS v4 and PostCSS"
      );

      // 3. Create postcss.config.mjs for Tailwind v4
      const postcssConfigContent = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`;
      fs.writeFileSync(
        path.join(frontendDir, "postcss.config.mjs"),
        postcssConfigContent,
        "utf-8"
      );

      // 4. Create tailwind.config.js
      const tailwindConfigContent = `module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
      fs.writeFileSync(
        path.join(frontendDir, "tailwind.config.js"),
        tailwindConfigContent,
        "utf-8"
      );

      // 5. Update globals.css
      const cssContent = `@import "tailwindcss";

/* Your custom styles here */
`;
      fs.writeFileSync(
        path.join(frontendDir, "app", "globals.css"),
        cssContent,
        "utf-8"
      );
    }

    // Next.js TS + Tailwind
    if (frontendOptions.framework === "Next.js TS + Tailwind") {
      // 1. Create Next.js project with TypeScript and src dir
      await runCommand(
        "npx",
        [
          "create-next-app@latest",
          ".",
          "--ts",
          "--no-tailwind", // We'll add Tailwind v4 manually
          "--eslint",
          "--app",
          "--no-src-dir",
          "--import-alias",
          "@/*",
          "--yes",
        ],
        frontendDir,
        "Setting up Next.js with TypeScript"
      );

      // 2. Install Tailwind v4, PostCSS, and @tailwindcss/postcss plugin
      await runCommand(
        "npm",
        ["install", "-D", "tailwindcss@4", "postcss", "@tailwindcss/postcss"],
        frontendDir,
        "Installing Tailwind CSS v4 and PostCSS"
      );

      // 3. Create postcss.config.mjs
      const postcssConfigContent = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`;
      fs.writeFileSync(
        path.join(frontendDir, "postcss.config.mjs"),
        postcssConfigContent,
        "utf-8"
      );

      // 4. Create tailwind.config.js
      const tailwindConfigContent = `module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
      fs.writeFileSync(
        path.join(frontendDir, "tailwind.config.js"),
        tailwindConfigContent,
        "utf-8"
      );

      // 5. Update globals.css in src/app
      const cssContent = `@import "tailwindcss";

/* Your custom styles here */`;
      fs.writeFileSync(
        path.join(frontendDir, "src", "app", "globals.css"),
        cssContent,
        "utf-8"
      );

      // 6. Optional: Update next.config.ts for Tailwind optimization
      const nextConfigContent = `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@tailwindcss/ui']
  }
}

export default nextConfig`;
      fs.writeFileSync(
        path.join(frontendDir, "next.config.ts"),
        nextConfigContent,
        "utf-8"
      );
    }

    // Vue + Tailwind with Tailwind v4
    if (frontendOptions.framework === "Vue + Tailwind") {
      await runCommand(
        "npm",
        ["create", "vite@latest", ".", "--", "--template", "vue"],
        frontendDir,
        "Setting up Vue.js with Vite"
      );

      await runCommand(
        "npm",
        ["install", "-D", "tailwindcss", "@tailwindcss/vite"],
        frontendDir,
        "Installing Tailwind CSS v4"
      );

      // Update vite.config.js
      const viteConfigContent = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})`;

      fs.writeFileSync(
        path.join(frontendDir, "vite.config.js"),
        viteConfigContent,
        "utf-8"
      );

      // Create/Update style.css
      const cssContent = `@import "tailwindcss";

/* Your custom styles here */`;

      fs.writeFileSync(
        path.join(frontendDir, "src", "style.css"),
        cssContent,
        "utf-8"
      );
    }

    // Install frontend tools
    if (frontendOptions.tools?.length) {
      const toolsMap = {
        "shadcn/ui": [
          "@radix-ui/react-slot",
          "class-variance-authority",
          "clsx",
          "tailwind-merge",
        ],
        "material ui": ["@mui/material", "@emotion/react", "@emotion/styled"],
        "Lucide Icons": ["lucide-react"],
        "react-icons": ["react-icons"],
        Zod: ["zod"],
        Axios: ["axios"],
        "framer motion": ["framer-motion"],
        Redux: ["@reduxjs/toolkit", "react-redux"],
        zustand: ["zustand"],
      };

      const packagesToInstall = [];
      frontendOptions.tools.forEach((tool) => {
        if (toolsMap[tool]) {
          packagesToInstall.push(...toolsMap[tool]);
        }
      });

      if (packagesToInstall.length > 0) {
        await runCommand(
          "npm",
          ["install", ...packagesToInstall],
          frontendDir,
          "Installing frontend tools"
        );
      }
    }

    // Create environment file for frontend
    createEnvFile(frontendDir, "frontend");

    console.log(chalk.green("✅ Frontend setup completed!"));
  }

  // ----------------- BACKEND -----------------
  if (backendOptions.framework && backendOptions.framework !== "None") {
    const backendDir = path.join(process.cwd(), "backend");
    createFolder(backendDir);

    // Initialize package.json
    await runCommand(
      "npm",
      ["init", "-y"],
      backendDir,
      "Initializing package.json for backend"
    );

    // Install frameworks
    const frameworkPackages = [];

    if (backendOptions.framework.includes("Express")) {
      frameworkPackages.push("express");
      if (backendOptions.framework.includes("ts")) {
        frameworkPackages.push(
          "@types/express",
          "typescript",
          "ts-node",
          "@types/node"
        );
      }
    }

    if (backendOptions.framework.includes("Hapi")) {
      frameworkPackages.push("@hapi/hapi");
      if (backendOptions.framework.includes("ts")) {
        frameworkPackages.push(
          "@types/hapi__hapi",
          "typescript",
          "ts-node",
          "@types/node"
        );
      }
    }

    if (backendOptions.framework.includes("Koa")) {
      frameworkPackages.push("koa");
      if (backendOptions.framework.includes("ts")) {
        frameworkPackages.push(
          "@types/koa",
          "typescript",
          "ts-node",
          "@types/node"
        );
      }
    }

    if (frameworkPackages.length > 0) {
      const devPackages = frameworkPackages.filter(
        (pkg) =>
          pkg.startsWith("@types/") || pkg === "typescript" || pkg === "ts-node"
      );
      const regularPackages = frameworkPackages.filter(
        (pkg) => !devPackages.includes(pkg)
      );

      if (regularPackages.length > 0) {
        await runCommand(
          "npm",
          ["install", ...regularPackages],
          backendDir,
          "Installing backend framework packages"
        );
      }
      if (devPackages.length > 0) {
        await runCommand(
          "npm",
          ["install", "-D", ...devPackages],
          backendDir,
          "Installing backend development dependencies"
        );
      }
    }

    // Handle Database/ORM
    if (backendOptions.db) {
      const dbPackages = [];

      if (backendOptions.db === "MongoDB") {
        dbPackages.push("mongoose");
      } else if (backendOptions.db === "Postgres") {
        dbPackages.push("pg");
        if (backendOptions.framework.includes("ts")) {
          dbPackages.push("@types/pg");
        }
      } else if (backendOptions.db === "MySQL") {
        dbPackages.push("mysql2");
      } else if (backendOptions.db === "SQLite") {
        dbPackages.push("sqlite3");
      }

      if (dbPackages.length > 0) {
        const devDbPackages = dbPackages.filter((pkg) =>
          pkg.startsWith("@types/")
        );
        const regularDbPackages = dbPackages.filter(
          (pkg) => !devDbPackages.includes(pkg)
        );

        if (regularDbPackages.length > 0) {
          await runCommand(
            "npm",
            ["install", ...regularDbPackages],
            backendDir,
            "Installing database packages"
          );
        }
        if (devDbPackages.length > 0) {
          await runCommand(
            "npm",
            ["install", "-D", ...devDbPackages],
            backendDir,
            "Installing database type definitions"
          );
        }
      }
    }

    // Handle ORM
    if (backendOptions.orm) {
      if (backendOptions.orm === "Prisma") {
        await runCommand(
          "npm",
          ["install", "prisma", "@prisma/client"],
          backendDir,
          "Installing Prisma ORM"
        );
        await runCommand(
          "npx",
          ["prisma", "init"],
          backendDir,
          "Initializing Prisma"
        );
      } else if (backendOptions.orm === "Sequelize") {
        await runCommand(
          "npm",
          ["install", "sequelize"],
          backendDir,
          "Installing Sequelize ORM"
        );
        if (backendOptions.framework.includes("ts")) {
          await runCommand(
            "npm",
            ["install", "-D", "@types/sequelize"],
            backendDir,
            "Installing Sequelize type definitions"
          );
        }
      } else if (backendOptions.orm === "TypeORM") {
        await runCommand(
          "npm",
          ["install", "typeorm", "reflect-metadata"],
          backendDir,
          "Installing TypeORM"
        );
      }
    }

    // Install backend tools
    if (backendOptions.tools?.length) {
      const toolsMap = {
        bcypt: ["bcrypt", "@types/bcrypt"],
        zod: ["zod"],
        "jsonwebtoken (JWT)": ["jsonwebtoken", "@types/jsonwebtoken"],
        jose: ["jose"],
        helmet: ["helmet"],
        cors: ["cors", "@types/cors"],
        redis: ["redis"],
        dotenv: ["dotenv"],
        nodemailer: ["nodemailer", "@types/nodemailer"],
        nodemon: ["nodemon"],
      };

      const toolPackages = [];
      const devToolPackages = [];

      backendOptions.tools.forEach((tool) => {
        if (toolsMap[tool]) {
          toolsMap[tool].forEach((pkg) => {
            if (pkg.startsWith("@types/") || pkg === "nodemon") {
              devToolPackages.push(pkg);
            } else {
              toolPackages.push(pkg);
            }
          });
        }
      });

      if (toolPackages.length > 0) {
        await runCommand(
          "npm",
          ["install", ...toolPackages],
          backendDir,
          "Installing backend tools"
        );
      }
      if (
        devToolPackages.length > 0 &&
        backendOptions.framework.includes("ts")
      ) {
        await runCommand(
          "npm",
          ["install", "-D", ...devToolPackages],
          backendDir,
          "Installing backend development tools"
        );
      }
    }

    // Create basic server file
    const isTypeScript = backendOptions.framework.includes("ts");
    const serverFileName = isTypeScript ? "server.ts" : "server.js";
    const serverFilePath = path.join(backendDir, serverFileName);

    let serverContent = "";
    if (backendOptions.framework.includes("Express")) {
      serverContent = isTypeScript
        ? `import express, { Request, Response } from 'express';
import cors from 'cors';
${backendOptions.tools?.includes("dotenv") ? "import 'dotenv/config';" : ""}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
        : `const express = require('express');
const cors = require('cors');
${backendOptions.tools?.includes("dotenv") ? "require('dotenv').config();" : ""}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`;
    }

    if (serverContent) {
      fs.writeFileSync(serverFilePath, serverContent, "utf-8");
    }

    // Update package.json scripts
    const packageJsonPath = path.join(backendDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      packageJson.scripts = {
        ...packageJson.scripts,
        start: isTypeScript ? "ts-node server.ts" : "node server.js",
        dev: backendOptions.tools?.includes("nodemon")
          ? isTypeScript
            ? "nodemon --exec ts-node server.ts"
            : "nodemon server.js"
          : isTypeScript
          ? "ts-node server.ts"
          : "node server.js",
      };

      if (isTypeScript) {
        packageJson.scripts.build = "tsc";
      }

      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf-8"
      );
    }

    // Create TypeScript config if needed
    if (isTypeScript) {
      const tsconfigContent = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*", "*.ts"],
  "exclude": ["node_modules", "dist"]
}`;

      fs.writeFileSync(
        path.join(backendDir, "tsconfig.json"),
        tsconfigContent,
        "utf-8"
      );
    }

    // Create environment file for backend
    createEnvFile(backendDir, "backend");

    console.log(chalk.green("✅ Backend setup completed!"));
  }

  console.log(chalk.greenBright("🎉 Project setup complete!"));

  // Print next steps
  console.log(chalk.cyan("\n📋 Next steps:"));
  if (frontendOptions.framework && frontendOptions.framework !== "None") {
    console.log(chalk.white("⚛️ Frontend:"));
    console.log(chalk.gray("  cd frontend"));
    console.log(chalk.gray("  npm install"));
    console.log(chalk.gray("  npm run dev"));
    console.log(chalk.gray("  📝 Don't forget to configure your .env file!"));
  }
  if (backendOptions.framework && backendOptions.framework !== "None") {
    console.log(chalk.white("🌐 Backend:"));
    console.log(chalk.gray("  cd backend"));
    console.log(chalk.gray("  npm install"));
    console.log(chalk.gray("  npm run dev"));
    console.log(chalk.gray("  📝 Don't forget to configure your .env file!"));
  }

  console.log(chalk.yellow("\n💡 Pro Tips:"));
  console.log(
    chalk.gray(
      "  • Environment files (.env) have been created with common variables"
    )
  );
  console.log(
    chalk.gray("  • Update the database URLs and API keys in your .env files")
  );
  console.log(
    chalk.gray(
      "  • Run 'npm install' in both directories to install dependencies"
    )
  );
  console.log(
    chalk.gray("  • Check the README files in each directory for more details")
  );
}

// ----------------- CLI Prompts -----------------
const app = async () => {
  console.log(chalk.greenBright("🚀 Welcome to Launchr"));
  console.log(
    chalk.gray(
      "🔧 Setting up your project with the latest tools and best practices...\n"
    )
  );

  const spinner = ora({
    text: "🎯 Preparing project configuration...",
    color: "magenta",
  }).start();

  spinner.stop();

  const { project_type } = await prompt({
    type: "select",
    name: "project_type",
    message: "🎨 What type of project do you want to create?",
    choices: ["FrontEnd", "BackEnd", "Fullstack (Frontend + Backend)"],
  });

  let frontendOptions = {};
  let backendOptions = {};

  // FRONTEND
  if (
    project_type === "FrontEnd" ||
    project_type === "Fullstack (Frontend + Backend)"
  ) {
    const { framework } = await prompt({
      type: "select",
      name: "framework",
      message: "⚛️ What frontend framework do you want to use?",
      choices: [
        "React + Tailwind",
        "React TS + Tailwind",
        "Next.js + Tailwind",
        "Next.js TS + Tailwind",
        "Vue + Tailwind",
        "None",
      ],
    });

    const { tools } = await prompt({
      type: "multiselect",
      name: "tools",
      message: "🛠️ Which frontend tools would you like to include?",
      choices: [
        "shadcn/ui",
        "material ui",
        "Lucide Icons",
        "react-icons",
        "Zod",
        "Axios",
        "framer motion",
        "Redux",
        "zustand",
      ],
      hint: "- Space to select. Return to submit",
    });

    frontendOptions = { framework, tools };
  }

  // BACKEND
  if (
    project_type === "BackEnd" ||
    project_type === "Fullstack (Frontend + Backend)"
  ) {
    const { framework } = await prompt({
      type: "select",
      name: "framework",
      message: "🌐 What backend framework do you want to use?",
      choices: [
        "Node.js",
        "Express.js",
        "Express.js + ts",
        "Hapi.js",
        "Hapi.js + ts",
        "Koa",
        "None",
      ],
    });

    const { db } = await prompt({
      type: "select",
      name: "db",
      message: "🗄️ What database are you going to use?",
      choices: ["MongoDB", "Postgres", "MySQL", "SQLite", "ORM's", "None"],
    });

    let orm = null;
    if (db === "ORM's") {
      const res = await prompt({
        type: "select",
        name: "orm",
        message: "🔗 What ORM do you want to use?",
        choices: ["Sequelize", "TypeORM", "Prisma"],
      });
      orm = res.orm;
    }

    const { tools } = await prompt({
      type: "multiselect",
      name: "tools",
      message: "🛠️ What backend tools would you like to include?",
      choices: [
        "bcypt",
        "zod",
        "jsonwebtoken (JWT)",
        "jose",
        "helmet",
        "cors",
        "redis",
        "dotenv",
        "nodemailer",
        "nodemon",
      ],
      hint: "- Space to select. Return to submit",
    });

    backendOptions = { framework, db, orm, tools };
  }

  console.log(chalk.cyan("\n📋 Your project configuration:"));
  console.log(chalk.white("🎯 Project Type:"), chalk.yellow(project_type));
  if (frontendOptions.framework) {
    console.log(
      chalk.white("⚛️ Frontend:"),
      chalk.cyan(frontendOptions.framework)
    );
    if (frontendOptions.tools?.length) {
      console.log(
        chalk.white("🛠️ Frontend Tools:"),
        chalk.green(frontendOptions.tools.join(", "))
      );
    }
  }
  if (backendOptions.framework) {
    console.log(
      chalk.white("🌐 Backend:"),
      chalk.cyan(backendOptions.framework)
    );
    if (backendOptions.db) {
      console.log(
        chalk.white("🗄️ Database:"),
        chalk.magenta(backendOptions.db)
      );
    }
    if (backendOptions.orm) {
      console.log(chalk.white("🔗 ORM:"), chalk.magenta(backendOptions.orm));
    }
    if (backendOptions.tools?.length) {
      console.log(
        chalk.white("🛠️ Backend Tools:"),
        chalk.green(backendOptions.tools.join(", "))
      );
    }
  }
  console.log();

  // Start setup with loading spinner
  const setupSpinner = ora({
    text: "🚀 Starting project setup...",
    color: "cyan",
  }).start();

  setTimeout(() => {
    setupSpinner.stop();
  }, 1000);

  // RUN SETUP
  await setupProject({ frontendOptions, backendOptions });
};

app().catch(console.error);
