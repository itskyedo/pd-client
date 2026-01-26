#!/bin/sh

set -eu

OUTPUT_DIR="./src/_generated"
SCHEMAS_FILE="./schemas"
PATCHES_DIR="./scripts/patches"

check_prerequisites() {
  if [ ! -f "./package.json" ]; then
    echo "Error: Script should be run from within the project root" >&2
    exit 1
  fi

  if [ ! -f "$SCHEMAS_FILE" ]; then
    echo "Error: Schemas file not found" >&2
    exit 1
  fi

  if ! command -v npx >/dev/null 2>&1; then
    echo "Error: npx is not installed" >&2
    exit 1
  fi
}

prepare_output_dir() {
  if [ ! -d "$OUTPUT_DIR" ]; then
    echo "Creating output directory: $OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR"
  else
    echo "Clearing output directory: $OUTPUT_DIR"
    rm -f "${OUTPUT_DIR}"/*
  fi
}

generate_types() {
  name="$1"
  url="$2"
  output_path="$3"

  if ! npx openapi-typescript "$url" -o "$output_path"; then
    echo "Error: Failed to generate $name" >&2
    exit 1
  fi
}

apply_patches() {
  name="$1"
  output_path="$2"
  patch_script="${PATCHES_DIR}/${name}.sh"

  if [ -f "$patch_script" ]; then
    echo "  Applying patches for $name"
    if ! sh "$patch_script" "$output_path"; then
      echo "Error: Patch script failed for $name" >&2
      exit 1
    fi
  else
    echo "No patches found for $name"
  fi
}

process_schemas() {
  total=0

  while read -r line || [ -n "$line" ]; do
    case "$line" in
    "" | \#*) continue ;;
    esac

    name="${line%%=*}"
    url="${line#*=}"

    if [ -z "$name" ] || [ -z "$url" ] || [ "$name" = "$line" ]; then
      echo "Warning: Skipping invalid entry: $line" >&2
      continue
    fi

    total=$((total + 1))
    output_path="${OUTPUT_DIR}/openapi-${name}.d.ts"

    echo "[$total] $name"
    generate_types "$name" "$url" "$output_path"
    apply_patches "$name" "$output_path"
  done <"$SCHEMAS_FILE"
}

check_prerequisites
prepare_output_dir
process_schemas
