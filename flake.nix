{
  description = "MathApp – Full-stack dev environment (Next.js + FastAPI)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Runs under bash explicitly – never leaks into zsh/p10k
        setupScript = pkgs.writeShellScript "mathapp-setup" ''
          #!/usr/bin/env bash
          set -euo pipefail

          # Walk up from CWD until we find flake.nix
          ROOT="$PWD"
          while [ "$ROOT" != "/" ]; do
            [ -f "$ROOT/flake.nix" ] && break
            ROOT="$(dirname "$ROOT")"
          done

          printf '\n  MathApp Dev Environment\n'
          printf '  ──────────────────────────────────────\n'
          printf '  Root:   %s\n'   "$ROOT"
          printf '  Python: %s\n'   "$(python3 --version 2>&1)"
          printf '  Node:   %s\n'   "$(node --version 2>&1)"
          printf '  npm:    %s\n\n' "$(npm --version 2>&1)"

          VENV="$ROOT/backend/.venv"
          REQ="$ROOT/backend/requirements.txt"

          if [ ! -d "$VENV" ]; then
            printf '  Setting up Python venv...\n'
            python3 -m venv "$VENV"
            if [ -f "$REQ" ]; then
              "$VENV/bin/pip" install -q -r "$REQ"
              printf '  Backend deps installed.\n'
            else
              printf '  Warning: %s not found\n' "$REQ"
            fi
          fi

          FRONTEND="$ROOT/frontend"
          if [ -d "$FRONTEND" ] && [ ! -d "$FRONTEND/node_modules" ]; then
            printf '  Installing Node modules...\n'
            (cd "$FRONTEND" && npm install --silent)
            printf '  Frontend deps installed.\n'
          fi

          printf '\n  Run from %s:\n' "$ROOT"
          printf '    ./scripts/dev-backend.sh   ->  FastAPI  http://localhost:8000\n'
          printf '    ./scripts/dev-frontend.sh  ->  Next.js  http://localhost:3000\n\n'
        '';
      in {
        devShells.default = pkgs.mkShell {
          name = "mathapp-dev";

          buildInputs = with pkgs; [
            python312
            python312Packages.pip
            python312Packages.virtualenv
            nodejs_20
            nodePackages.npm
            curl
            jq
            git
          ];

          # One-liner: delegate to bash script – no inline zsh-hostile expansion
          shellHook = ''
            bash ${setupScript}
          '';
        };
      }
    );
}
