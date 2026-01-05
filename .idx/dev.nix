{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.firebase-tools
    pkgs.nodePackages.pnpm
  ];
  env = {};
  idx = {
    extensions = [
      "svelte.svelte-vscode"
      "vue.volar"
    ];
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
    workspace = {
      onCreate = {
        npm-install = "npm install && cd projects/work-tracker && npm install";
      };
      onStart = {
        # Example: start a background task
        # watch-css = "npm run watch-css";
      };
    };
  };
}
