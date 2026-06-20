// PM2 process definitions — used by the GitHub Actions deploy workflow.
// Both apps reference their scripts by local path so PM2 never relies on
// PATH resolution when starting or restarting.
module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: `${require("os").homedir()}/USAII/frontend`,
      script: "./node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "backend",
      cwd: `${require("os").homedir()}/USAII/backend`,
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
